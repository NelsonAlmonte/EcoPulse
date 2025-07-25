import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma.service';
import {
  AuthResponseDto,
  LogInUserDto,
  RefreshUserSessionDto,
  SignupUserDto,
} from './auth.dto';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  // async validateUser(
  //   email: string,
  //   pass: string,
  // ): Promise<ValidatedUser | null> {
  //   const user = await this.prisma.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });

  //   if (user && (await bcrypt.compare(pass, user.password))) {
  //     const { password, ...result } = user;
  //     return result;
  //   }

  //   return null;
  // }

  async login(logInUserDto: LogInUserDto): Promise<AuthResponseDto> {
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: logInUserDto.email,
      password: logInUserDto.password,
    });

    if (error) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const reponse: AuthResponseDto = {
      id: data.user.id,
      email: data.user.email,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };

    return reponse;
  }

  async signUpUser(signupUserDto: SignupUserDto): Promise<AuthResponseDto> {
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase.auth.signUp({
      email: signupUserDto.email,
      password: signupUserDto.password,
    });

    if (error) {
      console.log(error);
      return null;
    }

    const userToBeCreated: CreateUserDto = {
      id: data.user.id,
      name: signupUserDto.name,
      last: signupUserDto.last,
      email: signupUserDto.email,
      password: await this.encryptPassword(signupUserDto.password),
      role: 'USER',
    };
    const createdUser = await this.userService.createUser(userToBeCreated);

    if (!createdUser) return null;

    const response: AuthResponseDto = {
      id: data.user.id,
      email: data.user.email,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };

    return response;
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async refreshSession(
    refreshUserSessionDto: RefreshUserSessionDto,
  ): Promise<AuthResponseDto> {
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshUserSessionDto.refresh_token,
    });

    if (error) {
      throw new UnauthorizedException('Error al refrescar la sesión');
    }

    const response: AuthResponseDto = {
      id: data.user.id,
      email: data.user.email,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };

    return response;
  }
}

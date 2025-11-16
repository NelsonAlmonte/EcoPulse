import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  supabase: SupabaseClient;

  constructor(private userService: UserService) {
    this.supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
        },
      },
    );
  }

  async login(logInUserDto: LogInUserDto): Promise<AuthResponseDto> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email: logInUserDto.email,
      password: logInUserDto.password,
    });

    if (error) {
      throw new UnauthorizedException(
        'Credenciales invalidas. Intentelo nuevamente.',
      );
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
    const { data, error } = await this.supabase.auth.signUp({
      email: signupUserDto.email,
      password: signupUserDto.password,
    });

    if (error) {
      console.log(error);
      throw new HttpException(
        {
          status: 422,
          message:
            'Ya existe un usuario registrado con este correo electrónico.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
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

    if (!createdUser) {
      throw new HttpException(
        {
          status: 400,
          message: 'Error al crear el usuario. Intentalo nuevamente.',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

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
    const { data, error } = await this.supabase.auth.refreshSession({
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

  async getLoggedUserId(accessToken: string): Promise<string> {
    const { data, error } = await this.supabase.auth.getUser(accessToken);

    if (error) {
      console.log(error);
      throw new UnauthorizedException('Error al obtener el usuario');
    }

    return data.user.id;
  }
}

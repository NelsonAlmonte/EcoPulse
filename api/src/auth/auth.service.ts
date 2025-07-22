import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma.service';
import { LogInUserDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(logInUserDto: LogInUserDto) {
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
      email: logInUserDto.email,
      password: logInUserDto.password,
    });

    if (error) {
      console.log(error);
      return null;
    }

    return data;
    // const payload = { email: user.email, sub: user.userId };
    // return {
    //   access_token: this.jwtService.sign(payload),
    // };
  }

  async signUpUser(user: any) {
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.log(error);
      return null;
    }

    return data;
    //TODO: Create user in user table
  }
}

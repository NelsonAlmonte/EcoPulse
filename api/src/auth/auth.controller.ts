import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto, RefreshUserSessionDto, SignupUserDto } from './auth.dto';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LogInUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('signup')
  async sigup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUpUser(signupUserDto);
  }

  @Post('refresh')
  async refresh(@Body() refreshUserSessionDto: RefreshUserSessionDto) {
    return this.authService.refreshSession(refreshUserSessionDto);
  }
}

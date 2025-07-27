import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto, RefreshUserSessionDto, SignupUserDto } from './auth.dto';

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

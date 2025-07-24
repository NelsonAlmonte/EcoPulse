import { Body, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LogInUserDto, SignupUserDto } from './auth.dto';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginUserDto: LogInUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('foo')
  foo() {
    return 'Siuuuuuuu';
  }

  @Post('signup')
  async sigup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUpUser(signupUserDto);
  }
}

import { Request, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { SignupUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    console.log(req);
    return req.user.token;
    // return this.authService.login(req.body);
  }

  @Post('signup')
  async sigup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signUpUser(signupUserDto);
  }
}

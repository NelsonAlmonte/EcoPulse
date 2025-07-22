import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_CONSTANT,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, PrismaService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

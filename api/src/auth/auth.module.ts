import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [],
  providers: [UserService, PrismaService],
  controllers: [],
})
export class AuthModule {}

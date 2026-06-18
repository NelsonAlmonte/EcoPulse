import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma.service';
import { IssueService } from 'src/issue/issue.service';

@Module({
  controllers: [UserController],
  providers: [UserService, IssueService, PrismaService],
})
export class UserModule {}

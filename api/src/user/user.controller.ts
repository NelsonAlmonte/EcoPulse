import { Controller, Get, Param } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get(':user/issues')
  async issueByUser(@Param('user') userId: string): Promise<Issue[] | null> {
    return await this.userService.getIssues(userId);
  }
}

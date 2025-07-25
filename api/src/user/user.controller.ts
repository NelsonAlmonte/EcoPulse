import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { Issue } from '@prisma/client';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get(':user/issues')
  async issueByUser(@Param('user') userId: string): Promise<Issue[] | null> {
    return await this.userService.getIssues(userId);
  }
}

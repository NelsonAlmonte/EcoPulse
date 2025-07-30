import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { GetIssueDto } from 'src/issue/issue.dto';
import { GetUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get(':user/issues')
  async issueByUser(
    @Param('user') userId: string,
  ): Promise<GetIssueDto[] | null> {
    return await this.userService.getIssues(userId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async user(@Param('id') id: string): Promise<GetUserDto | null> {
    return await this.userService.getUser(id);
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { GetIssueDto } from 'src/issue/issue.dto';
import { GetUserDto, UpdateUserDto } from './user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

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

  @UseGuards(SupabaseAuthGuard)
  @Put(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<GetUserDto | BadRequestException> {
    const updatedUser = await this.userService.updateUser(updateUserDto, id);

    if (!updatedUser) {
      throw new BadRequestException('Error al actualizar el usuario');
    }

    return updatedUser;
  }
}

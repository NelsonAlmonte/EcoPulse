import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { GetIssueDto } from 'src/issue/issue.dto';
import { GetUserDto, UpdateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @UseGuards(SupabaseAuthGuard)
  @Get(':user/issues')
  async issuesByUser(
    @Param('user') userId: string,
    @Query('amount') amount?: number,
  ): Promise<GetIssueDto[] | null> {
    const amountToTake =
      typeof amount === 'string' && amount === 'undefined'
        ? undefined
        : Number(amount);

    return await this.userService.getIssues(userId, amountToTake);
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async user(@Param('id') id: string): Promise<GetUserDto | null> {
    return await this.userService.getUser(id);
  }

  // @UseGuards(SupabaseAuthGuard)
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

  // @UseGuards(SupabaseAuthGuard)
  @Get(':user/issues/count')
  async countUserIssues(@Param('user') userId: string): Promise<number> {
    return await this.userService.countUserIssues(userId);
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':user/highlights/given')
  async highlightsGiven(
    @Param('user') userId: string,
  ): Promise<GetIssueDto[] | null> {
    return await this.userService.getHighlightsGiven(userId);
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':user/highlights/given/count')
  async countHighlightsGiven(@Param('user') userId: string): Promise<number> {
    return await this.userService.countHighlightsGiven(userId);
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':user/highlights/received/count')
  async countHighlightsReceived(
    @Param('user') userId: string,
  ): Promise<number> {
    return await this.userService.countHighlightsReceived(userId);
  }
}

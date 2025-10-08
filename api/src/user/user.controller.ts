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
import { List } from 'src/util/interfaces/response.dto';
import { buildPaginationParams } from 'src/util/functions/pagination.functions';

@Controller('user')
export class UserController {
  DEFAULT_PAGE = '1';
  DEFAULT_AMOUNT = '5';

  constructor(private userService: UserService) {}

  @Get('list')
  async usersList(
    @Query('page') page: string = this.DEFAULT_PAGE,
    @Query('amount') amount: string = this.DEFAULT_AMOUNT,
  ): Promise<List<GetUserDto[]> | null> {
    const users = await this.userService.getUsersList(
      buildPaginationParams(page, amount),
    );

    if (!users) return null;

    const usersList: List<GetUserDto[]> = {
      data: users,
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total: await this.userService.countUsers(),
      },
    };

    return usersList;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':user/issues')
  async issuesByUser(
    @Param('user') userId: string,
    @Query('amount') amount?: string,
  ): Promise<GetIssueDto[] | null> {
    const amountToTake = amount ? Number(amount) : undefined;

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

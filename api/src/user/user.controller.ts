import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { AdminGuard } from 'src/auth/admin.guard';
import { GetIssueDto, GetIssueListDto } from 'src/issue/issue.dto';
import { GetUserDto, UpdateUserDto } from './user.dto';
import { List } from 'src/util/interfaces/response.dto';
import { buildPaginationParams } from 'src/util/functions/pagination.functions';
import { IssueService } from 'src/issue/issue.service';
import {
  buildFilterParams,
  buildOrderParam,
} from 'src/util/functions/filter.functions';
import { Prisma, User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private issueService: IssueService,
  ) {}

  @UseGuards(SupabaseAuthGuard, AdminGuard)
  @Get('list')
  async usersList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('amount', new DefaultValuePipe(6), ParseIntPipe) amount: number,
  ): Promise<List<GetUserDto[]> | null> {
    const [users, total] = await Promise.all([
      this.userService.getUsersList(buildPaginationParams(page, amount)),
      this.userService.countUsers(),
    ]);

    if (!users) return null;

    const usersList: List<GetUserDto[]> = {
      data: users,
      pagination: {
        page: page,
        amount: amount,
        total,
      },
    };

    return usersList;
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':user/issues')
  async issuesByUser(
    @Param('user') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('amount', new DefaultValuePipe(6), ParseIntPipe) amount: number,
    @Query('status') status?: string,
    @Query('defined_date') defined_date?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('categories') categories?: string,
    @Query('order') order?: string,
    @Query('all') all?: string,
  ): Promise<List<GetIssueListDto[]> | null> {
    const where = buildFilterParams(
      status,
      defined_date,
      start_date,
      end_date,
      categories,
      all,
    );

    Object.assign(where, { userId });

    const orderFilter = buildOrderParam(order);
    const [issues, total] = await Promise.all([
      this.userService.getIssues(
        userId,
        buildPaginationParams(page, amount),
        where,
        orderFilter,
      ),
      this.issueService.countIssues(where),
    ]);

    if (!issues) return null;

    const issueList: List<GetIssueListDto[]> = {
      data: issues.map((issue) => ({
        ...issue,
        photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
      })),
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total,
      },
    };

    return issueList;
  }

  @UseGuards(SupabaseAuthGuard)
  @Get('count')
  async countUsers(
    @Query('isActive', new ParseBoolPipe({ optional: true }))
    isActive?: boolean,
  ): Promise<number | null> {
    const where: Prisma.UserWhereInput = {
      isActive,
    };

    return this.userService.countUsers(where);
  }

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

  @UseGuards(SupabaseAuthGuard)
  @Get(':user/issues/count')
  async countUserIssues(@Param('user') userId: string): Promise<number> {
    return await this.userService.countUserIssues(userId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':user/highlights/given')
  async highlightsGiven(
    @Param('user') userId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('amount', new DefaultValuePipe(6), ParseIntPipe) amount: number,
    @Query('status') status?: string,
    @Query('order') order?: string,
  ): Promise<List<GetIssueDto[]>> {
    const where = buildFilterParams(status);
    const orderFilter = buildOrderParam(order);
    const [highlights, total] = await Promise.all([
      this.userService.getHighlightsGiven(
        userId,
        buildPaginationParams(page, amount),
        where,
        orderFilter,
      ),
      this.userService.countHighlightsGiven(userId),
    ]);

    const highlightList: List<GetIssueDto[]> = {
      data: highlights.map((highlight) => ({
        ...highlight,
        photo: `${process.env.PUBLIC_BUCKET_URL}/${highlight.photo}`,
      })),
      pagination: {
        page: page,
        amount: amount,
        total,
      },
    };

    return highlightList;
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':user/highlights/given/count')
  async countHighlightsGiven(@Param('user') userId: string): Promise<number> {
    return await this.userService.countHighlightsGiven(userId);
  }

  @UseGuards(SupabaseAuthGuard)
  @Get(':user/highlights/received/count')
  async countHighlightsReceived(
    @Param('user') userId: string,
  ): Promise<number> {
    return await this.userService.countHighlightsReceived(userId);
  }

  @Post()
  async create(
    @Body() createUserDto: Prisma.UserCreateInput,
  ): Promise<User | BadRequestException> {
    const user = await this.userService.createUser({
      ...createUserDto,
      role: 'USER',
      isActive: true,
    });

    if (!user) {
      throw new BadRequestException('Error al crear el usuario.');
    }

    return user;
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { Issue, Prisma, Status } from '@prisma/client';
import {
  CreateIssueDto,
  GetIssueDto,
  GetIssueListDto,
  SupaBaseUploadFileResponse,
  UpdateIssueDto,
} from 'src/issue/issue.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { List } from 'src/util/interfaces/response.dto';
import { Bounds } from './issue.params';
import { PaginationParams } from 'src/util/interfaces/response.params';
import { buildPaginationParams } from 'src/util/functions/pagination.functions';
import {
  buildFilterParams,
  buildOrderParam,
} from 'src/util/functions/filter.functions';

@Controller('issue')
export class IssueController {
  constructor(private issueService: IssueService) {}

  // @UseGuards(SupabaseAuthGuard)
  @Get()
  async issues(): Promise<Issue[] | null> {
    const issues = await this.issueService.getIssues();

    if (!issues) return null;

    return issues.map((issue) => ({
      ...issue,
      photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
    }));
  }

  @Get('list')
  async issuesList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('amount', new DefaultValuePipe(5), ParseIntPipe) amount: number,
    @Query('status') status?: string,
    @Query('defined_date') defined_date?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('categories') categories?: string,
    @Query('order') order?: string,
    @Query('all') all?: string,
  ): Promise<List<Issue[]> | null> {
    const where = buildFilterParams(
      status,
      defined_date,
      start_date,
      end_date,
      categories,
      all,
    );
    const orderFilter = buildOrderParam(order);
    const issues = await this.issueService.getIssuesList(
      buildPaginationParams(page, amount),
      where,
      orderFilter,
    );

    if (!issues) return null;

    const issueList: List<Issue[]> = {
      data: issues.map((issue) => ({
        ...issue,
        photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
      })),
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total: await this.issueService.countIssues(where),
      },
    };

    return issueList;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get('in-bound')
  async issuesInBounds(
    @Query('north') north: string,
    @Query('south') south: string,
    @Query('east') east: string,
    @Query('west') west: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('amount', ParseIntPipe) amount: number,
    @Query('status') status?: string,
    @Query('defined_date') defined_date?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('categories') categories?: string,
    @Query('order') order?: string,
    @Query('all') all?: string,
    @Query('userId') userId?: string,
  ): Promise<List<GetIssueListDto[]> | null> {
    const bounds: Bounds = {
      north: Number(north),
      south: Number(south),
      east: Number(east),
      west: Number(west),
    };
    let paginationParams: PaginationParams | undefined = undefined;

    if (page || amount) paginationParams = buildPaginationParams(page, amount);

    const where: Prisma.IssueWhereInput = {
      latitude: {
        gte: bounds.south,
        lte: bounds.north,
      },
      longitude: {
        gte: bounds.west,
        lte: bounds.east,
      },
      userId,
    };

    if (userId) where.userId = userId;

    Object.assign(
      where,
      buildFilterParams(
        status,
        defined_date,
        start_date,
        end_date,
        categories,
        all,
      ),
    );

    const orderFilter = buildOrderParam(order);
    const issues = await this.issueService.getIssuesInBounds(
      paginationParams,
      where,
      orderFilter,
    );

    if (!issues) return null;

    const issueList: List<GetIssueListDto[]> = {
      data: issues.map((issue) => ({
        ...issue,
        photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
      })),
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total: await this.issueService.countIssues(where),
      },
    };

    return issueList;
  }

  @Get('coords')
  async issuesCoordinates(
    @Query('status') status?: string,
    @Query('defined_date') defined_date?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('categories') categories?: string,
    @Query('all') all?: string,
  ): Promise<List<Pick<Issue, 'latitude' | 'longitude'>[]> | null> {
    const where = buildFilterParams(
      status,
      defined_date,
      start_date,
      end_date,
      categories,
      all,
    );
    const issues = await this.issueService.getIssuesCoordinates(where);

    if (!issues) return null;

    const issueList: List<Pick<Issue, 'latitude' | 'longitude'>[]> = {
      data: issues,
      pagination: {
        page: 1,
        amount: 10,
        total: await this.issueService.countIssues(where),
      },
    };

    return issueList;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get('count')
  async countIssues(@Query('status') status?: Status): Promise<number | null> {
    const where: Prisma.IssueWhereInput = {
      status,
    };

    return this.issueService.countIssues(where);
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':issueId/:userId')
  async issue(
    @Param('issueId') issueId: string,
    @Param('userId') userId: string,
  ): Promise<GetIssueDto> {
    const issue = await this.issueService.getIssue(issueId, userId);

    if (!issue) {
      throw new NotFoundException(`Esta incidencia no pudo ser encontrada.`);
    }

    return {
      ...issue,
      photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
    };
  }

  // @UseGuards(SupabaseAuthGuard)
  @Post()
  async create(
    @Body() createIssueDto: CreateIssueDto,
  ): Promise<Issue | BadRequestException> {
    const issue: Prisma.IssueCreateInput = {
      photo: createIssueDto.photo,
      latitude: createIssueDto.latitude,
      longitude: createIssueDto.longitude,
      comment: createIssueDto.comment,
      category: {
        connect: { id: createIssueDto.category },
      },
      user: { connect: { id: createIssueDto.user } },
    };
    const createdIssue = await this.issueService.createIssue(issue);

    if (!createdIssue) {
      throw new BadRequestException('Unexpected error when creating a issue');
    }

    return {
      ...createdIssue,
      photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
    };
  }

  // @UseGuards(SupabaseAuthGuard)
  @Put(':id')
  async update(
    @Body() updateIssueDto: UpdateIssueDto,
    @Param('id') id: string,
  ): Promise<Issue | BadRequestException> {
    const issue: Prisma.IssueUpdateInput = {};

    for (const [key, value] of Object.entries(updateIssueDto)) {
      if (['category', 'user'].includes(key)) {
        if (!value) continue;
        issue[key] = { connect: { id: value } };
      } else {
        issue[key] = value;
      }
    }

    const updatedIssue = await this.issueService.updateIssue(issue, id);

    if (!updatedIssue) {
      throw new BadRequestException('Unexpected error when updating a issue');
    }

    return {
      ...updatedIssue,
      photo: `${process.env.PUBLIC_BUCKET_URL}/${updatedIssue.photo}`,
    };
  }

  // @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Issue | BadRequestException> {
    const issue = await this.issueService.deleteIssue(id);

    if (!issue) {
      throw new BadRequestException('Unexpected error when deleting a issue');
    }

    return {
      ...issue,
      photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
    };
  }

  // @UseGuards(SupabaseAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(
    @UploadedFile() photo: Express.Multer.File,
  ): Promise<SupaBaseUploadFileResponse | BadRequestException> {
    const uploadedPhoto = await this.issueService.uploadPhoto(photo);

    if (!uploadedPhoto) {
      throw new BadRequestException(
        'Unexpected error when uploading the photo',
      );
    }

    return uploadedPhoto;
  }
}

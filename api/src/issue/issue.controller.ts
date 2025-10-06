import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import { Bounds, IssueFilterParams } from './issue.params';
import { PaginationParams } from 'src/util/interfaces/response.params';
import { buildPaginationParams } from 'src/util/functions/pagination.functions';

@Controller('issue')
export class IssueController {
  DEFAULT_PAGE = '1';
  DEFAULT_AMOUNT = '5';

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
    @Query('page') page: string = this.DEFAULT_PAGE,
    @Query('amount') amount: string = this.DEFAULT_AMOUNT,
    @Query('status') status?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('categories') categories?: string,
    @Query('order') order?: string,
  ): Promise<List<Issue[]> | null> {
    const filter = this.buildFilterParams(
      status,
      start_date,
      end_date,
      categories,
      order,
    );
    const where: Prisma.IssueWhereInput = {
      status: {
        in: filter.status,
      },
      createdAt: {
        gte: filter.start_date,
        lte: filter.end_date,
      },
      categoryId: {
        in: filter.categories,
      },
    };
    const issues = await this.issueService.getIssuesList(
      buildPaginationParams(page, amount),
      where,
      filter.order,
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

  buildFilterParams(
    status?: string,
    start_date?: string,
    end_date?: string,
    categories?: string,
    order?: string,
  ): IssueFilterParams {
    return {
      status: status ? (status.split(',') as Status[]) : undefined,
      start_date: start_date ? new Date(start_date) : undefined,
      end_date: end_date ? new Date(end_date) : undefined,
      categories: categories ? categories.split(',') : undefined,
      order: this.buildOrderParam(order),
    };
  }

  buildOrderParam(
    order?: string,
  ): Prisma.IssueOrderByWithRelationInput | undefined {
    let orderBy: Prisma.IssueOrderByWithRelationInput | undefined = undefined;

    if (order) {
      const column = order.split(':')[0];
      const value = order.split(':')[1] as Prisma.SortOrder;

      if (column === 'highlights') {
        orderBy = {
          highlights: {
            _count: value,
          },
        };
      } else {
        orderBy = {
          [order.split(':')[0]]: order.split(':')[1],
        };
      }
    }

    return orderBy;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get('in-bound')
  async issuesInBounds(
    @Query('north') north: string,
    @Query('south') south: string,
    @Query('east') east: string,
    @Query('west') west: string,
    @Query('page') page?: string,
    @Query('amount') amount?: string,
    @Query('status') status?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('categories') categories?: string,
    @Query('order') order?: string,
  ): Promise<List<GetIssueListDto[]> | null> {
    const bounds: Bounds = {
      north: Number(north),
      south: Number(south),
      east: Number(east),
      west: Number(west),
    };
    const filter = this.buildFilterParams(
      status,
      start_date,
      end_date,
      categories,
      order,
    );
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
      status: {
        in: filter.status,
      },
      createdAt: {
        gte: filter.start_date,
        lte: filter.end_date,
      },
      categoryId: {
        in: filter.categories,
      },
    };
    const issues = await this.issueService.getIssuesInBounds(
      paginationParams,
      where,
      filter.order,
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
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('categories') categories?: string,
  ): Promise<List<Pick<Issue, 'latitude' | 'longitude'>[]> | null> {
    const filter = this.buildFilterParams(
      status,
      start_date,
      end_date,
      categories,
    );
    const where: Prisma.IssueWhereInput = {
      status: {
        in: filter.status,
      },
      createdAt: {
        gte: filter.start_date,
        lte: filter.end_date,
      },
      categoryId: {
        in: filter.categories,
      },
    };
    const issues = await this.issueService.getIssuesCoordinates(where);

    if (!issues) return null;

    const issueList: List<Pick<Issue, 'latitude' | 'longitude'>[]> = {
      data: issues,
      pagination: {
        page: Number(this.DEFAULT_PAGE),
        amount: Number(this.DEFAULT_AMOUNT),
        total: await this.issueService.countIssues(where),
      },
    };

    return issueList;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':issueId/:userId')
  async issue(
    @Param('issueId') issueId: string,
    @Param('userId') userId: string,
  ): Promise<GetIssueDto | null> {
    const issue = await this.issueService.getIssue(issueId, userId);

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

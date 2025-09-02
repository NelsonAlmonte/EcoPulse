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
import { Issue, Prisma } from '@prisma/client';
import {
  CreateIssueDto,
  GetIssueDto,
  SupaBaseUploadFileResponse,
  UpdateIssueDto,
} from 'src/issue/issue.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { List } from 'src/response.dto';

@Controller('issue')
export class IssueController {
  DEFAULT_PAGE = '1';
  DEFAULT_AMOUNT = '5';
  DEFAULT_BOUNDS = {
    north: 18.8009047,
    south: 18.6009047,
    east: -70.0654584,
    west: -70.2654584,
  };

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
  ): Promise<List<Issue[]> | null> {
    const skip = page !== '1' ? (Number(page) - 1) * Number(amount) : 0;
    const take = Number(amount);
    const issues = await this.issueService.getIssuesList(skip, take);

    if (!issues) return null;

    const issueList: List<Issue[]> = {
      data: issues.map((issue) => ({
        ...issue,
        photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
      })),
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total: await this.issueService.countIssues(),
      },
    };

    return issueList;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get('in-bound')
  async issuesInBounds(
    @Query('north') north: number = this.DEFAULT_BOUNDS.north,
    @Query('south') south: number = this.DEFAULT_BOUNDS.south,
    @Query('east') east: number = this.DEFAULT_BOUNDS.east,
    @Query('west') west: number = this.DEFAULT_BOUNDS.west,
    @Query('page') page: string = this.DEFAULT_PAGE,
    @Query('amount') amount: string = '6',
  ): Promise<List<Issue[]> | null> {
    const skip = page !== '1' ? (Number(page) - 1) * Number(amount) : 0;
    const take = Number(amount);
    const issues = await this.issueService.getIssuesInBounds(
      Number(north),
      Number(south),
      Number(east),
      Number(west),
      skip,
      take,
    );
    const where: Prisma.IssueWhereInput = {
      AND: [
        {
          latitude: {
            gte: Number(south),
            lte: Number(north),
          },
          longitude: {
            gte: Number(west),
            lte: Number(east),
          },
        },
      ],
    };

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

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { Issue, Prisma } from '@prisma/client';
import {
  CreateIssueDto,
  SupaBaseUploadFileResponse,
  UpdateIssueDto,
} from 'src/issue/issue.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';

@Controller('issue')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get()
  async issues(): Promise<Issue[] | null> {
    const issues = await this.issueService.getIssues();

    if (!issues) return null;

    return issues.map((issue) => ({
      ...issue,
      photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
    }));
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':issueId/:userId')
  async issue(
    @Param('issueId') issueId: string,
    @Param('userId') userId: string,
  ): Promise<Issue | null> {
    return await this.issueService.getIssue(issueId, userId);
  }

  @UseGuards(SupabaseAuthGuard)
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

  @UseGuards(SupabaseAuthGuard)
  @Put(':id')
  async update(
    @Body() updateIssueDto: UpdateIssueDto,
    @Param('id') id: string,
  ): Promise<Issue | BadRequestException> {
    const issue: Prisma.IssueUpdateInput = {
      photo: updateIssueDto.photo,
      status: updateIssueDto.status,
      latitude: updateIssueDto.latitude,
      longitude: updateIssueDto.longitude,
      category: {
        connect: { id: updateIssueDto.category },
      },
      user: { connect: { id: updateIssueDto.user } },
    };
    const updatedIssue = await this.issueService.updateIssue(issue, id);

    if (!updatedIssue) {
      throw new BadRequestException('Unexpected error when updating a issue');
    }

    return {
      ...updatedIssue,
      photo: `${process.env.PUBLIC_BUCKET_URL}/${issue.photo}`,
    };
  }

  @UseGuards(SupabaseAuthGuard)
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

  @UseGuards(SupabaseAuthGuard)
  @Get(':latitude/:longitude')
  async issueByCoords(
    @Param('latitude') latitude: string,
    @Param('longitude') longitude: string,
  ): Promise<Issue | null> {
    return await this.issueService.getIssueByCoords(latitude, longitude);
  }

  @UseGuards(SupabaseAuthGuard)
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

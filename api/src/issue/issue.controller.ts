import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IssueService } from './issue.service';
import { Issue, Prisma } from '@prisma/client';
import { CreateIssueDto, UpdateIssueDto } from 'src/dto/issue.dto';

@Controller('issue')
export class IssueController {
  constructor(private issueService: IssueService) {}

  @Get()
  async issues(): Promise<Issue[]> {
    return await this.issueService.getIssues();
  }

  @Get(':id')
  async issue(@Param('id') id: string): Promise<Issue> {
    return await this.issueService.getIssue(id);
  }

  @Post()
  async create(
    @Body() createIssueDto: CreateIssueDto,
  ): Promise<Issue | BadRequestException> {
    const issue: Prisma.IssueCreateInput = {
      photo: createIssueDto.photo,
      coordinates: createIssueDto.coordinates,
      category: {
        connect: { id: createIssueDto.category },
      },
      user: { connect: { id: createIssueDto.user } },
    };
    const createdIssue = await this.issueService.createIssue(issue);

    if (!createdIssue) {
      throw new BadRequestException('Unexpected error when creating a issue');
    }

    return createdIssue;
  }

  @Put(':id')
  async update(
    @Body() updateIssueDto: UpdateIssueDto,
    @Param('id') id: string,
  ): Promise<Issue | BadRequestException> {
    const issue: Prisma.IssueUpdateInput = {
      photo: updateIssueDto.photo,
      status: updateIssueDto.status,
      coordinates: updateIssueDto.coordinates,
      category: {
        connect: { id: updateIssueDto.category },
      },
      user: { connect: { id: updateIssueDto.user } },
    };
    const updatedIssue = await this.issueService.updateIssue(issue, id);

    if (!updatedIssue) {
      throw new BadRequestException('Unexpected error when updating a issue');
    }

    return updatedIssue;
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Issue | BadRequestException> {
    const issue = await this.issueService.deleteIssue(id);

    if (!issue) {
      throw new BadRequestException('Unexpected error when deleting a issue');
    }

    return issue;
  }
}

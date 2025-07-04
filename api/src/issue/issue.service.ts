import { Injectable } from '@nestjs/common';
import { Issue, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  async getIssues(): Promise<Issue[]> {
    return this.prisma.issue.findMany();
  }

  async getIssue(id: string): Promise<Issue> {
    return this.prisma.issue.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createIssue(createIssueDto: Prisma.IssueCreateInput): Promise<Issue> {
    return this.prisma.issue.create({
      data: createIssueDto,
    });
  }

  async updateIssue(
    updateIssueDto: Prisma.IssueUpdateInput,
    id: string,
  ): Promise<Issue> {
    return this.prisma.issue.update({
      data: updateIssueDto,
      where: {
        id: id,
      },
    });
  }

  async deleteIssue(id: string): Promise<Issue> {
    return this.prisma.issue.delete({
      where: {
        id: id,
      },
    });
  }
}

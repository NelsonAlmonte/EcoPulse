import { Injectable } from '@nestjs/common';
import { Issue, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  async getIssues(): Promise<Issue[] | null> {
    return this.prisma.issue.findMany({
      include: {
        category: true,
      },
    });
  }

  async getIssue(id: string): Promise<Issue | null> {
    return this.prisma.issue.findUnique({
      where: {
        id: id,
      },
      include: {
        category: true,
        user: true,
      },
    });
  }

  async createIssue(createIssueDto: Prisma.IssueCreateInput): Promise<Issue> {
    return this.prisma.issue.create({
      data: createIssueDto,
      include: {
        category: true,
        user: true,
      },
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
      include: {
        category: true,
        user: true,
      },
    });
  }

  async deleteIssue(id: string): Promise<Issue> {
    return this.prisma.issue.delete({
      where: {
        id: id,
      },
      include: {
        category: true,
        user: true,
      },
    });
  }

  async getIssueByCoords(
    latitude: string,
    longitude: string,
  ): Promise<Issue | null> {
    return this.prisma.issue.findFirst({
      where: {
        latitude: latitude,
        longitude: longitude,
      },
      include: {
        category: true,
        user: true,
      },
    });
  }
}

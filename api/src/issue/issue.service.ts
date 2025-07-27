import { Injectable } from '@nestjs/common';
import { Issue, Prisma } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';
import { SupaBaseUploadFileResponse } from 'src/issue/issue.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IssueService {
  constructor(private prisma: PrismaService) {}

  async getIssues(): Promise<Issue[] | null> {
    return this.prisma.issue.findMany({
      include: {
        category: true,
        user: true,
      },
    });
  }

  async getIssue(id: string): Promise<Issue | null> {
    return this.prisma.issue.findUnique({
      where: {
        id,
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
        id,
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
        latitude,
        longitude,
      },
      include: {
        category: true,
        user: true,
      },
    });
  }

  async uploadPhoto(
    file: Express.Multer.File,
  ): Promise<SupaBaseUploadFileResponse | null> {
    const supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
    );
    const { data, error } = await supabase.storage
      .from('issues')
      .upload(file.originalname, file.buffer, {
        contentType: 'image/jpeg',
      });

    if (error) return null;

    return data;
  }
}

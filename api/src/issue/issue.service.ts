import { BadRequestException, Injectable } from '@nestjs/common';
import { Issue, Prisma } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GetIssueDto, SupaBaseUploadFileResponse } from 'src/issue/issue.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class IssueService {
  supabase: SupabaseClient;

  constructor(private prisma: PrismaService) {
    this.supabase = createClient(
      process.env.PUBLIC_SUPABASE_URL,
      process.env.PUBLIC_SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
        },
      },
    );
  }

  getIssues(): Promise<Issue[] | null> {
    return this.prisma.issue.findMany({
      include: {
        category: true,
        user: {
          omit: {
            password: true,
            role: true,
          },
        },
      },
    });
  }

  getIssuesList(skip: number, take: number): Promise<Issue[] | null> {
    return this.prisma.issue.findMany({
      skip,
      take,
      include: {
        category: true,
        user: {
          omit: {
            password: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  countIssues(): Promise<number> {
    return this.prisma.highlight.count();
  }

  async getIssue(issueId: string, userId: string): Promise<GetIssueDto | null> {
    const issue = await this.prisma.issue.findUnique({
      where: {
        id: issueId,
      },
      include: {
        category: true,
        user: {
          omit: {
            password: true,
            role: true,
          },
        },
        highlights: {
          where: {
            userId,
          },
          select: {
            createdAt: true,
          },
          take: 1,
        },
        _count: {
          select: {
            highlights: true,
          },
        },
      },
    });
    const transformedIssue = {
      ...issue,
      highlights: issue._count.highlights ? issue._count.highlights : 0,
      hasCurrentUserHighlight: issue.highlights.length ? true : false,
    };

    delete transformedIssue._count;

    return transformedIssue;
  }

  createIssue(createIssueDto: Prisma.IssueCreateInput): Promise<Issue> {
    return this.prisma.issue.create({
      data: createIssueDto,
      include: {
        category: true,
        user: true,
      },
    });
  }

  updateIssue(
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
        user: {
          omit: {
            password: true,
            role: true,
          },
        },
      },
    });
  }

  async deleteIssue(id: string): Promise<Issue> {
    const issue = await this.prisma.issue.delete({
      where: {
        id: id,
      },
      include: {
        category: true,
        user: {
          omit: {
            password: true,
            role: true,
          },
        },
      },
    });

    if (!issue) {
      throw new BadRequestException('Error al eliminar esta incidencia');
    }

    const { error } = await this.supabase.storage
      .from('issues')
      .remove([issue.photo.split('/')[1]]);

    if (error) {
      throw new BadRequestException('Error al eliminar la foto');
    }

    return issue;
  }

  async uploadPhoto(
    file: Express.Multer.File,
  ): Promise<SupaBaseUploadFileResponse | null> {
    const { data, error } = await this.supabase.storage
      .from('issues')
      .upload(file.originalname, file.buffer, {
        contentType: 'image/jpeg',
      });

    if (error) return null;

    return data;
  }
}

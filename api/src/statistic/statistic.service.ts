import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StatisticService {
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

  getIssuesByStatus(where: Prisma.IssueWhereInput) {
    return this.prisma.issue.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
      where,
    });
  }

  getIssuesByCategories(where: Prisma.IssueWhereInput) {
    return this.prisma.issue.groupBy({
      by: ['categoryId'],
      _count: {
        _all: true,
      },
      where,
      orderBy: {
        _count: {
          categoryId: 'desc',
        },
      },
    });
  }

  getIssuesByDate(where: Prisma.IssueWhereInput) {
    const conditions: string[] = [];
    const params: any[] = [];

    if (where.createdAt as Prisma.DateTimeFilter) {
      params.push((where.createdAt as Prisma.DateTimeFilter).gte);
      conditions.push(`"createdAt" >= $${params.length}`);
    }

    if (where.createdAt as Prisma.DateTimeFilter) {
      params.push((where.createdAt as Prisma.DateTimeFilter).lt);
      conditions.push(`"createdAt" < $${params.length}`);
    }

    if (
      where.latitude &&
      (where.latitude as Prisma.FloatFilter).gte !== undefined &&
      (where.latitude as Prisma.FloatFilter).lte !== undefined
    ) {
      params.push((where.latitude as Prisma.FloatFilter).gte);
      params.push((where.latitude as Prisma.FloatFilter).lte);
      conditions.push(
        `"latitude" BETWEEN $${params.length - 1} AND $${params.length}`,
      );
    }

    if (
      where.longitude &&
      (where.longitude as Prisma.FloatFilter).gte !== undefined &&
      (where.longitude as Prisma.FloatFilter).lte !== undefined
    ) {
      params.push((where.longitude as Prisma.FloatFilter).gte);
      params.push((where.longitude as Prisma.FloatFilter).lte);
      conditions.push(
        `"longitude" BETWEEN $${params.length - 1} AND $${params.length}`,
      );
    }

    if (where.status && (where.status as Prisma.EnumStatusFilter).in) {
      params.push((where.status as Prisma.EnumStatusFilter).in);
      conditions.push(`"status" = ANY($${params.length}::"Status"[])`);
    }

    if (where.categoryId && (where.categoryId as Prisma.StringFilter).in) {
      params.push((where.categoryId as Prisma.StringFilter).in);
      conditions.push(`"categoryId" = ANY($${params.length})`);
    }

    const whereSQL =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    return this.prisma.$queryRawUnsafe<{ day: Date; count: number }[]>(
      `
    SELECT DATE_TRUNC('day', "createdAt")::date as day, COUNT(*)::int as count
    FROM "Issue"
    ${whereSQL}
    GROUP BY day
    ORDER BY day ASC
    `,
      ...params,
    );
  }
}

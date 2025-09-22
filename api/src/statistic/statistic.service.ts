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

  getIssuesByDate(where) {
    return this.prisma.$queryRawUnsafe<{ day: Date; count: number }[]>(
      `SELECT DATE_TRUNC('day', "createdAt")::date as day, COUNT(*)::int as count
      FROM "Issue"
      WHERE "createdAt" >= $1
        AND "createdAt" < $2
      GROUP BY day
      ORDER BY day ASC`,
      where.createdAt.gte,
      where.createdAt.lt,
    );
  }
}

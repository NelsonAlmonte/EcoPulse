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

  getIssuesStatus(where: Prisma.IssueWhereInput) {
    return this.prisma.issue.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
      where,
    });
  }

  getIssuesCategories(where: Prisma.IssueWhereInput) {
    return this.prisma.issue.groupBy({
      by: ['categoryId'],
      _count: {
        _all: true,
      },
      where,
    });
  }
}

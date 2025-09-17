import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { GetCategoryStatistic, GetStatusStatistic } from './statistic.dto';
import { CategoryService } from 'src/category/category.service';
import { Prisma, Status } from '@prisma/client';

@Controller('statistic')
export class StatisticController {
  constructor(
    private statisticService: StatisticService,
    private categoryService: CategoryService,
  ) {}

  @Get('status')
  async status(
    @Query('filter') filter: string = '7d',
  ): Promise<GetStatusStatistic[] | null> {
    const statisticFilter = this.buildStatisticFilter(filter);
    const statistics =
      await this.statisticService.getIssuesStatus(statisticFilter);

    if (!statistics) return null;

    const statuses = Object.values(Status);

    return statuses.map((status) => {
      const found = statistics.find((s) => s.status === status);
      return {
        status,
        value: found ? found._count._all : 0,
      };
    }) as GetStatusStatistic[];
  }

  @Get('category')
  async category(
    @Query('filter') filter: string = '7d',
  ): Promise<GetCategoryStatistic[] | null> {
    const statisticFilter = this.buildStatisticFilter(filter);
    const statistics =
      await this.statisticService.getIssuesCategories(statisticFilter);

    if (!statistics) return null;

    const categories = await this.categoryService.getCategories();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return statistics.map((stat) => ({
      category: categoryMap.get(stat.categoryId) ?? 'Desconocida',
      value: stat._count._all,
    })) as GetCategoryStatistic[];
  }

  buildStatisticFilter(filter: string): Prisma.IssueWhereInput {
    const now = new Date();
    let start: Date;
    let end: Date = now;

    switch (filter) {
      case 'hoy':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;

      case 'ayer':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;

      case '7d':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        break;

      case '30d':
        start = new Date(now);
        start.setDate(now.getDate() - 30);
        break;

      case '90d':
        start = new Date(now);
        start.setDate(now.getDate() - 90);
        break;
    }

    const where: Prisma.IssueWhereInput = {
      createdAt: {
        gte: start,
        lt: end,
      },
    };

    return where;
  }
}

import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Statistic } from './statistic.dto';
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
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ): Promise<Statistic[] | null> {
    const statisticFilter = this.buildStatisticFilter(
      filter,
      start_date,
      end_date,
    );
    const statistics =
      await this.statisticService.getIssuesByStatus(statisticFilter);

    if (!statistics) return null;

    const statuses = Object.values(Status);

    return statuses.map((status) => {
      const found = statistics.find((s) => s.status === status);
      return {
        label: status,
        value: found ? found._count._all : 0,
      };
    }) as Statistic[];
  }

  @Get('category')
  async category(
    @Query('filter') filter: string = '7d',
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ): Promise<Statistic[] | null> {
    const statisticFilter = this.buildStatisticFilter(
      filter,
      start_date,
      end_date,
    );
    const statistics =
      await this.statisticService.getIssuesByCategories(statisticFilter);

    if (!statistics) return null;

    const categories = await this.categoryService.getCategories();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return statistics.map((stat) => ({
      label: categoryMap.get(stat.categoryId) ?? 'Desconocida',
      value: stat._count._all,
    })) as Statistic[];
  }

  @Get('date')
  async date(
    @Query('filter') filter: string = '7d',
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
  ): Promise<Statistic[] | null> {
    const statisticFilter = this.buildStatisticFilter(
      filter,
      start_date,
      end_date,
    );
    const statistics =
      await this.statisticService.getIssuesByDate(statisticFilter);

    if (!statistics) return null;

    return statistics.map((stat) => {
      const date = new Date(stat.day);

      return {
        label: date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: 'short',
        }),
        value: stat.count,
      };
    }) as Statistic[];
  }

  buildStatisticFilter(
    filter: string,
    start_date?: string,
    end_date?: string,
  ): Prisma.IssueWhereInput {
    const now = new Date();
    let start: Date = start_date ? new Date(start_date) : undefined;
    let end: Date = end_date ? new Date(end_date) : now;

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

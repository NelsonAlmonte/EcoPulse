import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Statistic } from './statistic.dto';
import { CategoryService } from 'src/category/category.service';
import { Prisma, Status } from '@prisma/client';
import { Bounds } from 'src/issue/issue.params';

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
    const statisticFilter = this.buildDateFilter(filter, start_date, end_date);
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
    @Query('filter') filter: string = '90d',
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('north') north?: string,
    @Query('south') south?: string,
    @Query('east') east?: string,
    @Query('west') west?: string,
    @Query('status') status?: string,
    @Query('categories') categories?: string,
  ): Promise<Statistic[] | null> {
    let where = this.buildDateFilter(filter, start_date, end_date);
    const andFilters: Prisma.IssueWhereInput[] = [];

    if (north && south && east && west) {
      const bounds: Bounds = {
        north: Number(north),
        south: Number(south),
        east: Number(east),
        west: Number(west),
      };

      andFilters.push(this.buildBoundsFilter(bounds));
    }

    if (status && categories) {
      andFilters.push(this.buildClassificationFilter(status, categories));
    }

    if (andFilters.length > 0) {
      where = {
        ...where,
        AND: andFilters,
      };
    }

    const statistics = await this.statisticService.getIssuesByCategories(where);

    if (!statistics) return null;

    const categoriesList = await this.categoryService.getCategories();
    const categoryMap = new Map(categoriesList.map((c) => [c.id, c.name]));

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
    const statisticFilter = this.buildDateFilter(filter, start_date, end_date);
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

  buildDateFilter(
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

  buildBoundsFilter(bounds: Bounds): Prisma.IssueWhereInput {
    const where: Prisma.IssueWhereInput = {
      latitude: {
        gte: bounds.south,
        lte: bounds.north,
      },
      longitude: {
        gte: bounds.west,
        lte: bounds.east,
      },
    };

    return where;
  }

  buildClassificationFilter(
    status: string,
    categories: string,
  ): Prisma.IssueWhereInput {
    const where: Prisma.IssueWhereInput = {
      status: {
        in: status.split(',') as Status[],
      },
      categoryId: {
        in: categories.split(','),
      },
    };

    return where;
  }
}

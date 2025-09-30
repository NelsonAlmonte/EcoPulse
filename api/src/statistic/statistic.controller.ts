import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Statistic } from './statistic.dto';
import { CategoryService } from 'src/category/category.service';
import { Prisma, Status } from '@prisma/client';
import { Bounds } from 'src/issue/issue.params';

interface WhereParams {
  status?: string;
  defined_date?: string;
  start_date?: string;
  end_date?: string;
  categories?: string;
  bounds?: Bounds;
}
@Controller('statistic')
export class StatisticController {
  constructor(
    private statisticService: StatisticService,
    private categoryService: CategoryService,
  ) {}

  @Get('status')
  async status(
    @Query('defined_date') defined_date?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('north') north?: string,
    @Query('south') south?: string,
    @Query('east') east?: string,
    @Query('west') west?: string,
    @Query('status') status?: string,
    @Query('categories') categories?: string,
  ): Promise<Statistic[] | null> {
    const filter: WhereParams = {
      defined_date: defined_date,
      start_date: start_date,
      end_date: end_date,
      bounds: {
        north: Number(north),
        south: Number(south),
        east: Number(east),
        west: Number(west),
      },
      status: status,
      categories: categories,
    };
    const where = this.buildWhere(filter);
    const statistics = await this.statisticService.getIssuesByStatus(where);

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
    @Query('defined_date') defined_date?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('north') north?: string,
    @Query('south') south?: string,
    @Query('east') east?: string,
    @Query('west') west?: string,
    @Query('status') status?: string,
    @Query('categories') categories?: string,
  ): Promise<Statistic[] | null> {
    const filter: WhereParams = {
      defined_date: defined_date,
      start_date: start_date,
      end_date: end_date,
      bounds: {
        north: Number(north),
        south: Number(south),
        east: Number(east),
        west: Number(west),
      },
      status: status,
      categories: categories,
    };
    const where = this.buildWhere(filter);
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
    @Query('defined_date') defined_date?: string,
    @Query('start_date') start_date?: string,
    @Query('end_date') end_date?: string,
    @Query('north') north?: string,
    @Query('south') south?: string,
    @Query('east') east?: string,
    @Query('west') west?: string,
    @Query('status') status?: string,
    @Query('categories') categories?: string,
  ): Promise<Statistic[] | null> {
    const filter: WhereParams = {
      defined_date: defined_date,
      start_date: start_date,
      end_date: end_date,
      bounds: {
        north: Number(north),
        south: Number(south),
        east: Number(east),
        west: Number(west),
      },
      status: status,
      categories: categories,
    };
    const where = this.buildWhere(filter);
    const statistics = await this.statisticService.getIssuesByDate(where);

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
    defined_date: string,
    start_date?: string,
    end_date?: string,
  ): Prisma.IssueWhereInput {
    const definedDate = defined_date === '' ? '7d' : defined_date;
    const now = new Date();
    let start: Date = start_date ? new Date(start_date) : undefined;
    let end: Date = end_date ? new Date(end_date) : now;

    switch (definedDate) {
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
    status?: string,
    categories?: string,
  ): Prisma.IssueWhereInput {
    const where: Prisma.IssueWhereInput = {
      status: {
        in: status ? (status.split(',') as Status[]) : undefined,
      },
      categoryId: {
        in: categories ? categories.split(',') : undefined,
      },
    };

    return where;
  }

  buildWhere(filter: WhereParams): Prisma.IssueWhereInput {
    const where: Prisma.IssueWhereInput = {};

    Object.assign(
      where,
      this.buildDateFilter(
        filter.defined_date,
        filter.start_date,
        filter.end_date,
      ),
    );

    if (
      filter.bounds.north &&
      filter.bounds.south &&
      filter.bounds.east &&
      filter.bounds.west
    ) {
      Object.assign(
        where,
        this.buildBoundsFilter({
          north: filter.bounds.north,
          south: filter.bounds.south,
          east: filter.bounds.east,
          west: filter.bounds.west,
        }),
      );
    }

    if (filter.status || filter.categories) {
      Object.assign(
        where,
        this.buildClassificationFilter(filter.status, filter.categories),
      );
    }

    return where;
  }
}

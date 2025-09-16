import { Controller, Get } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { GetCategoryStatistic, GetStatusStatistic } from './statistic.dto';
import { CategoryService } from 'src/category/category.service';

@Controller('statistic')
export class StatisticController {
  constructor(
    private statisticService: StatisticService,
    private categoryService: CategoryService,
  ) {}

  @Get('status')
  async status(): Promise<GetStatusStatistic[] | null> {
    const statistics = await this.statisticService.getIssuesStatus();

    if (!statistics) return null;

    return statistics.map((statistic) => ({
      status: statistic.status,
      value: statistic._count._all,
    })) as GetStatusStatistic[];
  }

  @Get('category')
  async category(): Promise<GetCategoryStatistic[] | null> {
    const statistics = await this.statisticService.getIssuesCategories();

    if (!statistics) return null;

    const categories = await this.categoryService.getCategories();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return statistics.map((stat) => ({
      category: categoryMap.get(stat.categoryId) ?? 'Desconocida',
      value: stat._count._all,
    })) as GetCategoryStatistic[];
  }
}

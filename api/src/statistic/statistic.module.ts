import { Module } from '@nestjs/common';
import { StatisticController } from './statistic.controller';
import { StatisticService } from './statistic.service';
import { PrismaService } from 'src/prisma.service';
import { CategoryService } from 'src/category/category.service';

@Module({
  providers: [StatisticService, PrismaService, CategoryService],
  controllers: [StatisticController],
})
export class StatisticModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { CategoryModule } from './category/category.module';
import { IssueModule } from './issue/issue.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { HighlightModule } from './highlight/highlight.module';
import { StatisticModule } from './statistic/statistic.module';

@Module({
  imports: [CategoryModule, IssueModule, UserModule, AuthModule, HighlightModule, StatisticModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

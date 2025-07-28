import { Module } from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { HighlightController } from './highlight.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [HighlightService, PrismaService],
  controllers: [HighlightController],
})
export class HighlightModule {}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { HighlightDto } from './highlight.dto';

@Injectable()
export class HighlightService {
  constructor(private prisma: PrismaService) {}

  createHighlight(highlightDto: HighlightDto) {
    return this.prisma.highlight.create({
      data: highlightDto,
    });
  }

  deleteHighlight(highlightDto: HighlightDto) {
    return this.prisma.highlight.delete({
      where: {
        issueId_userId: {
          issueId: highlightDto.issueId,
          userId: highlightDto.userId,
        },
      },
    });
  }

  countIssueHightlights(issueId: string): Promise<number> {
    return this.prisma.highlight.count({
      where: {
        issueId,
      },
    });
  }
}

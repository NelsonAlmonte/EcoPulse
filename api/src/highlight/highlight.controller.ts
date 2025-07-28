import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { HighlightService } from './highlight.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { Highlight } from '@prisma/client';
import { HighlightDto } from './highlight.dto';

@Controller('highlight')
export class HighlightController {
  constructor(private highlightService: HighlightService) {}

  // @UseGuards(SupabaseAuthGuard)
  @Post()
  async create(
    @Body() highlightDto: HighlightDto,
  ): Promise<Highlight | BadRequestException> {
    const highlight = await this.highlightService.createHighlight(highlightDto);

    if (!highlight) {
      throw new BadRequestException(
        'Unexpected error when creating a highlight',
      );
    }

    return highlight;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Delete(':issueId/:userId')
  async delete(
    @Param('issueId') issueId: string,
    @Param('userId') userId: string,
  ): Promise<Highlight | BadRequestException> {
    const highlightDto: HighlightDto = { issueId, userId };
    const highlight = await this.highlightService.deleteHighlight(highlightDto);

    if (!highlight) {
      throw new BadRequestException(
        'Unexpected error when deleting a highlight',
      );
    }

    return highlight;
  }
}

import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { Notification, Prisma } from '@prisma/client';
import { buildPaginationParams } from 'src/util/functions/pagination.functions';
import { List } from 'src/util/interfaces/response.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async notifications(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('amount', new DefaultValuePipe(5), ParseIntPipe) amount: number,
    @Param('id') userId: string,
  ): Promise<List<Notification[]>> {
    const where: Prisma.NotificationWhereInput = {
      recipientId: userId,
    };
    const notifications = await this.notificationService.getNotifications(
      buildPaginationParams(page, amount),
      where,
    );

    if (!notifications) return null;

    const notificationList: List<Notification[]> = {
      data: notifications,
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total: await this.notificationService.countNotifications(where),
      },
    };

    return notificationList;
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { Notification, Prisma } from '@prisma/client';
import { buildPaginationParams } from 'src/util/functions/pagination.functions';
import { List } from 'src/util/interfaces/response.dto';
import { UpdateNotificationDto } from './notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async notifications(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('amount', new DefaultValuePipe(5), ParseIntPipe) amount: number,
    @Param('id') userId: string,
  ): Promise<List<Notification[]>> {
    const where: Prisma.NotificationWhereInput = {
      recipientId: userId,
    };
    const [notifications, total] = await Promise.all([
      this.notificationService.getNotifications(
        buildPaginationParams(page, amount),
        where,
      ),
      this.notificationService.countNotifications(where),
    ]);

    if (!notifications) return null;

    const notificationList: List<Notification[]> = {
      data: notifications,
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total,
      },
    };

    return notificationList;
  }

  @UseGuards(SupabaseAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<Notification | BadRequestException> {
    const notification = await this.notificationService.deleteNotification(id);

    if (!notification) {
      throw new BadRequestException(
        'Error inesperado al eliminar esta notificación',
      );
    }

    return notification;
  }

  @UseGuards(SupabaseAuthGuard)
  @Put(':id')
  async update(
    @Body() isRead: UpdateNotificationDto,
    @Param('id') id: string,
  ): Promise<Notification | BadRequestException> {
    const updatedIssue = await this.notificationService.toggleReadStatus(
      isRead,
      id,
    );

    if (!updatedIssue) {
      throw new BadRequestException(
        'Error inesperado al actualizar esta notificación',
      );
    }

    return updatedIssue;
  }
}

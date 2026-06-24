import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { Notification } from '@prisma/client';

@Controller('notification')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  // @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async notifications(@Param('id') userId: string): Promise<Notification[]> {
    return await this.notificationService.getNotifications(userId);
  }
}

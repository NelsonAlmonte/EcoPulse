import { Injectable } from '@nestjs/common';
import { Notification } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: {
        issue: {
          select: {
            latitude: true,
            longitude: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }
}

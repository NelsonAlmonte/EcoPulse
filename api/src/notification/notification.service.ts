import { BadRequestException, Injectable } from '@nestjs/common';
import { Notification, Prisma } from '@prisma/client';
import { PaginationParams } from 'src/issue/issue.params';
import { PrismaService } from 'src/prisma.service';
import { UpdateNotificationDto } from './notification.dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(
    pagination: PaginationParams,
    where?: Prisma.NotificationWhereInput,
  ): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      skip: pagination.skip,
      take: pagination.take,
      where,
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
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async countNotifications(
    where?: Prisma.NotificationWhereInput,
  ): Promise<number> {
    return this.prisma.notification.count({ where: where ?? undefined });
  }

  async deleteNotification(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.delete({
      where: {
        id: id,
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

    if (!notification) {
      throw new BadRequestException('Error al eliminar esta incidencia');
    }

    return notification;
  }

  toggleReadStatus(
    updateNotificationDto: Prisma.NotificationUpdateInput,
    id: string,
  ): Promise<Notification> {
    return this.prisma.notification.update({
      data: updateNotificationDto,
      where: {
        id,
      },
    });
  }
}

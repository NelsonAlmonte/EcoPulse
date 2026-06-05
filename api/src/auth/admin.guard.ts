import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = await this.prisma.user.findUnique({
      where: {
        id: request.user.sub,
      },
      select: {
        role: true,
      },
    });

    if (user.role !== 'ADMIN') {
      throw new ForbiddenException('Usuario no permitido.');
    }

    return true;
  }
}

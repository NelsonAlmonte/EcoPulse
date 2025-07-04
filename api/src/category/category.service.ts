import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async getCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async getCategory(id: string): Promise<Category> {
    return this.prisma.category.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createCategory(
    categoryDto: Prisma.CategoryCreateInput,
  ): Promise<Category> {
    return this.prisma.category.create({
      data: categoryDto,
    });
  }

  async updateCategory(
    categoryDto: Prisma.CategoryUpdateInput,
    id: string,
  ): Promise<Category> {
    return this.prisma.category.update({
      data: categoryDto,
      where: {
        id: id,
      },
    });
  }

  async deleteCategory(id: string): Promise<Category> {
    return this.prisma.category.delete({
      where: {
        id: id,
      },
    });
  }
}

import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, Prisma } from '@prisma/client';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async categories(): Promise<Category[]> {
    return await this.categoryService.getCategories();
  }

  @Get(':id')
  async subject(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.getCategory(id);
  }

  @Post()
  async create(
    @Body() createCategoryDto: Prisma.CategoryCreateInput,
  ): Promise<Category | BadRequestException> {
    const category =
      await this.categoryService.createCategory(createCategoryDto);

    if (!category) {
      throw new BadRequestException(
        'Unexpected error when creating a category',
      );
    }

    return category;
  }

  @Put(':id')
  async update(
    @Body() updateCategoryDto: Prisma.CategoryUpdateInput,
    @Param('id') id: string,
  ): Promise<Category | BadRequestException> {
    const category = await this.categoryService.updateCategory(
      updateCategoryDto,
      id,
    );

    if (!category) {
      throw new BadRequestException(
        'Unexpected error when updating a category',
      );
    }

    return category;
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ): Promise<Category | BadRequestException> {
    const category = await this.categoryService.deleteCategory(id);

    if (!category) {
      throw new BadRequestException(
        'Unexpected error when deleting a category',
      );
    }

    return category;
  }
}

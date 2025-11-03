import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category, Prisma } from '@prisma/client';
import { SupabaseAuthGuard } from 'src/auth/supabase-auth.guard';
import { PaginationParams } from 'src/util/interfaces/response.params';
import { buildPaginationParams } from 'src/util/functions/pagination.functions';
import { List } from 'src/util/interfaces/response.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  // @UseGuards(SupabaseAuthGuard)
  @Get()
  async categories(): Promise<Category[]> {
    return await this.categoryService.getCategories();
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get('list')
  async categoriesList(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('amount', new DefaultValuePipe(5), ParseIntPipe) amount: number,
  ): Promise<List<Category[]> | null> {
    const categories = await this.categoryService.getCategoryList(
      buildPaginationParams(page, amount),
    );

    if (!categories) return null;

    const categoriesList: List<Category[]> = {
      data: categories,
      pagination: {
        page: Number(page),
        amount: Number(amount),
        total: await this.categoryService.countCategories(),
      },
    };

    return categoriesList;
  }

  // @UseGuards(SupabaseAuthGuard)
  @Get(':id')
  async subject(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.getCategory(id);
  }

  // @UseGuards(SupabaseAuthGuard)
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

  // @UseGuards(SupabaseAuthGuard)
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

  // @UseGuards(SupabaseAuthGuard)
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

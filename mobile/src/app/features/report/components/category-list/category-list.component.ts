import { Component, inject, OnInit, output } from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import { SelectedDirective } from '@shared/directives/selected.directive';
import {
  LucideAngularModule,
  TreePineIcon,
  SkullIcon,
  SprayCanIcon,
  Volume2Icon,
  BrickWallIcon,
  LightbulbIcon,
  FlameIcon,
  CarIcon,
  DropletIcon,
  TrashIcon,
  DropletsIcon,
  LucideIconData,
} from 'lucide-angular';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [LucideAngularModule, SelectedDirective],
})
export class CategoryListComponent implements OnInit {
  categoryService = inject(CategoryService);
  selectedCategory = output<string>();
  iconMap: Record<string, LucideIconData> = {
    SkullIcon,
    SprayCanIcon,
    Volume2Icon,
    BrickWallIcon,
    LightbulbIcon,
    FlameIcon,
    CarIcon,
    DropletIcon,
    TrashIcon,
    TreePineIcon,
    DropletsIcon,
  };

  constructor() {}

  ngOnInit(): void {
    this.categoryService.getCategories();
  }

  selectCategory(id: string): void {
    this.selectedCategory.emit(id);
  }

  showIcon(iconName: string): LucideIconData {
    return this.iconMap[iconName] || TreePineIcon;
  }
}

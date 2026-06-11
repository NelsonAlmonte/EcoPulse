import {
  Component,
  inject,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CategoryService } from '@core/services/category.service';
import { IonRippleEffect } from '@ionic/angular/standalone';
import { FolderOpenIcon, LucideAngularModule } from 'lucide-angular';
import { AlertComponent } from '@shared/components/alert/alert.component';
import { UiService } from '@core/services/ui.service';
import { Category } from '@shared/models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  imports: [IonRippleEffect, LucideAngularModule, AlertComponent],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryListComponent implements OnInit {
  categoryService = inject(CategoryService);
  uiService = inject(UiService);
  sanitizer = inject(DomSanitizer);
  selectCategory = output<Category>();
  selectedElement: HTMLDivElement | null = null;
  selectedCategory: Category | null = null;
  emptyIcon = FolderOpenIcon;

  ngOnInit(): void {
    const cachedCategories = localStorage.getItem('categories');

    if (cachedCategories) {
      this.categoryService.categories.set(JSON.parse(cachedCategories));
    }

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categoryService.categories.set(categories);

        localStorage.setItem('categories', JSON.stringify(categories));
      },
      error: async () => {
        await this.uiService.showToast(
          'No tienes conexión a internet. Se usarán las categorías guardadas en el dispositivo.'
        );
      },
    });
  }

  onSelectedCategory(category: Category): void {
    this.selectedCategory = category;
    this.selectCategory.emit(category);
  }
}

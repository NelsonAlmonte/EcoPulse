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
  selectedCategory = output<string>();
  selectedElement: HTMLDivElement | null = null;
  selectedCategoryId: string | null = null;
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

  selectCategory(id: string): void {
    this.selectedCategoryId = id;
    this.selectedCategory.emit(id);
  }
}

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

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  imports: [IonRippleEffect, LucideAngularModule],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryListComponent implements OnInit {
  categoryService = inject(CategoryService);
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
      error: () => {
        console.error('No se pudieron obtener las categorías.');
      },
    });
  }

  selectCategory(id: string): void {
    this.selectedCategoryId = id;
    this.selectedCategory.emit(id);
  }
}

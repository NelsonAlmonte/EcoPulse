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
import { LucideAngularModule } from 'lucide-angular';

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

  ngOnInit(): void {
    this.categoryService.getCategories();
  }

  selectCategory(id: string): void {
    this.selectedCategoryId = id;
    this.selectedCategory.emit(id);
  }
}

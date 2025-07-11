import { Component, inject, OnInit, output } from '@angular/core';
import { ApiResult } from '@core/interfaces/api.interface';
import { CategoryService } from '@core/services/category.service';
import { IonChip, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { Category } from '@shared/models/category.model';
import { addIcons } from 'ionicons';
import { closeCircle, pin } from 'ionicons/icons';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss'],
  imports: [IonChip, IonIcon, IonLabel],
})
export class CategoryListComponent implements OnInit {
  categoryService = inject(CategoryService);
  selectedCategory = output<string>();
  categories$!: Observable<ApiResult<Category[]>>;

  constructor() {
    addIcons({ closeCircle, pin });
  }

  ngOnInit(): void {
    this.categoryService.getCategories();
  }

  selectCategory(id: string): void {
    this.selectedCategory.emit(id);
  }
}

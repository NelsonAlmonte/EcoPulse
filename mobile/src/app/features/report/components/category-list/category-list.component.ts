import {
  Component,
  inject,
  OnInit,
  output,
  ViewEncapsulation,
} from '@angular/core';
import { CategoryService } from '@core/services/category.service';
import { iconMap } from '@shared/constants/system.constant';
import {
  LucideAngularModule,
  LucideIconData,
  TreePineIcon,
} from 'lucide-angular';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
  imports: [LucideAngularModule],
  encapsulation: ViewEncapsulation.None,
})
export class CategoryListComponent implements OnInit {
  categoryService = inject(CategoryService);
  selectedCategory = output<string>();
  selectedElement: HTMLDivElement | null = null;

  ngOnInit(): void {
    this.categoryService.getCategories();
  }

  selectCategory(id: string, event: MouseEvent): void {
    const element = event.currentTarget as HTMLDivElement;

    if (this.selectedElement) this.selectedElement.classList.remove('selected');

    element.classList.add('selected');
    this.selectedElement = element;

    this.selectedCategory.emit(id);
  }

  showIcon(iconName: string): LucideIconData {
    return iconMap[iconName] || TreePineIcon;
  }
}

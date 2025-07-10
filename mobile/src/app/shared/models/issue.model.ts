import { Category } from './category.model';

export interface Issue {
  id: string;
  photo: string;
  status: string;
  latitude: string;
  longitude: string;
  categoryId: string;
  userId: string;
  category: Category;
}

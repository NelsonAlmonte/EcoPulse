import { Category } from './category.model';
import { User } from './user.model';

export interface Issue {
  id: string;
  photo: string;
  status: string;
  latitude: string;
  longitude: string;
  categoryId: string;
  userId: string;
  category: Category;
  createdAt: string;
  user: User;
}

export interface SupaBaseUploadFileResponse {
  id: string;
  path: string;
  fullPath: string;
}

import { Category } from './category.model';
import { User } from './user.model';

export interface Issue {
  id: string;
  photo: string;
  status: string;
  latitude: number;
  longitude: number;
  comment?: string;
  categoryId: string;
  userId: string;
  category: Category;
  createdAt: string;
  user: User;
  highlights: number;
  hasCurrentUserHighlight: boolean;
}

export interface SupaBaseUploadFileResponse {
  id: string;
  path: string;
  fullPath: string;
}

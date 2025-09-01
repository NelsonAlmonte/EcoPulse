import { Category, Status } from '@prisma/client';
import { GetUserDto } from 'src/user/user.dto';

export interface CreateIssueDto {
  photo: string;
  latitude: number;
  longitude: number;
  comment?: string;
  category: string;
  user: string;
}

export interface UpdateIssueDto {
  photo?: string;
  status?: Status;
  latitude?: number;
  longitude?: number;
  comment?: string;
  category?: string;
  user?: string;
}

export interface SupaBaseUploadFileResponse {
  id: string;
  path: string;
  fullPath: string;
}

export interface GetIssueDto {
  id: string;
  photo: string;
  status: string;
  latitude: number;
  longitude: number;
  comment?: string;
  categoryId: string;
  userId: string;
  category: Category;
  createdAt: Date;
  user: GetUserDto;
  highlights: number;
  hasCurrentUserHighlight: boolean;
}

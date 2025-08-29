import { Category, Status } from '@prisma/client';
import { GetUserDto } from 'src/user/user.dto';

export interface CreateIssueDto {
  photo: string;
  latitude: string;
  longitude: string;
  comment?: string;
  category: string;
  user: string;
}

export interface UpdateIssueDto {
  photo?: string;
  status?: Status;
  latitude?: string;
  longitude?: string;
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
  latitude: string;
  longitude: string;
  comment?: string;
  categoryId: string;
  userId: string;
  category: Category;
  createdAt: Date;
  user: GetUserDto;
  highlights: number;
  hasCurrentUserHighlight: boolean;
}

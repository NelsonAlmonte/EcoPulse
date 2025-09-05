import { Category, Issue, Status, User } from '@prisma/client';
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

export interface GetIssueDto extends Issue {
  highlights: number;
  hasCurrentUserHighlight: boolean;
  user: GetUserDto;
}

export interface GetIssueListDto extends Issue {
  highlights: number;
  user: GetUserDto;
}

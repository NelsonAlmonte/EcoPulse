import { Status } from '@prisma/client';

export interface CreateIssueDto {
  photo: string;
  latitude: string;
  longitude: string;
  comment?: string;
  category: string;
  user: string;
}

export interface UpdateIssueDto {
  photo: string;
  status: Status;
  latitude: string;
  longitude: string;
  comment?: string;
  category: string;
  user: string;
}

export interface SupaBaseUploadFileResponse {
  id: string;
  path: string;
  fullPath: string;
}

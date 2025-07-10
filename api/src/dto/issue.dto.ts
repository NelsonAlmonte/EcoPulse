import { Status } from '@prisma/client';

export interface CreateIssueDto {
  photo: string;
  latitude: string;
  longitude: string;
  category: string;
  user: string;
}

export interface UpdateIssueDto {
  photo: string;
  status: Status;
  latitude: string;
  longitude: string;
  category: string;
  user: string;
}

import { Status } from '@prisma/client';

export interface CreateIssueDto {
  photo: string;
  coordinates: string;
  category: string;
  user: string;
}

export interface UpdateIssueDto {
  photo: string;
  status: Status;
  coordinates: string;
  category: string;
  user: string;
}

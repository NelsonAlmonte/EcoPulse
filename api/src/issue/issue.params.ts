import { Status } from '@prisma/client';

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PaginationParams {
  skip: number;
  take: number;
}

export interface IssueFilterParams {
  status?: Status[];
  start_date?: Date;
  end_date?: Date;
  categories?: string[];
  order?: string;
}

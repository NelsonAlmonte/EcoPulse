import { Prisma, Status } from '@prisma/client';

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
  defined_date?: string;
  start_date?: Date;
  end_date?: Date;
  categories?: string[];
  order?: Prisma.IssueOrderByWithRelationInput;
  bounds?: Bounds;
}

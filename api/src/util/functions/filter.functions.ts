import { Prisma, Status } from '@prisma/client';

export function buildFilterParams(
  status?: string,
  defined_date?: string,
  start_date?: string,
  end_date?: string,
  categories?: string,
): Prisma.IssueWhereInput {
  const where: Prisma.IssueWhereInput = {};

  Object.assign(where, buildDateFilter(defined_date, start_date, end_date));
  Object.assign(where, {
    status: {
      in: status ? (status.split(',') as Status[]) : undefined,
    },
    categoryId: {
      in: categories ? categories.split(',') : undefined,
    },
  });

  return where;
}

export function buildOrderParam(
  order?: string,
): Prisma.IssueOrderByWithRelationInput | undefined {
  let orderBy: Prisma.IssueOrderByWithRelationInput | undefined = undefined;

  if (order) {
    const column = order.split(':')[0];
    const value = order.split(':')[1] as Prisma.SortOrder;

    if (column === 'highlights') {
      orderBy = {
        highlights: {
          _count: value,
        },
      };
    } else {
      orderBy = {
        [order.split(':')[0]]: order.split(':')[1],
      };
    }
  }

  return orderBy;
}

export function buildDateFilter(
  defined_date: string,
  start_date?: string,
  end_date?: string,
): Prisma.IssueWhereInput {
  const definedDate = defined_date === '' ? '7d' : defined_date;
  const now = new Date();
  let start: Date = start_date ? new Date(start_date) : undefined;
  let end: Date = end_date ? new Date(end_date) : now;

  switch (definedDate) {
    case 'hoy':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;

    case 'ayer':
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;

    case '7d':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      break;

    case '30d':
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      break;

    case '90d':
      start = new Date(now);
      start.setDate(now.getDate() - 90);
      break;
  }

  const where: Prisma.IssueWhereInput = {
    createdAt: {
      gte: start,
      lt: end,
    },
  };

  return where;
}

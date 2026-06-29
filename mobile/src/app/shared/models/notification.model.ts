import { Status } from '@shared/constants/system.constant';
import { Issue } from './issue.model';
import { Category } from './category.model';

export interface Notification {
  id: string;
  recipientId: string;
  issueId: string;
  statusFrom: NotificationStatus;
  statusTo: NotificationStatus;
  createdAt: string;
  isRead: boolean;
  issue: NotificationIssue;
}

type NotificationStatus = Exclude<Status, 'TODO'>;

type NotificationIssue = Pick<Issue, 'latitude' | 'longitude'> & {
  category: Pick<Category, 'name'>;
};

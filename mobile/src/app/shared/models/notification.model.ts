import { Status } from '@shared/constants/system.constant';
import { Issue } from './issue.model';

export interface Notification {
  id: string;
  recipientId: string;
  issueId: string;
  statusFrom: Omit<Status, 'TODO'>;
  statusTo: Omit<Status, 'TODO'>;
  createdAt: string;
  isRead: boolean;
  issue: Pick<Issue, 'latitude' | 'longitude' | 'category'>;
}

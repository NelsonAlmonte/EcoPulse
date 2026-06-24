import { Status } from '@shared/constants/system.constant';

export interface Notification {
  id: string;
  recipientId: string;
  issueId: string;
  statusFrom: Omit<Status, 'TODO'>;
  statusTo: Omit<Status, 'TODO'>;
  createdAt: string;
}

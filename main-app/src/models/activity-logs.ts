import { ActivityLogType } from 'core/enum';

export interface ActivityLog {
  id: number;
  type: ActivityLogType;
  description: string;
  loggedAt: Date;
  loggedBy: string;
}

export interface ActivityLogOutputParams {
  description: string;
  loggedBy: string;
  loggedAt: Date;
}

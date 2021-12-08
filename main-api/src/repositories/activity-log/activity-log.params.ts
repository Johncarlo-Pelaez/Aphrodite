import { ActivityLogType } from 'src/entities';

export interface GetActivityLogsParam {
  activityType?: ActivityLogType;
  loggedBy?: string;
  from?: Date;
  to?: Date;
  skip?: number;
  take?: number;
}

export interface InsertCreateUserLogParam {
  username: string;
  createdBy: string;
  createdAt: Date;
}

export interface InsertUpdateUserLogParam {
  oldUser: string;
  newUser: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface InsertCreateLookupLogParam {
  nomenclature: string;
  createdBy: string;
  createdAt: Date;
}

export interface InsertUpdateLookupLogParam {
  oldNomenclature: string;
  newNomenclature: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface InsertDeleteLookupLogParam {
  nomenclature: string;
  deletedBy: string;
  deletedAt: Date;
}

export interface InsertCreateWhitelistLogParam
  extends InsertCreateLookupLogParam {}

export interface InsertUpdateWhitelistLogParam
  extends InsertUpdateLookupLogParam {}

export interface InsertDeleteWhitelistLogParam
  extends InsertDeleteLookupLogParam {}

import { ActivityLog, ActivityLogType } from 'src/entities';
import {
  EntityManager,
  EntityRepository,
  Between,
  FindOperator,
} from 'typeorm';
import {
  GetActivityLogsParam,
  InsertCreateUserLogParam,
  InsertUpdateUserLogParam,
  InsertCreateLookupLogParam,
  InsertUpdateLookupLogParam,
  InsertDeleteLookupLogParam,
  InsertCreateWhitelistLogParam,
  InsertUpdateWhitelistLogParam,
  InsertDeleteWhitelistLogParam,
} from './activity-log.params';

@EntityRepository()
export class ActivityLogRepository {
  constructor(private readonly manager: EntityManager) {}

  async getActivityLogs(param: GetActivityLogsParam): Promise<ActivityLog[]> {
    const { loggedBy, from, to, skip, take } = param;

    let whereLoggedBy: { loggedBy: string };
    let whereLoggedAt: { loggedAt: FindOperator<Date> };

    if (loggedBy) {
      whereLoggedBy = { loggedBy: loggedBy === 'All Users' ? '' : loggedBy };
    }
    if (from && to) {
      whereLoggedAt = { loggedAt: Between(from, to) };
    }

    return await this.manager.find(ActivityLog, {
      where: [
        {
          ...whereLoggedBy,
          ...whereLoggedAt,
        },
      ],
      order: { loggedAt: 'DESC' },
      skip,
      take,
    });
  }

  async getActivityLogsCount(param: GetActivityLogsParam): Promise<number> {
    const { loggedBy, from, to } = param;

    let whereLoggedBy: { loggedBy: string };
    let whereLoggedAt: { loggedAt: FindOperator<Date> };

    if (loggedBy) {
      whereLoggedBy = { loggedBy: loggedBy === 'All Users' ? '' : loggedBy };
    }
    if (from && to) {
      whereLoggedAt = { loggedAt: Between(from, to) };
    }

    return await this.manager.count(ActivityLog, {
      where: [
        {
          ...whereLoggedBy,
          ...whereLoggedAt,
        },
      ],
      order: { loggedAt: 'DESC' },
    });
  }

  async getActivityLog(id: number): Promise<ActivityLog> {
    return await this.manager.findOneOrFail(ActivityLog, id);
  }

  async insertCreateUserLog(param: InsertCreateUserLogParam): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.ADD_USER;
    activityLogs.description = param.username;
    activityLogs.loggedBy = param.createdBy;
    activityLogs.loggedAt = param.createdAt;
    await this.manager.save(activityLogs);
  }

  async insertUpdateUserLog(param: InsertUpdateUserLogParam): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.EDIT_USER;
    activityLogs.description = `From ${param.oldUser} to ${param.newUser}`;
    activityLogs.loggedBy = param.updatedBy;
    activityLogs.loggedAt = param.updatedAt;
    await this.manager.save(activityLogs);
  }

  async insertCreateLookupLog(data: InsertCreateLookupLogParam): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.ADD_NOMENCLATURE_LOOKUP;
    activityLogs.description = data.nomenclature;
    activityLogs.loggedBy = data.createdBy;
    activityLogs.loggedAt = data.createdAt;
    await this.manager.save(activityLogs);
  }

  async insertUpdateLookupLog(
    param: InsertUpdateLookupLogParam,
  ): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.EDIT_NOMENCLATURE_LOOKUP;
    activityLogs.description = `From ${param.oldNomenclature} to ${param.newNomenclature}`;
    activityLogs.loggedBy = param.updatedBy;
    activityLogs.loggedAt = param.updatedAt;
    await this.manager.save(activityLogs);
  }

  async insertDeleteLookupLog(
    param: InsertDeleteLookupLogParam,
  ): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.DELETE_NOMENCLATURE_LOOKUP;
    activityLogs.description = param.nomenclature;
    activityLogs.loggedBy = param.deletedBy;
    activityLogs.loggedAt = param.deletedAt;
    await this.manager.save(activityLogs);
  }

  async insertCreateWhitelistLog(
    param: InsertCreateWhitelistLogParam,
  ): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.ADD_NOMENCLATURE_WHITELIST;
    activityLogs.description = param.nomenclature;
    activityLogs.loggedBy = param.createdBy;
    activityLogs.loggedAt = param.createdAt;
    await this.manager.save(activityLogs);
  }

  async insertUpdateWhitelistLog(
    param: InsertUpdateWhitelistLogParam,
  ): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.EDIT_NOMENCLATURE_WHITELIST;
    activityLogs.description = `From ${param.oldNomenclature} to ${param.newNomenclature}`;
    activityLogs.loggedBy = param.updatedBy;
    activityLogs.loggedAt = param.updatedAt;
    await this.manager.save(activityLogs);
  }

  async insertDeleteWhitelistLog(
    param: InsertDeleteWhitelistLogParam,
  ): Promise<void> {
    const activityLogs = new ActivityLog();
    activityLogs.type = ActivityLogType.DELETE_NOMENCLATURE_WHITELIST;
    activityLogs.description = param.nomenclature;
    activityLogs.loggedBy = param.deletedBy;
    activityLogs.loggedAt = param.deletedAt;
    await this.manager.save(activityLogs);
  }
}

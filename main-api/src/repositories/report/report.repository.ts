import * as moment from 'moment';
import { DocumentHistory } from 'src/entities';
import {
  EntityManager,
  EntityRepository,
  Between,
  FindConditions,
  In,
} from 'typeorm';
import {
  GetDocumentReportsCountParam,
  GetUploadedReportsParam,
} from './report.params';

@EntityRepository()
export class ReportRepository {
  constructor(private readonly manager: EntityManager) {}

  async getDocumentReports(
    param: GetUploadedReportsParam,
  ): Promise<DocumentHistory[]> {
    const { username, statuses, from, to } = param;
    let whereConditions: FindConditions<DocumentHistory> = {};

    if (username) {
      whereConditions['userUsername'] = username;
    }

    if (statuses && !!statuses.length) {
      whereConditions['documentStatus'] = In(statuses);
    }

    if (from) {
      const dateTo = moment(!!to ? to : from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      whereConditions['createdDate'] = Between(from, dateTo);
    }

    return await this.manager.find(DocumentHistory, {
      relations: ['document'],
      where: [whereConditions],
      order: { createdDate: 'DESC' },
      skip: param.skip,
      take: param.take,
    });
  }

  async getDocumentReportsCount(
    param: GetDocumentReportsCountParam,
  ): Promise<number> {
    const { username, statuses, from, to } = param;
    let whereConditions: FindConditions<DocumentHistory> = {};

    if (username) {
      whereConditions['userUsername'] = username;
    }

    if (statuses && !!statuses.length) {
      whereConditions['documentStatus'] = In(statuses);
    }

    if (from) {
      const dateTo = moment(!!to ? to : from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      whereConditions['createdDate'] = Between(from, dateTo);
    }

    return await this.manager.count(DocumentHistory, {
      where: [whereConditions],
    });
  }
}

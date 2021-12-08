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

    if (from && to) {
      whereConditions['createdDate'] = Between(from, to);
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

    if (from && to) {
      whereConditions['createdDate'] = Between(from, to);
    }

    return await this.manager.count(DocumentHistory, {
      where: [whereConditions],
    });
  }
}

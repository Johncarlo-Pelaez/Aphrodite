import * as moment from 'moment';
import { DocumentHistory } from 'src/entities';
import { DocumentStatus } from 'src/entities/document.enum';
import {
  EntityManager,
  EntityRepository,
  Between,
  FindConditions,
} from 'typeorm';
import {
  GetUploadedReportParam,
  GetInformationRequestReportParam,
} from './report.params';
import { FIND_INFORMATION_REQUEST_REPORTS } from './reports.queries';

@EntityRepository()
export class ReportRepository {
  constructor(private readonly manager: EntityManager) {}

  async getUploadedReport(
    param: GetUploadedReportParam,
  ): Promise<DocumentHistory[]> {
    const { uploadedBy, from, to } = param;
    let whereConditions: FindConditions<DocumentHistory> = {};

    if (uploadedBy) {
      whereConditions['userUsername'] = uploadedBy;
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
      where: [{ ...whereConditions, documentStatus: DocumentStatus.UPLOADED }],
      order: { createdDate: 'DESC' },
      skip: param.skip,
      take: param.take,
    });
  }

  async getUploadedCountReport(param: GetUploadedReportParam): Promise<number> {
    const { uploadedBy, from, to } = param;
    let whereConditions: FindConditions<DocumentHistory> = {};

    if (uploadedBy) {
      whereConditions['userUsername'] = uploadedBy;
    }

    if (from) {
      const dateTo = moment(!!to ? to : from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      whereConditions['createdDate'] = Between(from, dateTo);
    }

    return await this.manager.count(DocumentHistory, {
      where: [{ ...whereConditions, documentStatus: DocumentStatus.UPLOADED }],
    });
  }

  async getInformationRequestReport(
    param: GetInformationRequestReportParam,
  ): Promise<DocumentHistory[]> {
    const { encoder, from, to, skip, take } = param;

    const conditions: string[] = [];
    const params: (string | number | Date)[] = [];

    if (!!encoder) {
      conditions.push(`document.encoder = @${params.length}`);
      params.push(encoder);
    }

    if (!!from) {
      conditions.push(
        `document_history.createdDate BETWEEN @${params.length} AND @${
          params.length + 1
        }`,
      );
      const dateTo = moment(!!to ? to : from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      params.push(from, dateTo);
    }

    let sql = FIND_INFORMATION_REQUEST_REPORTS;

    if (!!conditions.length) {
      sql += `\nWHERE ${conditions.join(' AND ')}`;
    }

    sql += '\nORDER BY document_history.createdDate DESC';

    if (!!skip && !!take) {
      sql += `\nOFFSET @${params.length} ROWS FETCH NEXT @${
        params.length + 1
      } ROWS ONLY`;
      params.push(skip, take);
    }

    sql += ';';

    return (await this.manager.query(sql, params)) || [];
  }
}

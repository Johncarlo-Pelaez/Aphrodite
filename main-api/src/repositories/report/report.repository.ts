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
import {
  FIND_INFORMATION_REQUEST_REPORTS,
  COUNT_INFORMATION_REQUEST_REPORTS,
} from './reports.queries';
import { InformationRequestReport } from './report.schemas';

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
  ): Promise<InformationRequestReport[]> {
    const queryConditions: string[] = [
      `document_history.documentStatus = @0 or document_history.documentStatus = @1`,
    ];
    const queryParams: (string | number | Date | DocumentStatus)[] = [
      DocumentStatus.INDEXING_DONE,
      DocumentStatus.INDEXING_FAILED,
    ];

    if (!!param.encoder) {
      queryConditions.push(`document.encoder = @${queryParams.length}`);
      queryParams.push(param.encoder);
    }

    if (!!param.from) {
      queryConditions.push(
        `document_history.createdDate BETWEEN @${queryParams.length} AND @${
          queryParams.length + 1
        }`,
      );
      const dateTo = moment(!!param.to ? param.to : param.from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      queryParams.push(param.from, dateTo);
    }

    let sql = FIND_INFORMATION_REQUEST_REPORTS;

    if (!!queryConditions.length) {
      sql += `\nWHERE ${queryConditions.join(' AND ')}`;
    }

    sql += '\nORDER BY document_history.createdDate DESC';

    if (!!param.skip && !!param.take) {
      sql += `\nOFFSET @${queryParams.length} ROWS FETCH NEXT @${
        queryParams.length + 1
      } ROWS ONLY`;
      queryParams.push(param.skip, param.take);
    }

    sql += ';';

    return await this.manager.query(sql, queryParams);
  }

  async getInformationRequestCountReport(
    param: GetInformationRequestReportParam,
  ): Promise<number> {
    const queryConditions: string[] = [
      `document_history.documentStatus = @0 or document_history.documentStatus = @1`,
    ];
    const queryParams: (string | number | Date | DocumentStatus)[] = [
      DocumentStatus.INDEXING_DONE,
      DocumentStatus.INDEXING_FAILED,
    ];

    if (!!param.encoder) {
      queryConditions.push(`document.encoder = @${queryParams.length}`);
      queryParams.push(param.encoder);
    }

    if (!!param.from) {
      queryConditions.push(
        `document_history.createdDate BETWEEN @${queryParams.length} AND @${
          queryParams.length + 1
        }`,
      );
      const dateTo = moment(!!param.to ? param.to : param.from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      queryParams.push(param.from, dateTo);
    }

    let sql = COUNT_INFORMATION_REQUEST_REPORTS;

    if (!!queryConditions.length) {
      sql += `\nWHERE ${queryConditions.join(' AND ')}`;
    }

    sql += ';';

    const queryData = await this.manager.query(sql, queryParams);
    const queryObject = !!queryData?.length ? queryData[0] : null;
    const queryObjectValues = !!queryObject ? Object.values(queryObject) : [];
    return !!queryObjectValues.length
      ? (queryObjectValues[0] as number) ?? 0
      : 0;
  }
}

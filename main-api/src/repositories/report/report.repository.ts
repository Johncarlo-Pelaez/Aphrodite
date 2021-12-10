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
  GetQualityCheckReportParam,
} from './report.params';
import {
  FIND_INFORMATION_REQUEST_REPORTS,
  COUNT_INFORMATION_REQUEST_REPORTS,
  FIND_QUALITY_CHECK_REPORTS,
  COUNT_QUALITY_CHECK_REPORTS,
} from './reports.queries';
import { InformationRequestReport, QualityCheckReport } from './report.schemas';

@EntityRepository()
export class ReportRepository {
  constructor(private readonly manager: EntityManager) {}

  async getUploadedReport(
    param: GetUploadedReportParam,
  ): Promise<DocumentHistory[]> {
    const { uploader: uploadedBy, from, to } = param;
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
    const { uploader: uploadedBy, from, to } = param;
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
    const queryConditions: string[] = [];
    const queryParams: (string | number | Date)[] = [];

    if (!!param.encoder) {
      queryConditions.push(`indexing.encoder = @${queryParams.length}`);
      queryParams.push(param.encoder);
    }

    if (!!param.from) {
      queryConditions.push(
        `indexing.requestedDate BETWEEN @${queryParams.length} AND @${
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

    sql += '\nORDER BY indexing.requestedDate DESC';

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
    const queryConditions: string[] = [];
    const queryParams: (string | number | Date)[] = [];

    if (!!param.encoder) {
      queryConditions.push(`indexing.encoder = @${queryParams.length}`);
      queryParams.push(param.encoder);
    }

    if (!!param.from) {
      queryConditions.push(
        `indexing.requestedDate BETWEEN @${queryParams.length} AND @${
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

  async getQualityCheckReport(
    param: GetQualityCheckReportParam,
  ): Promise<QualityCheckReport[]> {
    const queryConditions: string[] = [];
    const queryParams: (string | number | Date)[] = [];

    if (!!param.checker) {
      queryConditions.push(`qa.checker = @${queryParams.length}`);
      queryParams.push(param.checker);
    }

    if (!!param.from) {
      queryConditions.push(
        `qa.checkedDate BETWEEN @${queryParams.length} AND @${
          queryParams.length + 1
        }`,
      );
      const dateTo = moment(!!param.to ? param.to : param.from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      queryParams.push(param.from, dateTo);
    }

    let sql = FIND_QUALITY_CHECK_REPORTS;

    if (!!queryConditions.length) {
      sql += `\nWHERE ${queryConditions.join(' AND ')}`;
    }

    sql += '\nORDER BY qa.checkedDate DESC';

    if (!!param.skip && !!param.take) {
      sql += `\nOFFSET @${queryParams.length} ROWS FETCH NEXT @${
        queryParams.length + 1
      } ROWS ONLY`;
      queryParams.push(param.skip, param.take);
    }

    sql += ';';

    return await this.manager.query(sql, queryParams);
  }

  async getQualityCheckCountReport(
    param: GetQualityCheckReportParam,
  ): Promise<number> {
    const queryConditions: string[] = [];
    const queryParams: (string | number | Date)[] = [];

    if (!!param.checker) {
      queryConditions.push(`qa.checker = @${queryParams.length}`);
      queryParams.push(param.checker);
    }

    if (!!param.from) {
      queryConditions.push(
        `qa.checkedDate BETWEEN @${queryParams.length} AND @${
          queryParams.length + 1
        }`,
      );
      const dateTo = moment(!!param.to ? param.to : param.from)
        .add(1, 'day')
        .add(-1, 'millisecond')
        .toDate();
      queryParams.push(param.from, dateTo);
    }

    let sql = COUNT_QUALITY_CHECK_REPORTS;

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

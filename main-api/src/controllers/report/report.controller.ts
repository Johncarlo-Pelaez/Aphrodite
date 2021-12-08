import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import {
  ApiPaginatedResponse,
  PaginatedResponse,
  AzureADGuard,
} from 'src/core';
import { DocumentHistory, Document } from 'src/entities';
import { DocumentStatus } from 'src/entities/document.enum';
import { ReportRepository } from 'src/repositories';
import { ExcelService, ExcelRowItem } from 'src/excel-service';
import { FilenameUtil } from 'src/utils';
import { GetUploadedDocumentsReportDto } from './report.dto';
import { GetDocumentsReportIntPipe } from './report.pipe';

@Controller('/reports')
@UseGuards(AzureADGuard)
export class ReportController {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly excelService: ExcelService,
    private readonly filenameUtil: FilenameUtil,
  ) {}

  @ApiPaginatedResponse(DocumentHistory)
  @Get('/uploaded')
  async getUploadedDocumentsReport(
    @Query(GetDocumentsReportIntPipe) dto: GetUploadedDocumentsReportDto,
  ): Promise<PaginatedResponse<DocumentHistory>> {
    const response = new PaginatedResponse<DocumentHistory>();
    response.count = await this.reportRepository.getDocumentReportsCount({
      username: dto.username,
      from: dto.from,
      to: dto.to,
      statuses: [DocumentStatus.UPLOADED],
    });
    response.data = await this.reportRepository.getDocumentReports({
      ...dto,
      statuses: [DocumentStatus.UPLOADED],
    });
    return response;
  }

  @Get('/uploaded/download')
  async downloadUploadedDocumentsReport(
    @Query() dto: GetUploadedDocumentsReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.reportRepository.getDocumentReports({
      ...dto,
      statuses: [DocumentStatus.UPLOADED],
    });
    const excelFileBuffer = await this.excelService.create({
      columns: [
        {
          key: 'filename',
          title: 'Filename',
        },
        {
          key: 'uploader',
          title: 'Uploader',
        },
        {
          key: 'uploadedDate',
          title: 'Uploaded Date',
        },
      ],
      rows: data.map((doc) =>
        Object.entries(doc).reduce(
          (excelRowItem: ExcelRowItem[], [key, value]) => {
            if (key === 'userUsername') {
              excelRowItem.push({
                key: 'uploader',
                value,
              });
            }
            if (key === 'createdDate') {
              excelRowItem.push({
                key: 'uploadedDate',
                value,
              });
            } else if (key === 'document' && value instanceof Document) {
              excelRowItem.push({
                key: 'filename',
                value: value.documentName,
              });
            }
            return excelRowItem;
          },
          [],
        ),
      ),
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=uploaded-documents-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }
}

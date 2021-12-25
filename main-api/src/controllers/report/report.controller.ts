import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { Response } from 'express';
import {
  ApiPaginatedResponse,
  PaginatedResponse,
  AzureADGuard,
} from 'src/core';
import { DocumentHistory } from 'src/entities';
import { ReportRepository } from 'src/repositories';
import {
  InformationRequestReport,
  QualityCheckReport,
  ApprovalReport,
  ImportReport,
  RISReport,
} from 'src/repositories/report';
import { ReportService } from 'src/report-service';
import { FilenameUtil } from 'src/utils';
import {
  GetUploadedReportDto,
  DownloadUploadedReportDto,
  GetInformationRequestReportDto,
  DownloadInformationRequestReportDto,
  GetQualityCheckReportDto,
  DonwloadQualityCheckReportDto,
  GetApprovalReportDto,
  DownloadApprovalReportDto,
  GetImportReportDto,
  DownloadImportReportDto,
  GetRISReportDto,
  DownloadRISReportDto,
} from './report.dto';
import { GetDocumentsReportIntPipe } from './report.pipe';

@Controller('/reports')
@UseGuards(AzureADGuard)
export class ReportController {
  constructor(
    private readonly reportRepository: ReportRepository,
    private readonly reportService: ReportService,
    private readonly filenameUtil: FilenameUtil,
  ) {}

  @ApiPaginatedResponse(DocumentHistory)
  @Get('/uploaded')
  async getUploadedReport(
    @Query(GetDocumentsReportIntPipe) dto: GetUploadedReportDto,
  ): Promise<PaginatedResponse<DocumentHistory>> {
    const response = new PaginatedResponse<DocumentHistory>();
    response.count = await this.reportRepository.getUploadedCountReport({
      uploader: dto.uploader,
      from: dto.from,
      to: dto.to,
    });
    response.data = await this.reportRepository.getUploadedReport({
      uploader: dto.uploader,
      from: dto.from,
      to: dto.to,
      skip: dto.skip,
      take: dto.take,
    });
    return response;
  }

  @Get('/uploaded/download')
  async downloadUploadedReport(
    @Query() dto: DownloadUploadedReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const excelFileBuffer = await this.reportService.generateUploadedExcel({
      uploader: dto.uploader,
      from: dto.from,
      to: dto.to,
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=documents-uploaded-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }

  @ApiExtraModels(InformationRequestReport)
  @ApiPaginatedResponse(InformationRequestReport)
  @Get('/information-request')
  async getInformationRequestReport(
    @Query(GetDocumentsReportIntPipe) dto: GetInformationRequestReportDto,
  ): Promise<PaginatedResponse<InformationRequestReport>> {
    const response = new PaginatedResponse<InformationRequestReport>();
    response.count =
      await this.reportRepository.getInformationRequestCountReport({
        encoder: dto.encoder,
        from: dto.from,
        to: dto.to,
      });
    response.data = await this.reportRepository.getInformationRequestReport(
      dto,
    );
    return response;
  }

  @Get('/information-request/download')
  async downloadInformationRequestReport(
    @Query() dto: DownloadInformationRequestReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const excelFileBuffer =
      await this.reportService.generateInformationRequestExcel({
        encoder: dto.encoder,
        from: dto.from,
        to: dto.to,
      });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=documents-information-request-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }

  @ApiExtraModels(QualityCheckReport)
  @ApiPaginatedResponse(QualityCheckReport)
  @Get('/quality-check')
  async getQualityCheckReport(
    @Query(GetDocumentsReportIntPipe) dto: GetQualityCheckReportDto,
  ): Promise<PaginatedResponse<QualityCheckReport>> {
    const response = new PaginatedResponse<QualityCheckReport>();
    response.count = await this.reportRepository.getQualityCheckCountReport({
      checker: dto.checker,
      from: dto.from,
      to: dto.to,
    });
    response.data = await this.reportRepository.getQualityCheckReport(dto);
    return response;
  }

  @Get('/quality-check/download')
  async downloadQualityCheckReport(
    @Query() dto: DonwloadQualityCheckReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const excelFileBuffer = await this.reportService.generateQualityCheckExcel({
      checker: dto.checker,
      from: dto.from,
      to: dto.to,
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=documents-quality-check-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }

  @ApiExtraModels(ApprovalReport)
  @ApiPaginatedResponse(ApprovalReport)
  @Get('/approval')
  async getApprovalReport(
    @Query(GetDocumentsReportIntPipe) dto: GetApprovalReportDto,
  ): Promise<PaginatedResponse<ApprovalReport>> {
    const response = new PaginatedResponse<ApprovalReport>();
    response.count = await this.reportRepository.getApprovalCountReport({
      appover: dto.approver,
      from: dto.from,
      to: dto.to,
    });
    response.data = await this.reportRepository.getApprovalReport(dto);
    return response;
  }

  @Get('/approval/download')
  async downloadApprovalReport(
    @Query() dto: DownloadApprovalReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const excelFileBuffer = await this.reportService.generateApprovalExcel({
      approver: dto.approver,
      from: dto.from,
      to: dto.to,
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=documents-approval-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }

  @ApiExtraModels(ImportReport)
  @ApiPaginatedResponse(ImportReport)
  @Get('/import')
  async getImportReport(
    @Query(GetDocumentsReportIntPipe) dto: GetImportReportDto,
  ): Promise<PaginatedResponse<ImportReport>> {
    const response = new PaginatedResponse<ImportReport>();
    response.count = await this.reportRepository.getImportCountReport({
      username: dto.username,
      from: dto.from,
      to: dto.to,
    });
    response.data = await this.reportRepository.getImportReport(dto);
    return response;
  }

  @Get('/import/download')
  async downloadImportReport(
    @Query() dto: DownloadImportReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const excelFileBuffer = await this.reportService.generateImportExcel({
      username: dto.username,
      from: dto.from,
      to: dto.to,
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=documents-import-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }

  @ApiExtraModels(RISReport)
  @ApiPaginatedResponse(RISReport)
  @Get('/ris')
  async getRISReport(
    @Query(GetDocumentsReportIntPipe) dto: GetRISReportDto,
  ): Promise<PaginatedResponse<RISReport>> {
    const response = new PaginatedResponse<RISReport>();
    response.count = await this.reportRepository.getRISCountReport({
      scannerUsername: dto.scannerUsername,
      nomenclature: dto.nomenclature,
      statuses: dto.statuses,
      from: dto.from,
      to: dto.to,
    });
    response.data = await this.reportRepository.getRISReport(dto);
    return response;
  }

  @Get('/ris/download')
  async downloadRISReport(
    @Query() dto: DownloadRISReportDto,
    @Res() res: Response,
  ): Promise<void> {
    const excelFileBuffer = await this.reportService.generateRISReportExcel({
      scannerUsername: dto.scannerUsername,
      nomenclature: dto.nomenclature,
      statuses: dto.statuses,
      from: dto.from,
      to: dto.to,
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ris-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }
}
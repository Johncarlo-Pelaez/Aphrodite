import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  ValidationPipe,
  Body,
  Query,
  UploadedFile,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import {
  ApiPaginatedResponse,
  CreatedResponse,
  GetAzureUsername,
  PaginatedResponse,
  ApiFile,
  fileMimetypeFilter,
  AzureADGuard,
} from 'src/core';
import { Document, DocumentHistory } from 'src/entities';
import { DocumentRepository } from 'src/repositories';
import { DocumentService } from 'src/services';
import {
  GetDocumentsDto,
  EncodeDocDetailsDto,
  EncodeDocQRBarCodeDto,
  CheckerApproveDocDto,
  CheckerDisApproveDocDto,
  RetryDocumentsDto,
  GetDocumentsProcessCountDto,
  CancelDocumentsDto,
} from './document.dto';
import {
  GetDocumentsIntPipe,
  RetryDocumentsIntPipe,
  CancelDocumentsIntPipe,
} from './document.pipe';

@Controller('/documents')
@UseGuards(AzureADGuard)
export class DocumentController {
  constructor(
    private readonly documentsService: DocumentService,
    private readonly documentRepository: DocumentRepository,
  ) {}

  @ApiPaginatedResponse(Document)
  @Get('/')
  async getDocuments(
    @Query(GetDocumentsIntPipe) dto: GetDocumentsDto,
  ): Promise<PaginatedResponse<Document>> {
    const response = new PaginatedResponse<Document>();

    response.count = await this.documentRepository.count({
      search: dto.search,
      documentType: dto.documentType,
      statuses: dto.statuses,
    });
    response.data = await this.documentRepository.getDocuments(dto);

    return response;
  }

  @ApiOkResponse({
    type: Document,
  })
  @Get('/:id')
  async getDocument(@Param('id', ParseIntPipe) id: number): Promise<Document> {
    return await this.documentRepository.getDocument(id);
  }

  @ApiOkResponse({
    type: DocumentHistory,
    isArray: true,
  })
  @Get('/:id/history')
  async getDocumentHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DocumentHistory[]> {
    return await this.documentRepository.getHistory(id);
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @Post('/')
  @ApiFile('file', true, { fileFilter: fileMimetypeFilter('pdf') })
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @GetAzureUsername() username: string,
  ): Promise<CreatedResponse> {
    return await this.documentsService.uploadDocument({
      file,
      uploadedBy: username,
    });
  }

  @ApiOkResponse({
    type: Buffer,
  })
  @Get('/:id/file')
  async getDocumentFile(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Res() res: Response,
  ): Promise<void> {
    const [document, buffer] = await this.documentsService.getDocumentFile(
      documentId,
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${document.documentName}"`,
    );
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
  }

  @ApiOkResponse()
  @Put('/:id/encode/qrbarcode')
  async encodeDocQRBarCode(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: EncodeDocQRBarCodeDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.encodeDocQRBarcode({
      documentId,
      qrBarCode: dto.qrBarCode,
      encodedBy: username,
    });
  }

  @ApiOkResponse()
  @Put('/:id/encode/details')
  async encodeDocDetails(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: EncodeDocDetailsDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.encodeDocDetails({
      documentId,
      companyCode: dto.companyCode,
      contractNumber: dto.contractNumber,
      nomenclature: dto.nomenclature,
      documentGroup: dto.documentGroup,
      encodedBy: username,
    });
  }

  @ApiOkResponse()
  @Put('/:id/checker/approve')
  async checkerApproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: CheckerApproveDocDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.checkerApproveDoc({
      documentId,
      documentDate: dto.documentDate,
      checkedBy: username,
    });
  }

  @ApiOkResponse()
  @Put('/:id/checker/disapprove')
  async checkerDisApproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: CheckerDisApproveDocDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.checkerDisapproveDoc({
      documentId,
      documentDate: dto.documentDate,
      remarks: dto.remarks,
      checkedBy: username,
    });
  }

  @ApiOkResponse()
  @Put('/:id/approver/approve')
  async approverApproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.approverApproveDoc({
      documentId,
      approver: username,
    });
  }

  @ApiOkResponse()
  @Put('/:id/approver/disapprove')
  async approverDisapproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.approverDisapproveDoc({
      documentId,
      approver: username,
    });
  }

  @ApiOkResponse()
  @Put('/retry')
  async retryDocuments(
    @Body(RetryDocumentsIntPipe) dto: RetryDocumentsDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.retryDocuments({
      documentIds: dto.documentIds,
      retriedBy: username,
    });
  }

  @ApiOkResponse()
  @Get('/retry/error')
  async retryErrorDocuments(
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.retryErrorDocuments(username);
  }

  @ApiOkResponse()
  @Put('/cancel')
  async cancelDocuments(
    @Body(CancelDocumentsIntPipe) dto: CancelDocumentsDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.cancelDocuments({
      documentIds: dto.documentIds,
      cancelledBy: username,
    });
  }

  @ApiOkResponse()
  @Get('/cancel/waiting-inqueue')
  async cancelWaitingInQueue(
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.cancelWaitingDocumentsInQueue(username);
  }

  @ApiOkResponse({
    type: Number,
  })
  @Get('/process/count')
  async getDocumentsProcessCount(
    @Query() dto: GetDocumentsProcessCountDto,
  ): Promise<number> {
    return await this.documentRepository.count({
      statuses: dto.statuses,
    });
  }
}

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
  GetUserId,
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
} from './document.dto';
import { GetDocumentsIntPipe, RetryDocumentsIntPipe } from './document.pipe';

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
    @GetUserId() userId: number,
  ): Promise<CreatedResponse> {
    return await this.documentsService.uploadDocument({
      file,
      uploadedBy: userId,
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
    @GetUserId() userId: number,
  ): Promise<void> {
    await this.documentsService.encodeDocQRBarcode({
      documentId,
      qrCode: dto.qrCode,
      encodedBy: userId,
    });
  }

  @ApiOkResponse()
  @Put('/:id/encode/details')
  async encodeDocDetails(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: EncodeDocDetailsDto,
    @GetUserId() userId: number,
  ): Promise<void> {
    await this.documentsService.encodeDocDetails({
      documentId,
      companyCode: dto.companyCode,
      contractNumber: dto.contractNumber,
      nomenclature: dto.nomenClature,
      documentGroup: dto.documentGroup,
      encodedBy: userId,
    });
  }

  @ApiOkResponse()
  @Put('/:id/checker/approve')
  async checkerApproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: CheckerApproveDocDto,
    @GetUserId() userId: number,
  ): Promise<void> {
    await this.documentsService.checkerApproveDoc({
      documentId,
      documentDate: dto.documentDate,
      checkedBy: userId,
    });
  }

  @ApiOkResponse()
  @Put('/:id/checker/disapprove')
  async checkerDisApproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: CheckerDisApproveDocDto,
    @GetUserId() userId: number,
  ): Promise<void> {
    await this.documentsService.checkerDisapproveDoc({
      documentId,
      documentDate: dto.documentDate,
      remarks: dto.remarks,
      checkedBy: userId,
    });
  }

  @ApiOkResponse()
  @Put('/:id/approver/approve')
  async approverApproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @GetUserId() userId: number,
  ): Promise<void> {
    await this.documentsService.approverApproveDoc({
      documentId,
      approver: userId,
    });
  }

  @ApiOkResponse()
  @Put('/:id/approver/disapprove')
  async approverDisapproveDoc(
    @Param('id', ParseIntPipe)
    documentId: number,
    @GetUserId() userId: number,
  ): Promise<void> {
    await this.documentsService.approverDisapproveDoc({
      documentId,
      approver: userId,
    });
  }

  @ApiOkResponse()
  @Put('/retry')
  async retryDocuments(
    @Body(RetryDocumentsIntPipe) dto: RetryDocumentsDto,
    @GetUserId() userId: number,
  ): Promise<void> {
    await this.documentsService.retryDocuments({
      documentIds: dto.documentIds,
      retryBy: userId,
    });
  }
}

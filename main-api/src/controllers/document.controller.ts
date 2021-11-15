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
import { GetDocumentsDto, EncodeDocumentDto } from './document.dto';
import { GetDocumentsIntPipe } from './document.pipe';

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

    response.count = await this.documentRepository.count(dto.search);
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
  uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @GetUserId() userId: number,
  ): Promise<CreatedResponse> {
    return this.documentsService.uploadDocument({
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
  @Put('/:id/encode')
  async encodeDocument(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: EncodeDocumentDto,
    @GetUserId() userId: number,
  ): Promise<void> {
    return await this.documentsService.encodeDocument({
      documentId,
      qrCode: dto.qrCode,
      companyCode: dto.companyCode,
      contractNumber: dto.contractNumber,
      nomenClature: dto.nomenClature,
      documentGroup: dto.documentGroup,
      encodedBy: userId,
    });
  }
}

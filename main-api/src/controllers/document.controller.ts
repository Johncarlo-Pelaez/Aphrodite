import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
  GetAzureUser,
  AzureUser,
} from 'src/core';
import { Document, DocumentHistory } from 'src/entities';
import { DocumentRepository } from 'src/repositories';
import { DocumentsService } from 'src/services';
import { GetDocumentsDto } from './document.dto';
import { GetDocumentsIntPipe } from './document.pipe';

@Controller('/documents')
export class DocumentController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly documentRepository: DocumentRepository,
  ) {}

  @ApiPaginatedResponse(Document)
  @Get('/')
  // @UseGuards(AzureADGuard)
  async getDocuments(
    // @GetAzureUser() azureUser: AzureUser,
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
}

import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  ApiPaginatedResponse,
  CreatedResponse,
  GetUserId,
  PaginatedResponse,
} from 'src/core';
import { Document, DocumentHistory } from 'src/entities';
import { QueueService } from 'src/queue';
import { DocumentRepository } from 'src/repositories';
import { GetDocumentsDto, CreateDocumentDto } from './document.dto';
import { GetDocumentsIntPipe } from './document.pipe';

@Controller('/documents')
export class DocumentController {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly queueService: QueueService,
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
    type: DocumentHistory,
    isArray: true,
  })
  @Get('/:id/history')
  async getDocumentHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DocumentHistory[]> {
    return this.documentRepository.getHistory(id);
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @Post('/')
  async createDocument(
    @Body(ValidationPipe) dto: CreateDocumentDto,
    @GetUserId() userId: number,
  ): Promise<CreatedResponse> {
    const response = new CreatedResponse();
    const rightNow = new Date();

    response.id = await this.documentRepository.createDocument({
      ...dto,
      createdDate: rightNow,
      userId,
    });

    await this.queueService.migrate(response.id);

    return response;
  }
}

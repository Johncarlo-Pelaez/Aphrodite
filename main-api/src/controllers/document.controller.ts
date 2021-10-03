import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreatedResponse, GetUserId } from 'src/core';
import { Document, DocumentHistory } from 'src/entities';
import { DocumentRepository } from 'src/repositories';
import { CreateDocumentDto } from '../dtos/document.dto';

@Controller('/documents')
export class DocumentController {
  constructor(private readonly documentRepository: DocumentRepository) {}

  @ApiOkResponse({
    type: Document,
    isArray: true,
  })
  @Get('/')
  async getDocuments(): Promise<Document[]> {
    return this.documentRepository.getDocuments();
  }

  @ApiOkResponse({
    type: DocumentHistory,
    isArray: true,
  })
  @Get('/:id/history')
  async getDocumentHistory(
    @Param('id') id: number,
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

    return response;
  }
}

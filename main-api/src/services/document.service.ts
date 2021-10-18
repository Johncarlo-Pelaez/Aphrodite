import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { DatesUtil } from 'src/utils';
import { AppConfigService } from 'src/app-config';
import { DocumentRepository } from 'src/repositories';
import { DocumentProducer } from 'src/producers';
import { CreatedResponse } from 'src/core';
import { Document } from 'src/entities';
import { UploadDocuments } from './documents.inputs';
const { readFile, writeFile } = fs.promises;

@Injectable()
export class DocumentsService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly datesUtil: DatesUtil,
    private readonly appConfigService: AppConfigService,
    private readonly documentProducer: DocumentProducer,
  ) {}

  async uploadDocument(data: UploadDocuments): Promise<CreatedResponse> {
    const dateRightNow = this.datesUtil.getDateNow();
    let file = data.file;
    const uuid = uuidv4();
    let fileName: string = uuid;
    const fullPath = path.join(
      this.appConfigService.filePath,
      fileName.toUpperCase(),
    );

    await writeFile(fullPath, file.buffer);

    const response = new CreatedResponse();
    response.id = await this.documentRepository.createDocument({
      uuid: fileName,
      documentName: file.originalname,
      documentSize: file.size,
      createdDate: dateRightNow,
      userId: data.uploadedBy,
    });

    await this.documentProducer.migrate(response.id);
    return response;
  }

  async getDocumentFile(documentId: number): Promise<[Document, Buffer]> {
    const document = await this.documentRepository.getDocument(documentId);
    const buffer = await readFile(
      path.join(this.appConfigService.filePath, document.uuid),
    );
    return [document, buffer];
  }
}

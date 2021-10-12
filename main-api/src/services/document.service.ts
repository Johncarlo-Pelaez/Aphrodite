import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { DatesUtil } from 'src/utils';
import { AppConfigService } from 'src/app-config';
import { DocumentRepository } from 'src/repositories';
import { QueueService } from 'src/queue';
import { CreatedResponse } from 'src/core';
import { UploadDocuments } from './documents.inputs';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly documentRepository: DocumentRepository,
    private readonly datesUtil: DatesUtil,
    private readonly appConfigService: AppConfigService,
    private readonly queueService: QueueService,
  ) {}

  async uploadDocument(data: UploadDocuments): Promise<CreatedResponse> {    
    const dateRightNow = this.datesUtil.getDateNow(); 
    let file = data.file;
    const uuid = uuidv4();
    const fullPath = path.join(this.appConfigService.filePath, uuid);

    await fs.promises.writeFile(fullPath, file.buffer);

    const response = new CreatedResponse();
    response.id = await this.documentRepository.createDocument({
      uuid,
      documentName: file.originalname,
      documentSize: file.size,
      createdDate: dateRightNow,
      userId: data.uploadedBy,
    });

    await this.queueService.migrate(response.id);
    return response;
  }
}

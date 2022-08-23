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
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import {
  ApiPaginatedResponse,
  CreatedResponse,
  GetAzureUsername,
  PaginatedResponse,
  ApiFile,
  fileMimetypeFilter,
  Roles,
  Auth,
} from 'src/core';
import { Role } from 'src/entities/user.entity';
import { Document, DocumentHistory, DocumentStatus } from 'src/entities';
import { DocumentRepository, GetDocumentsParam, UserRepository } from 'src/repositories';
import { DocumentService } from 'src/document-service';
import {
  GetDocumentsDto,
  EncodeDocDetailsDto,
  EncodeDocQRBarCodeDto,
  CheckerApproveDocDto,
  CheckerDisApproveDocDto,
  RetryDocumentsDto,
  GetDocumentsProcessCountDto,
  CancelDocumentsDto,
  DeleteDocumentsDto,
} from './document.dto';
import {
  GetDocumentsIntPipe,
  RetryDocumentsIntPipe,
  CancelDocumentsIntPipe,
} from './document.pipe';

@Auth()
@Controller('/documents')
export class DocumentController {
  constructor(
    private readonly documentsService: DocumentService,
    private readonly documentRepository: DocumentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @ApiBadRequestResponse()
  @ApiPaginatedResponse(Document)
  @Get('/')
  async getDocuments(
    @Query(GetDocumentsIntPipe) {search, documentType, statuses, username, from, to, skip, take}: GetDocumentsDto,
    @GetAzureUsername() currentUserLogIn: string,
  ): Promise<PaginatedResponse<Document>> {
    const response = new PaginatedResponse<Document>();

    const currentUserRole = await (
      await this.userRepository.getUserByEmail(currentUserLogIn)
    )?.role;

    if(!currentUserRole) throw new BadRequestException();

    const documentsDto: GetDocumentsParam = {
      search,
      documentType,
      statuses,
      username,
      from,
      to,
      skip,
      take,
      currentUserRole,
      currentUserLogIn,
    }

    response.count = await this.documentRepository.count(documentsDto);
    response.data = await this.documentRepository.getDocuments(documentsDto);

    if(currentUserRole === Role.REVIEWER)
    {
      const reviewerDocuments = response.data.filter(i => i.userUsername === currentUserLogIn || i.status.includes(DocumentStatus.DISAPPROVED));
      response.data = reviewerDocuments;
    }

    return response;
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

  @ApiOkResponse()
  @Delete('/')
  async deleteDocuments(
    @Body(RetryDocumentsIntPipe) dto: DeleteDocumentsDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.deleteDocuments({
      documentIds: dto.documentIds,
      deletedBy: username,
    });
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

  @Roles(Role.REVIEWER, Role.ADMIN)
  @ApiOkResponse()
  @Put('/:id/file')
  @ApiFile('file', true, { fileFilter: fileMimetypeFilter('pdf') })
  async replaceDocumentFile(
    @Param('id', ParseIntPipe)
    documentId: number,
    @UploadedFile() file: Express.Multer.File,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    return await this.documentsService.replaceDocumentFile({
      documentId,
      file,
      replacedBy: username,
    });
  }

  @ApiOkResponse()
  @Put('/:id/encode/qrbarcode')
  async encodeDocQRBarCode(
    @Param('id', ParseIntPipe)
    documentId: number,
    @Body(ValidationPipe) dto: EncodeDocQRBarCodeDto,
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.checkBarcodeIfExist(documentId, dto.qrBarCode);

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
      remarks: dto.remarks,
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

  @Roles(Role.REVIEWER, Role.ADMIN)
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

  @Roles(Role.REVIEWER, Role.ADMIN)
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
  @Put('/retry/error')
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
  @Put('/cancel/waiting')
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
    @GetAzureUsername() currentUserLogIn: string,
  ): Promise<number> {
    const currentUserRole = await (
      await this.userRepository.getUserByEmail(currentUserLogIn)
    )?.role;

    if(!currentUserRole) throw new BadRequestException();

    return await this.documentRepository.count({
      statuses: dto.statuses,
      currentUserRole,
      currentUserLogIn,
    });
  }
}

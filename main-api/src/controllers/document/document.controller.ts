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

/*
 * API Documents
 */ 
@Auth()
@Controller('/documents')
export class DocumentController {
  constructor(
    private readonly documentsService: DocumentService,
    private readonly documentRepository: DocumentRepository,
    private readonly userRepository: UserRepository,
  ) {}

  // Get Documents
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

    const [document, count] = await this.documentRepository.getDocuments(documentsDto);

    if(currentUserRole === Role.REVIEWER)
    {
      const reviewerDocuments = document.filter(i => i.userUsername === currentUserLogIn || i.status.includes(DocumentStatus.DISAPPROVED));
      response.data = reviewerDocuments;
      response.count = reviewerDocuments.length;

      return response;
    } else {
      response.data = document;
      response.count = count;
  
      return response;
    }
  }

  // Upload Documents
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

  // Delete Documents
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

  // Get Document
  @ApiOkResponse({
    type: Document,
  })
  @Get('/:id')
  async getDocument(@Param('id', ParseIntPipe) id: number): Promise<Document> {
    return await this.documentRepository.getDocument(id);
  }

  // Get Document History
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

  // Get Document File
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

  // Replace Document
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

  // Manual Encode Barcode
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

  // Manual Encode Document Details
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

  // Checker Approve Document
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

  // Checker Disapprove Document
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

  // Approver Approve Document
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

  // Approver Disapprove Document
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

  // Retry Documents
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

  // Retry Error Documents
  @ApiOkResponse()
  @Put('/retry/error')
  async retryErrorDocuments(
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.retryErrorDocuments(username);
  }

  // Cancel Document Process
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

  // Cancel Document Status waiting
  @ApiOkResponse()
  @Put('/cancel/waiting')
  async cancelWaitingInQueue(
    @GetAzureUsername() username: string,
  ): Promise<void> {
    await this.documentsService.cancelWaitingDocumentsInQueue(username);
  }

  // Count of documents of a user depending on role 
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

    return await this.documentRepository.countDocuments({
      statuses: dto.statuses,
      currentUserRole,
      currentUserLogIn,
    });
  }
}

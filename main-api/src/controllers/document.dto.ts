import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsDateString,
  IsOptional,
  IsString,
  IsEmail,
  IsUUID,
} from 'class-validator';
import { DocumentStatus } from 'src/entities';

export class GetDocumentsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  take?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ each: true })
  statuses?: DocumentStatus[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  username?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  to?: Date;
}

export class CreateDocumentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsString()
  documentName: string;

  @ApiProperty({
    description: 'In bytes',
  })
  @IsNumber()
  documentSize: number;
}

export class EncodeDocDetailsDto {
  @ApiProperty()
  @IsString()
  companyCode: string;

  @ApiProperty()
  @IsString()
  contractNumber: string;

  @ApiProperty()
  @IsString()
  nomenclature: string;

  @ApiProperty()
  @IsString()
  documentGroup: string;
}

export class EncodeDocQRBarCodeDto {
  @ApiProperty()
  @IsString()
  qrBarCode: string;
}

export class CheckerApproveDocDto {
  @ApiProperty()
  @IsDateString()
  documentDate: string;
}

export class CheckerDisApproveDocDto extends CheckerApproveDocDto {
  @ApiProperty()
  @IsString()
  remarks: string;
}

export class RetryDocumentsDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false }, { each: true })
  documentIds: number[];
}

export class GetDocumentsProcessCountDto {
  @ApiProperty()
  @IsString({ each: true })
  statuses: DocumentStatus[];
}

export class CancelDocumentsDto extends RetryDocumentsDto {}

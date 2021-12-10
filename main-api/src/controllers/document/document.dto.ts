import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsDateString,
  IsOptional,
  IsString,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';
import { DocumentStatus } from 'src/entities';

export class GetDocumentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  take?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  documentType?: string;

  @ApiPropertyOptional({ enum: DocumentStatus, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  statuses?: DocumentStatus[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;
}

export class EncodeDocDetailsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Company is required.' })
  @IsString()
  companyCode: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Contract number is required.' })
  @IsString()
  contractNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Nomenclature is required.' })
  nomenclature: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Document group is required.' })
  @IsString()
  documentGroup: string;
}

export class EncodeDocQRBarCodeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Barcode or QR Code is required.' })
  @IsString()
  qrBarCode: string;
}

export class CheckerApproveDocDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Document date is required.' })
  @IsDateString()
  documentDate: string;
}

export class CheckerDisApproveDocDto extends CheckerApproveDocDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Remarks is required.' })
  @IsString()
  remarks: string;
}

export class RetryDocumentsDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Document IDs is required.' })
  @IsNumber({ allowNaN: false }, { each: true })
  documentIds: number[];
}

export class GetDocumentsProcessCountDto {
  @ApiProperty({ enum: DocumentStatus, isArray: true, required: true })
  @IsNotEmpty({ message: 'Statuses is required.' })
  @IsString({ each: true })
  statuses: DocumentStatus[];
}

export class CancelDocumentsDto extends RetryDocumentsDto {}

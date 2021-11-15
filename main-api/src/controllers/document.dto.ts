import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

export class EncodeDocumentDto {
  @ApiProperty()
  @IsString()
  qrCode: string;

  @ApiProperty()
  @IsString()
  companyCode: string;

  @ApiProperty()
  @IsString()
  contractNumber: string;

  @ApiProperty()
  @IsString()
  nomenClature: string;

  @ApiProperty()
  @IsString()
  documentGroup: string;
}

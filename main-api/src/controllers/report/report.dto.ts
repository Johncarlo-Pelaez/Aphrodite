import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsDateString,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class GetUploadedDocumentsReportDto {
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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  take?: number;
}

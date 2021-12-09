import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsDateString,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class GetUploadedReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  uploader?: string;

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

export class DownloadUploadedReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  uploader?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  to?: Date;
}

export class GetInformationRequestReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  encoder?: string;

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

export class DownloadInformationRequestReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  encoder?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  to?: Date;
}

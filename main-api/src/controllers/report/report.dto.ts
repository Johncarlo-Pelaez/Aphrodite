import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumberString,
  IsDateString,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class GetUploadedReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  uploader?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  take?: number;
}

export class DownloadUploadedReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  uploader?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;
}

export class GetInformationRequestReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  encoder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  take?: number;
}

export class DownloadInformationRequestReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  encoder?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;
}

export class GetQualityCheckReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  checker?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  take?: number;
}

export class DonwloadQualityCheckReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  checker?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;
}

export class GetApprovalReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  approver?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  take?: number;
}

export class DownloadApprovalReportDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  approver?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;
}

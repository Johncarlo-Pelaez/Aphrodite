import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import {
  IsNumberString,
  IsDateString,
  IsOptional,
  IsEmail,
  IsString,
} from 'class-validator';
import { DocumentStatus } from 'src/entities/document.enum';

class GetReportDateRangeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;
}

class GetReportPageFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  skip?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  take?: number;
}

export class GetUploadedReportDto extends IntersectionType(
  GetReportDateRangeFilterDto,
  GetReportPageFilterDto,
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  uploader?: string;
}

export class DownloadUploadedReportDto extends GetReportDateRangeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  uploader?: string;
}

export class GetInformationRequestReportDto extends IntersectionType(
  GetReportDateRangeFilterDto,
  GetReportPageFilterDto,
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  encoder?: string;
}

export class DownloadInformationRequestReportDto extends GetReportDateRangeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  encoder?: string;
}

export class GetQualityCheckReportDto extends IntersectionType(
  GetReportDateRangeFilterDto,
  GetReportPageFilterDto,
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  checker?: string;
}

export class DonwloadQualityCheckReportDto extends GetReportDateRangeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  checker?: string;
}

export class GetApprovalReportDto extends IntersectionType(
  GetReportDateRangeFilterDto,
  GetReportPageFilterDto,
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  approver?: string;
}

export class DownloadApprovalReportDto extends GetReportDateRangeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  approver?: string;
}

export class GetImportReportDto extends IntersectionType(
  GetReportDateRangeFilterDto,
  GetReportPageFilterDto,
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  username?: string;
}

export class DownloadImportReportDto extends GetReportDateRangeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  username?: string;
}

export class GetRISReportDto extends IntersectionType(
  GetReportDateRangeFilterDto,
  GetReportPageFilterDto,
) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  scannerUsername?: string;

  @ApiPropertyOptional({ enum: DocumentStatus, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  statuses?: DocumentStatus[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nomenclature?: string;
}

export class DownloadRISReportDto extends GetReportDateRangeFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  scannerUsername?: string;

  @ApiPropertyOptional({ enum: DocumentStatus, isArray: true })
  @IsOptional()
  @IsString({ each: true })
  statuses?: DocumentStatus[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nomenclature?: string;
}

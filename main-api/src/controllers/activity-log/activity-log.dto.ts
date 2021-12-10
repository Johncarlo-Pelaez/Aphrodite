import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsEmail,
  IsDateString,
} from 'class-validator';

export class GetActivityLogsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  loggedBy?: string;

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

export class DownloadActivityLogsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  loggedBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  to?: Date;
}

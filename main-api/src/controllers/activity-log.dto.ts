import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumberString,
  IsOptional,
  IsString,
  IsEmail,
  IsDateString,
} from 'class-validator';
import { ActivityLogType } from 'src/entities';

export class GetActivityLogsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  activityType?: ActivityLogType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  loggedBy?: string;

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

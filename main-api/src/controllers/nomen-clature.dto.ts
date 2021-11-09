import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class NomenClatureDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required.' })
  @IsString()
  description: string;
}

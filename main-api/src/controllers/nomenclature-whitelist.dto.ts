import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNomenclatureWhitelistDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Description is required.' })
  @IsString()
  description: string;
}

export class UpdateNomenclatureWhitelistDto extends CreateNomenclatureWhitelistDto {}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNomenclatureDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Nomenclature is required.' })
  @IsString()
  nomenclature: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Document Group is required.' })
  @IsString()
  documentGroup: string;
}

export class UpdateNomenclatureDto extends CreateNomenclatureDto {}

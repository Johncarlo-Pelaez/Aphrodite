import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNomenclatureLookupDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Nomenclature is required.' })
  @IsString()
  nomenclature: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Document Group is required.' })
  @IsString()
  documentGroup: string;
}

export class UpdateNomenclatureLookupDto extends CreateNomenclatureLookupDto {}

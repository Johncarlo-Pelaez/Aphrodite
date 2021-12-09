import { ApiProperty } from '@nestjs/swagger';

export class InformationRequestReport {
  @ApiProperty()
  requestedDate: Date;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  encoder: string;

  @ApiProperty()
  qrCode: string;

  @ApiProperty()
  documentType: string;

  @ApiProperty()
  documentSize: number;

  @ApiProperty()
  pageTotal: number;

  @ApiProperty()
  documentStatus: number;

  @ApiProperty()
  note: string;
}

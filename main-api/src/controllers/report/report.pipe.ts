import { StringToIntPipe } from 'src/core/pipes';
import { GetUploadedDocumentsReportDto } from './report.dto';

export class GetDocumentsReportIntPipe extends StringToIntPipe<GetUploadedDocumentsReportDto> {
  props: (keyof GetUploadedDocumentsReportDto)[] = ['skip', 'take'];
}

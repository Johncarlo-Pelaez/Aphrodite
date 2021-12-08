import { StringToIntPipe } from 'src/core/pipes';
import { GetUploadedReportDto } from './report.dto';

export class GetDocumentsReportIntPipe extends StringToIntPipe<GetUploadedReportDto> {
  props: (keyof GetUploadedReportDto)[] = ['skip', 'take'];
}

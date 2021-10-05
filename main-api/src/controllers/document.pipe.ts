import { StringToIntPipe } from 'src/core/pipes';
import { GetDocumentsDto } from './document.dto';

export class GetDocumentsIntPipe extends StringToIntPipe<GetDocumentsDto> {
  props: (keyof GetDocumentsDto)[] = ['skip', 'take'];
}

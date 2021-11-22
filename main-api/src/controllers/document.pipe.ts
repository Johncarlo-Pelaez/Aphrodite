import { StringToIntPipe } from 'src/core/pipes';
import { GetDocumentsDto, RetryDocumentsDto } from './document.dto';

export class GetDocumentsIntPipe extends StringToIntPipe<GetDocumentsDto> {
  props: (keyof GetDocumentsDto)[] = ['skip', 'take'];
}

export class RetryDocumentsIntPipe extends StringToIntPipe<RetryDocumentsDto> {
  props: (keyof RetryDocumentsDto)[] = ['documentIds'];
}

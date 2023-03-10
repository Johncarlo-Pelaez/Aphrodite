import { StringToIntPipe, StringArrayToIntArrayPipe } from 'src/core/pipes';
import {
  GetDocumentsDto,
  RetryDocumentsDto,
  CancelDocumentsDto,
} from './document.dto';

export class GetDocumentsIntPipe extends StringToIntPipe<GetDocumentsDto> {
  props: (keyof GetDocumentsDto)[] = ['skip', 'take'];
}

export class RetryDocumentsIntPipe extends StringArrayToIntArrayPipe<RetryDocumentsDto> {
  props: (keyof RetryDocumentsDto)[] = ['documentIds'];
}

export class CancelDocumentsIntPipe extends StringArrayToIntArrayPipe<CancelDocumentsDto> {
  props: (keyof RetryDocumentsDto)[] = ['documentIds'];
}

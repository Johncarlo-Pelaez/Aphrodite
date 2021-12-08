import { StringToIntPipe } from 'src/core/pipes';
import { GetActivityLogsDto } from './activity-log.dto';

export class GetActivityLogsIntPipe extends StringToIntPipe<GetActivityLogsDto> {
  props: (keyof GetActivityLogsDto)[] = ['skip', 'take'];
}

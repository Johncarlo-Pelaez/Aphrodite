import { ApiProperty } from '@nestjs/swagger';

export class PaginatedResponse<T> {
  count: number;

  data: T[];
}

export class CreatedResponse {
  @ApiProperty()
  id: number;
}

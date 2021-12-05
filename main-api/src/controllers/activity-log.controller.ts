import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  ApiPaginatedResponse,
  PaginatedResponse,
  AzureADGuard,
} from 'src/core';
import { ActivityLog } from 'src/entities';
import { ActivityLogRepository } from 'src/repositories';
import { GetActivityLogsDto } from './activity-log.dto';
import { GetActivityLogsIntPipe } from './activity-log.pipe';

@Controller('/activity-logs')
@UseGuards(AzureADGuard)
export class ActivityLogController {
  constructor(private readonly activityLogRepository: ActivityLogRepository) {}

  @ApiPaginatedResponse(ActivityLog)
  @Get('/')
  async getActivityLogs(
    @Query(GetActivityLogsIntPipe) dto: GetActivityLogsDto,
  ): Promise<PaginatedResponse<ActivityLog>> {
    const response = new PaginatedResponse<ActivityLog>();
    const { skip, take, ...countParam } = dto;
    response.count = await this.activityLogRepository.getActivityLogsCount(
      countParam,
    );
    response.data = await this.activityLogRepository.getActivityLogs(dto);
    return response;
  }

  @ApiOkResponse({
    type: ActivityLog,
  })
  @Get('/:id')
  async getActivityLog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ActivityLog> {
    return await this.activityLogRepository.getActivityLog(id);
  }
}

import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  UseGuards,
  Res,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import {
  ApiPaginatedResponse,
  PaginatedResponse,
  AzureADGuard,
} from 'src/core';
import { ActivityLog } from 'src/entities';
import { ActivityLogRepository } from 'src/repositories';
import { ExcelService, ExcelRowItem } from 'src/excel-service';
import { FilenameUtil } from 'src/utils';
import {
  GetActivityLogsDto,
  DownloadActivityLogsDto,
} from './activity-log.dto';
import { GetActivityLogsIntPipe } from './activity-log.pipe';

@Controller('/activity-logs')
@UseGuards(AzureADGuard)
export class ActivityLogController {
  constructor(
    private readonly activityLogRepository: ActivityLogRepository,
    private readonly excelService: ExcelService,
    private readonly filenameUtil: FilenameUtil,
  ) {}

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

  @Get('/download')
  async downloadActivityLogs(
    @Query() dto: DownloadActivityLogsDto,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.activityLogRepository.getActivityLogs(dto);
    const excelFileBuffer = await this.excelService.create({
      columns: [
        {
          key: 'description',
          title: 'Description',
        },
        {
          key: 'loggedBy',
          title: 'Logged By',
        },
        {
          key: 'loggedAt',
          title: 'Logged Date',
        },
      ],
      rows: data.map((activityLog) =>
        Object.keys(activityLog).reduce((excelRowItem: ExcelRowItem[], key) => {
          if (key !== 'id' && key !== 'type') {
            excelRowItem.push({
              key,
              value: activityLog[key],
            });
          }
          return excelRowItem;
        }, []),
      ),
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=activity-logs-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
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

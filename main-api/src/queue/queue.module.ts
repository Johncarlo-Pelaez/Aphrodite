import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppConfigModule, AppConfigService } from 'src/app-config';
import { QueueService } from './queue.service';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (appConfigService: AppConfigService) => ({
        redis: {
          host: appConfigService.redisHost,
          port: appConfigService.redisPort,
        },
      }),
      inject: [AppConfigService],
    }),
    BullModule.registerQueue({
      name: 'document',
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from 'src/app-config';
import { SendReviewerNotificationParam } from './mail.params';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DatesUtil } from 'src/utils';
import { DocumentRepository, UserRepository } from 'src/repositories';
import { DocumentStatus, Role } from 'src/entities';
require('dotenv').config();

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly appConfigService: AppConfigService,
    private readonly datesUtil: DatesUtil,
    private readonly userRepository: UserRepository,
    private readonly documentRepository: DocumentRepository,
  ) {}
  private readonly logger = new Logger(MailService.name);

  async sendReviewerNotification(
    param: SendReviewerNotificationParam,
  ): Promise<void> {
    const today = new Date();
    const hour = today.getHours();
    let dayText = '';

    if (hour < 12) {
      dayText = 'morning';
    } else if (hour < 18) {
      dayText = 'afternoon';
    } else {
      dayText = 'evening';
    }

    await this.mailerService.sendMail({
      to: param.email,
      subject: 'RIS Email Notification',
      template: 'reviewer_notification',
      context: {
        name: param.name,
        day: dayText,
        documentsNumber: param.documentsNumber,
        url: `${this.appConfigService.domain}/auth`,
      },
    });
  }

  @Cron('0 15 14 * * 1-5', {
    name: 'email-notification',
    timeZone: 'Asia/Manila',
  })
  async handleCron() {
    const dateNow = this.datesUtil.getDateNow();
    this.logger.log(`Sending Email ${dateNow}`);

    const totalDocsForReview = await this.documentRepository.count({
      statuses: [DocumentStatus.DISAPPROVED],
    });

    for (const user of await this.userRepository.getUsers({
      roles: [Role.REVIEWER],
    })) {
      this.sendReviewerNotification({
        email: user.username,
        name: `${user.firstName} ${user.lastName}`,
        documentsNumber: totalDocsForReview,
      });
    }
  }
}

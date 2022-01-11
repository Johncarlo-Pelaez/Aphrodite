import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/app-config';
import { SendReviewerNotificationParam } from './mail.params';
require('dotenv').config();

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly appConfigService: AppConfigService,
  ) {}

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
        url: `${this.appConfigService.baseURL}/auth`,
      },
    });
  }
}

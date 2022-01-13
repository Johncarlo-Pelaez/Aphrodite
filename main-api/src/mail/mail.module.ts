import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AppConfigModule, AppConfigService } from '../app-config';
import { MailService } from './mail.service';
import { join } from 'path';

@Global()
@Module({
  imports: [
    AppConfigModule,
    MailerModule.forRootAsync({
      useFactory: (appConfigService: AppConfigService) => ({
        transport: {
          host: appConfigService.mailHost,
          port: appConfigService.mailPort,
          secure: false,
          auth: {
            user: appConfigService.mailUser,
            pass: appConfigService.mailPassword,
          },
        },
        defaults: {
          from: `"No Reply" <${
            appConfigService.mailFrom ?? appConfigService.mailUser
          }>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [AppConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

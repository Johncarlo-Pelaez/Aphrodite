import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AppConfigService } from 'src/app-config';
import { UploadDocToSpringParams } from './spring-cm.types';
import * as https from 'https';

@Injectable()
export class SpringCMService {
  private request: AxiosInstance;
  constructor(private readonly appConfigService: AppConfigService) {
    this.request = axios.create({
      baseURL: this.appConfigService.salesForceURl,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      httpsAgent: new https.Agent({
        keepAlive: true,
        timeout: 1000 * 60 * 60 * 1,
      }),
    });
  }

  async uploadDocToSpring(
    params: UploadDocToSpringParams,
  ): Promise<AxiosResponse> {
    return await this.request.post(
      `${this.appConfigService.uploadToSpringCM}`,
      { ...params },
    );
  }
}

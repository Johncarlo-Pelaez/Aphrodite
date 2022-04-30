import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AppConfigService } from 'src/app-config';
import { UploadDocToSpringParams } from './spring-cm.types';
import * as https from 'https';
import * as http from 'http';

@Injectable()
export class SpringCMService {
  private request: AxiosInstance;
  private options: AxiosRequestConfig;
  constructor(private readonly appConfigService: AppConfigService) {
    this.options = {
      baseURL: this.appConfigService.salesForceURl,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true, sessionTimeout: 30 * 60 * 1000 }),
      timeout: 30 * 60 * 1000,
      maxRedirects: 10,
      headers: {
        'Accept': 'application/json, text/plain, */*',
      },
    }
    this.request = axios.create(this.options);
  }

  async uploadDocToSpring(
    params: UploadDocToSpringParams,
  ): Promise<AxiosResponse> {

    this.request.interceptors.response.use(res => {
      if(res?.data) {
        return res;
      }
    }, error => {
      return Promise.reject(error);
    });

    return await this.request.post(`${this.appConfigService.uploadToSpringCM}`, { ...params })
  }
}

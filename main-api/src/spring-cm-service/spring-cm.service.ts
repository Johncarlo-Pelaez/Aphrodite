import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { AppConfigService } from 'src/app-config';
import { UploadDocToSpringParams } from './spring-cm.types';

@Injectable()
export class SpringCMService {
  private request: AxiosInstance;
  constructor(private readonly appConfigService: AppConfigService) {
    this.request = axios.create({
      baseURL: this.appConfigService.salesForceURl,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });
  }

  // Upload Document to SpringCM
  async uploadDocToSpring(
    params: UploadDocToSpringParams,
  ): Promise<AxiosResponse> {
    this.request.interceptors.response.use(res => {
      if(res?.data)
        return res;
    }, error => {
      return Promise.reject(error);
    })

    return await this.request.post(
      `${this.appConfigService.uploadToSpringCM}`,
      { ...params },
    );
  }
}

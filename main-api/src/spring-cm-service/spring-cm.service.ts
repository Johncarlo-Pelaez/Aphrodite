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
    });
  }

  async uploadDocToSpring(
    params: UploadDocToSpringParams,
  ): Promise<AxiosResponse> {
    const result = await this.request.post<AxiosResponse>(
      '/DataCapUploadDocToSpring',
      {
        data: {
          ...params,
        },
      },
    );
    return result.data;
  }
}

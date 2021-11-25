import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios';
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

  createCancelTokenSource(): CancelTokenSource {
    return axios.CancelToken.source();
  }

  cancelRequest(cancelTokenSource?: CancelTokenSource): void {
    cancelTokenSource?.cancel();
  }

  async uploadDocToSpring(
    params: UploadDocToSpringParams,
    cancelToken?: CancelTokenSource,
  ): Promise<AxiosResponse> {
    return await this.request.post(
      '/DataCapUploadDocToSpring',
      { ...params },
      { cancelToken: cancelToken?.token },
    );
  }
}

import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AppConfigService } from 'src/app-config';
import {
  GetContractDetailsParams,
  GetContractDetailsResult,
  GetDocumentTypeParams,
  GetDocumentTypeResult,
} from './sales-force.types';

@Injectable()
export class SalesForceService {
  private request: AxiosInstance;
  constructor(private readonly appConfigService: AppConfigService) {
    this.request = axios.create({
      baseURL: this.appConfigService.salesForceURl,
    });
  }

  // Get Contract Details From Sales Force
  async getContractDetails(
    params: GetContractDetailsParams,
  ): Promise<GetContractDetailsResult> {
    const result = await this.request.get<GetContractDetailsResult>(
      `${this.appConfigService.getContractDetails}`,
      {
        data: {
          ...params,
        },
      },
    );
    return result.data;
  }

  // Get Document Type from Sales Force
  async getDocumentType(
    params: GetDocumentTypeParams,
  ): Promise<GetDocumentTypeResult> {
    const result = await this.request.get<GetDocumentTypeResult>(
      `${this.appConfigService.getDocumentType}`,
      {
        data: {
          ...params,
        },
      },
    );
    return result.data;
  }
}

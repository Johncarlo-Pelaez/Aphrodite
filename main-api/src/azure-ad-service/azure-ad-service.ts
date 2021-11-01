import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { GetUserByIdResponse } from './azure-ad-service.types';

@Injectable()
export class AzureAdService {
  private readonly request: AxiosInstance;

  constructor() {
    this.request = axios.create({
      baseURL: 'https://graph.microsoft.com/v1.0',
    });
  }

  public async getUserById(
    accessToken: string,
    id: string,
  ): Promise<GetUserByIdResponse> {
    const res = await this.request.get<GetUserByIdResponse>(`/users/${id}`, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    });
    return res.data;
  }
}

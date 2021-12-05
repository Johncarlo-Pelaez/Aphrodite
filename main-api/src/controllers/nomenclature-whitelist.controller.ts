import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  AzureADGuard,
  GetAzureUser,
  AzureUser,
  CreatedResponse,
} from 'src/core';
import { NomenclatureWhitelist } from 'src/entities';
import {
  NomenclatureWhitelistRepository,
  ActivityLogRepository,
} from 'src/repositories';
import {
  CreateNomenclatureWhitelistDto,
  UpdateNomenclatureWhitelistDto,
} from './nomenclature-whitelist.dto';

@Controller('/nomenclatures/whitelist')
@UseGuards(AzureADGuard)
export class NomenclatureWhitelistController {
  constructor(
    private readonly nomenclatureWhitelistRepository: NomenclatureWhitelistRepository,
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  @ApiOkResponse({
    type: NomenclatureWhitelist,
    isArray: true,
  })
  @Get('/')
  async getWhitelistNomenclatures(): Promise<NomenclatureWhitelist[]> {
    return this.nomenclatureWhitelistRepository.getWhitelistNomenclatures();
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @Post('/')
  async createNomenclatureWhitelist(
    @GetAzureUser() azureUser: AzureUser,
    @Body(ValidationPipe) dto: CreateNomenclatureWhitelistDto,
  ): Promise<CreatedResponse> {
    const response = new CreatedResponse();
    response.id =
      await this.nomenclatureWhitelistRepository.createNomenclatureWhitelist({
        description: dto.description,
      });
    await this.activityLogRepository.insertCreateWhitelistLog({
      nomenclature: dto.description,
      createdBy: azureUser.preferred_username,
      createdAt: new Date(),
    });
    return response;
  }

  @ApiOkResponse()
  @Put('/:id')
  async updateNomenclatureWhitelist(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateNomenclatureWhitelistDto,
  ): Promise<void> {
    await this.nomenclatureWhitelistRepository.updateNomenclatureWhitelist({
      id,
      description: dto.description,
    });
    const whitelist =
      await this.nomenclatureWhitelistRepository.getNomenclatureWhitelist(id);
    await this.activityLogRepository.insertUpdateWhitelistLog({
      newNomenclature: dto.description,
      oldNomenclature: whitelist.description,
      updatedBy: azureUser.preferred_username,
      updatedAt: new Date(),
    });
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteNomenclatureWhitelist(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.nomenclatureWhitelistRepository.deleteNomenclatureWhitelist(id);
    const whitelist =
      await this.nomenclatureWhitelistRepository.getNomenclatureWhitelist(id);
    await this.activityLogRepository.insertDeleteWhitelistLog({
      nomenclature: whitelist.description,
      deletedBy: azureUser.preferred_username,
      deletedAt: new Date(),
    });
  }
}

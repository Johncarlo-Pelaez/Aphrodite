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
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { GetAzureUser, AzureUser, CreatedResponse, Auth } from 'src/core';
import { NomenclatureWhitelist, Role } from 'src/entities';
import {
  NomenclatureWhitelistRepository,
  ActivityLogRepository,
} from 'src/repositories';
import {
  CreateNomenclatureWhitelistDto,
  UpdateNomenclatureWhitelistDto,
} from './nomenclature-whitelist.dto';

@Auth(Role.ADMIN)
@Controller('/nomenclatures/whitelist')
export class NomenclatureWhitelistController {
  constructor(
    private readonly whitelistRepository: NomenclatureWhitelistRepository,
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  @ApiOkResponse({
    type: NomenclatureWhitelist,
    isArray: true,
  })
  @Get('/')
  async getWhitelistNomenclatures(): Promise<NomenclatureWhitelist[]> {
    return this.whitelistRepository.getWhitelistNomenclatures();
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
    response.id = await this.whitelistRepository.createNomenclatureWhitelist({
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
    const whitelist = await this.whitelistRepository.getNomenclatureWhitelist(
      id,
    );
    await this.whitelistRepository.updateNomenclatureWhitelist({
      id,
      description: dto.description,
    });
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
    const whitelist = await this.whitelistRepository.getNomenclatureWhitelist(
      id,
    );
    await this.whitelistRepository.deleteNomenclatureWhitelist(whitelist.id);
    await this.activityLogRepository.insertDeleteWhitelistLog({
      nomenclature: whitelist.description,
      deletedBy: azureUser.preferred_username,
      deletedAt: new Date(),
    });
  }
}

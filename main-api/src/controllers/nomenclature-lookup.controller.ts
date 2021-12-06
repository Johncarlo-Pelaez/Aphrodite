import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import {
  AzureADGuard,
  GetAzureUser,
  AzureUser,
  CreatedResponse,
} from 'src/core';
import { NomenclatureLookup } from 'src/entities';
import {
  NomenclatureLookupRepository,
  ActivityLogRepository,
} from 'src/repositories';
import {
  CreateNomenclatureLookupDto,
  UpdateNomenclatureLookupDto,
} from './nomenclature-lookup.dto';

@Controller('/nomenclatures/lookups')
@UseGuards(AzureADGuard)
export class NomenclatureLookupController {
  constructor(
    private readonly lookupRepository: NomenclatureLookupRepository,
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

  @ApiOkResponse({
    type: NomenclatureLookup,
    isArray: true,
  })
  @Get('/')
  async getNomenclaturelookups(): Promise<NomenclatureLookup[]> {
    return this.lookupRepository.getNomenclatureLookups();
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @Post('/')
  async createNomenclatureLookup(
    @GetAzureUser() azureUser: AzureUser,
    @Body(ValidationPipe) dto: CreateNomenclatureLookupDto,
  ): Promise<CreatedResponse> {
    const response = new CreatedResponse();
    response.id = await this.lookupRepository.createNomenclatureLookup({
      ...dto,
    });
    await this.activityLogRepository.insertCreateLookupLog({
      nomenclature: Object.values(dto).join(', '),
      createdBy: azureUser.preferred_username,
      createdAt: new Date(),
    });
    return response;
  }

  @ApiOkResponse()
  @Put('/:id')
  async updateNomenclatureLookup(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateNomenclatureLookupDto,
  ): Promise<void> {
    await this.lookupRepository.updateNomenclatureLookup({
      id,
      ...dto,
    });
    const lookup = await this.lookupRepository.getNomenclatureLookup(id);
    await this.activityLogRepository.insertUpdateLookupLog({
      newNomenclature: Object.values(dto).join(', '),
      oldNomenclature: `${lookup.nomenclature}, ${lookup.documentGroup}`,
      updatedBy: azureUser.preferred_username,
      updatedAt: new Date(),
    });
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteNomenclatureLookup(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const lookup = await this.lookupRepository.getNomenclatureLookup(id);
    await this.lookupRepository.deleteNomenclatureLookup(lookup.id);
    await this.activityLogRepository.insertDeleteLookupLog({
      nomenclature: lookup.nomenclature,
      deletedBy: azureUser.preferred_username,
      deletedAt: new Date(),
    });
  }
}

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
import { AzureADGuard, CreatedResponse } from 'src/core';
import { NomenclatureWhitelist } from 'src/entities';
import { NomenclatureWhitelistRepository } from 'src/repositories';
import { NomenClatureWhitelistDto } from './nomenclature-whitelist.dto';

@Controller('/nomenclatures/whitelist')
@UseGuards(AzureADGuard)
export class NomenclatureWhitelistController {
  constructor(
    private readonly nomenclatureWhitelistRepository: NomenclatureWhitelistRepository,
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
    @Body(ValidationPipe) dto: NomenClatureWhitelistDto,
  ): Promise<CreatedResponse> {
    const response = new CreatedResponse();
    response.id =
      await this.nomenclatureWhitelistRepository.createNomenclatureWhitelist({
        description: dto.description,
      });
    return response;
  }

  @ApiOkResponse()
  @Put('/:id')
  async updateNomenclatureWhitelist(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: NomenClatureWhitelistDto,
  ): Promise<void> {
    return await this.nomenclatureWhitelistRepository.updateNomenclatureWhitelist(
      {
        id,
        description: dto.description,
      },
    );
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteNomenclatureWhitelist(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.nomenclatureWhitelistRepository.deleteNomenclatureWhitelist(
      id,
    );
  }
}

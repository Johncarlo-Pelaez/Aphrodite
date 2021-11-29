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
import { AzureADGuard, CreatedResponse } from 'src/core';
import { NomenclatureLookup } from 'src/entities';
import { NomenclatureLookupRepository } from 'src/repositories';
import {
  CreateNomenclatureDto,
  UpdateNomenclatureDto,
} from './nomenclature-lookup.dto';

@Controller('/nomenclatures/lookups')
@UseGuards(AzureADGuard)
export class NomenclatureLookupController {
  constructor(
    private readonly nomenclatureLookupRepository: NomenclatureLookupRepository,
  ) {}

  @ApiOkResponse({
    type: NomenclatureLookup,
    isArray: true,
  })
  @Get('/')
  async getNomenclaturelookups(): Promise<NomenclatureLookup[]> {
    return this.nomenclatureLookupRepository.getNomenclatureLookups();
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @Post('/')
  async createNomenclatureLookup(
    @Body(ValidationPipe) dto: CreateNomenclatureDto,
  ): Promise<CreatedResponse> {
    const response = new CreatedResponse();
    response.id =
      await this.nomenclatureLookupRepository.createNomenclatureLookup({
        ...dto,
      });
    return response;
  }

  @ApiOkResponse()
  @Put('/:id')
  async updateNomenclatureLookup(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateNomenclatureDto,
  ): Promise<void> {
    return await this.nomenclatureLookupRepository.updateNomenclatureLookup({
      id,
      ...dto,
    });
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteNomenclatureLookup(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.nomenclatureLookupRepository.deleteNomenclatureLookup(id);
  }
}

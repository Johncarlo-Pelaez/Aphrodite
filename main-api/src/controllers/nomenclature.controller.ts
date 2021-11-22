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
import { Nomenclature } from 'src/entities';
import { NomenclatureRepository } from 'src/repositories';
import { NomenClatureDto } from './nomenclature.dto';

@Controller('/nomenclatures')
@UseGuards(AzureADGuard)
export class NomenclatureController {
  constructor(
    private readonly nomenclatureRepository: NomenclatureRepository,
  ) {}

  @ApiOkResponse({
    type: Nomenclature,
    isArray: true,
  })
  @Get('/')
  async getNomenclatures(): Promise<Nomenclature[]> {
    return this.nomenclatureRepository.getNomenclatures();
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @Post('/')
  async createNomenclature(
    @Body(ValidationPipe) dto: NomenClatureDto,
  ): Promise<CreatedResponse> {
    const response = new CreatedResponse();
    response.id = await this.nomenclatureRepository.createNomenclature({
      description: dto.description,
    });
    return response;
  }

  @ApiOkResponse()
  @Put('/:id')
  async updateNomenclature(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: NomenClatureDto,
  ): Promise<void> {
    return await this.nomenclatureRepository.updateNomenclature({
      id,
      description: dto.description,
    });
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteNomenclature(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return await this.nomenclatureRepository.deleteNomenclature(id);
  }
}

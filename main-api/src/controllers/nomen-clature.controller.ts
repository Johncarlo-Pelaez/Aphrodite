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
import { NomenClature } from 'src/entities';
import { NomenClatureRepository } from 'src/repositories';
import { NomenClatureDto } from './nomen-clature.dto';

@Controller('/nomen-clature')
@UseGuards(AzureADGuard)
export class NomenClatureController {
  constructor(
    private readonly nomenClatureRepository: NomenClatureRepository,
  ) {}

  @ApiOkResponse({
    type: NomenClature,
    isArray: true,
  })
  @Get('/')
  async getNomenClatures(): Promise<NomenClature[]> {
    return this.nomenClatureRepository.getNomenClatures();
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @Post('/')
  async createNomenClature(
    @Body(ValidationPipe) dto: NomenClatureDto,
  ): Promise<CreatedResponse> {
    const response = new CreatedResponse();
    response.id = await this.nomenClatureRepository.createNomenClature({
      description: dto.description,
    });
    return response;
  }

  @ApiOkResponse({
    type: NomenClature,
  })
  @Put('/:id')
  async updateNomenClature(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: NomenClatureDto,
  ): Promise<NomenClature> {
    return await this.nomenClatureRepository.updateNomenClature({
      id,
      description: dto.description,
    });
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteNomenClature(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.nomenClatureRepository.deleteNomenClature(id);
  }
}

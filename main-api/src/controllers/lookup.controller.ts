import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AzureADGuard } from 'src/core';
import { Lookup } from 'src/entities';
import { LookupRepository } from 'src/repositories';

@Controller('/lookups')
@UseGuards(AzureADGuard)
export class LookupController {
  constructor(private readonly lookupRepository: LookupRepository) {}

  @ApiOkResponse({
    type: Lookup,
    isArray: true,
  })
  @Get('/')
  async getlookups(): Promise<Lookup[]> {
    return this.lookupRepository.getLookups();
  }
}

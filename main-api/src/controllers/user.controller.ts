import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  ValidationPipe,
  Query,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import {
  AzureADGuard,
  AzureUser,
  CreatedResponse,
  GetAzureUser,
} from 'src/core';
import { User } from 'src/entities';
import { UserRepository } from 'src/repositories';
import {
  CreateUserAccountDto,
  UserIsExistDto,
  UpdateUserAccountDto,
} from './user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @ApiOkResponse({
    type: User,
    isArray: true,
  })
  @Get('/')
  @UseGuards(AzureADGuard)
  async getUsers(): Promise<User[]> {
    return await this.userRepository.getUsers();
  }

  @ApiOkResponse({
    type: Boolean,
  })
  @Get('/email-exist')
  async checkUserEmailIfExist(@Query() dto: UserIsExistDto): Promise<boolean> {
    return !!(await this.userRepository.getAuthUserByEmail(dto.email));
  }

  @ApiOkResponse({
    type: User,
  })
  @Get('/current')
  @UseGuards(AzureADGuard)
  async getCurrentUser(@GetAzureUser() azureUser: AzureUser): Promise<User> {
    return this.userRepository.getAuthUserByEmail(azureUser.preferred_username);
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @ApiConflictResponse({
    description: 'User already exist.',
  })
  @Post('/create')
  @UseGuards(AzureADGuard)
  async createUser(
    @Body(ValidationPipe) dto: CreateUserAccountDto,
  ): Promise<CreatedResponse> {
    const user = await this.userRepository.getUserByEmail(dto.email);
    if (user) throw new ConflictException();

    const response = new CreatedResponse();
    const rightNow = new Date();
    response.id = await this.userRepository.createUser({
      ...dto,
      createdDate: rightNow,
    });
    return response;
  }

  @ApiOkResponse()
  @Put('/:id')
  @UseGuards(AzureADGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateUserAccountDto,
  ): Promise<void> {
    const rightNow = new Date();
    return await this.userRepository.updateUser({
      id,
      ...dto,
      modifiedDate: rightNow,
    });
  }
}

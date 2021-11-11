import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  ValidationPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AzureAdService } from 'src/azure-ad-service';
import {
  AzureADGuard,
  AzureUser,
  CreatedResponse,
  GetAccessToken,
  GetAzureUser,
} from 'src/core';
import { Role, User } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { CreateUserAccountDto, UserIsExistDto } from './user.dto';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly azureAdService: AzureAdService,
  ) {}

  @ApiOkResponse({
    type: User,
    isArray: true,
  })
  @Get('/')
  @UseGuards(AzureADGuard)
  async getUsers(): Promise<User[]> {
    return this.userRepository.getUsers();
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
    description: 'There is already an admin user.',
  })
  @Post('/admin')
  async createAdminUser(
    @Body(ValidationPipe) dto: CreateUserAccountDto,
  ): Promise<CreatedResponse> {
    const user = await this.userRepository.getAuthUserByEmail(dto.email);
    const total = await this.userRepository.count([Role.ADMIN]);
    if (total > 0 || user) {
      throw new ConflictException();
    }

    const response = new CreatedResponse();
    const rightNow = new Date();

    response.id = await this.userRepository.createUser({
      ...dto,
      role: Role.ADMIN,
      createdDate: rightNow,
    });

    return response;
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @ApiConflictResponse({
    description: 'User already exist.',
  })
  @Post('/create')
  @UseGuards(AzureADGuard)
  async createEncoderUser(
    @Body(ValidationPipe) dto: CreateUserAccountDto,
    @GetAccessToken() accessToken: string,
  ): Promise<CreatedResponse> {
    const user = await this.userRepository.getAuthUserByEmail(dto.email);
    if (user) throw new ConflictException();

    const data = await this.azureAdService.getUserById(
      accessToken,
      dto.objectId,
    );

    const response = new CreatedResponse();
    const rightNow = new Date();

    response.id = await this.userRepository.createUser({
      email: data.userPrincipalName,
      firstName: data.givenName,
      lastName: data.surname,
      role: dto.role,
      createdDate: rightNow,
      isActive: dto.isActive,
    });

    return response;
  }
}

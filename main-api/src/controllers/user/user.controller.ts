import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
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
import { UserRepository, ActivityLogRepository } from 'src/repositories';
import {
  CreateUserAccountDto,
  UserIsExistDto,
  UpdateUserAccountDto,
} from './user.dto';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityLogRepository: ActivityLogRepository,
  ) {}

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
    @GetAzureUser() azureUser: AzureUser,
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
    await this.activityLogRepository.insertCreateUserLog({
      username: dto.email,
      createdBy: azureUser.preferred_username,
      createdAt: rightNow,
    });
    return response;
  }

  @ApiOkResponse()
  @Put('/:id')
  @UseGuards(AzureADGuard)
  async updateUser(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateUserAccountDto,
  ): Promise<void> {
    const rightNow = new Date();
    await this.userRepository.updateUser({
      id,
      ...dto,
      modifiedDate: rightNow,
    });
    const user = await this.userRepository.getUser(id);
    await this.activityLogRepository.insertUpdateUserLog({
      newUser: Object.values(dto).join(', '),
      oldUser: `${user.role}, ${user.firstName}, ${user.lastName}, ${user.isActive}`,
      updatedBy: azureUser.preferred_username,
      updatedAt: rightNow,
    });
  }

  @ApiOkResponse()
  @Delete('/:id')
  async deleteUser(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const user = await this.userRepository.getUser(id);
    await this.userRepository.deleteUser({
      id,
      modifiedDate: new Date(),
    });
    await this.activityLogRepository.insertDeleteUserLog({
      username: user.username,
      deletedBy: azureUser.preferred_username,
      deletedAt: new Date(),
    });
  }
}

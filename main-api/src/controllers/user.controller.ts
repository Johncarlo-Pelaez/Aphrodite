import {
  Body,
  ConflictException,
  Controller,
  Get,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreatedResponse, GetUserId } from 'src/core';
import { Role, User } from 'src/entities';
import { UserRepository } from 'src/repositories';
import { CreateAdminUserDto } from './user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  @ApiOkResponse({
    type: User,
    isArray: true,
  })
  @Get('/')
  async getUsers(): Promise<User[]> {
    return this.userRepository.getUsers();
  }

  @ApiOkResponse({
    type: User,
  })
  @Get('/current')
  async getCurrentUser(@GetUserId() id: number): Promise<User> {
    return this.userRepository.getUser(id);
  }

  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @ApiConflictResponse({
    description: 'There is already an admin user.',
  })
  @Post('/admin')
  async createAdminUser(
    @Body(ValidationPipe) dto: CreateAdminUserDto,
  ): Promise<CreatedResponse> {
    const total = await this.userRepository.count([Role.ADMIN]);
    if (total > 0) {
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
}

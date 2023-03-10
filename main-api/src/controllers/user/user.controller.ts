import {
  Body,
  ConflictException,
  NotAcceptableException,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  ValidationPipe,
  Query,
  Param,
  ParseIntPipe,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotAcceptableResponse,
} from '@nestjs/swagger';
import { Auth, AzureUser, CreatedResponse, GetAzureUser } from 'src/core';
import { User, Role } from 'src/entities';
import { UserRepository, ActivityLogRepository } from 'src/repositories';
import { ExcelService, ExcelColumn } from 'src/excel-service';
import { FilenameUtil } from 'src/utils';
import {
  CreateRootUserDto,
  GetUsersDto,
  CreateUserAccountDto,
  UserIsExistDto,
  UpdateUserAccountDto,
} from './user.dto';

/*
 * API Users
 */
@Controller('/users')
export class UserController {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly activityLogRepository: ActivityLogRepository,
    private readonly excelService: ExcelService,
    private readonly filenameUtil: FilenameUtil,
  ) {}

  // Check if Root User Exist
  @ApiOkResponse({
    type: Boolean,
  })
  @Get('/is-root-exist')
  async checkRootUserExist(): Promise<boolean> {
    return (await this.userRepository.count()) > 0;
  }

  // Get Users
  @Auth()
  @ApiOkResponse({
    type: User,
    isArray: true,
  })
  @Get('/')
  async getUsers(@Query() dto: GetUsersDto): Promise<User[]> {
    return await this.userRepository.getUsers(dto);
  }

  // Create Root User
  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @ApiConflictResponse({
    description: 'User already exist.',
  })
  @Post('/root')
  async createRootUser(
    @Body() dto: CreateRootUserDto,
  ): Promise<CreatedResponse> {
    const user = await this.userRepository.getUserByEmail(dto.email);
    if (user || (await this.checkRootUserExist()))
      throw new ConflictException('User already exist.');

    const response = new CreatedResponse();
    const rightNow = new Date();
    response.id = await this.userRepository.createUser({
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.ADMIN,
      createdDate: rightNow,
    });
    await this.activityLogRepository.insertCreateRootUserLog({
      username: dto.email,
      createdBy: 'RIS',
      createdAt: rightNow,
    });
    return response;
  }

  // Download Users Report
  @Auth(Role.ADMIN)
  @Get('/download')
  async downloadUsersReport(
    @Query() dto: GetUsersDto,
    @Res() res: Response,
  ): Promise<void> {
    const data = await this.userRepository.getUsers(dto);
    const columns: ExcelColumn<User>[] = [
      {
        key: 'createdDate',
        title: 'Date and Time',
        dataIndex: 'createdDate',
      },
      {
        key: 'username',
        title: 'Email Address',
        dataIndex: 'username',
      },
      {
        key: 'firstName',
        title: 'First Name',
        dataIndex: 'firstName',
      },
      {
        key: 'lastName',
        title: 'Last Name',
        dataIndex: 'lastName',
      },
      {
        key: 'role',
        title: 'Role',
        dataIndex: 'role',
      },
      {
        key: 'isActive',
        title: 'Status',
        render: (user) => (user.isActive ? 'Active' : 'Inactive'),
      },
    ];
    const excelFileBuffer = await this.excelService.create({
      columns,
      rows: data,
    });
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=users-report${this.filenameUtil.generateName()}`,
    );
    res.setHeader('Content-Length', excelFileBuffer.length);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.send(excelFileBuffer);
  }

  // Check if Email is Exist
  @ApiOkResponse({
    type: Boolean,
  })
  @Get('/email-exist')
  async checkUserEmailIfExist(@Query() dto: UserIsExistDto): Promise<boolean> {
    return !!(await this.userRepository.getAuthUserByEmail(dto.email));
  }

  // Get Current User Logged In
  @Auth()
  @ApiOkResponse({
    type: User,
  })
  @Get('/current')
  async getCurrentUser(@GetAzureUser() azureUser: AzureUser): Promise<User> {
    return this.userRepository.getAuthUserByEmail(azureUser.preferred_username);
  }

  // Create Regular User
  @Auth(Role.ADMIN)
  @ApiCreatedResponse({
    type: CreatedResponse,
  })
  @ApiConflictResponse({
    description: 'User already exist.',
  })
  @Post('/create')
  async createUser(
    @GetAzureUser() azureUser: AzureUser,
    @Body(ValidationPipe) dto: CreateUserAccountDto,
  ): Promise<CreatedResponse> {
    const user = await this.userRepository.getUserByEmail(dto.email);
    if (user) throw new ConflictException('User already exist.');

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

  // Update User
  @Auth(Role.ADMIN)
  @ApiOkResponse()
  @Put('/:id')
  async updateUser(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) dto: UpdateUserAccountDto,
  ): Promise<void> {
    const rightNow = new Date();
    const oldUser: string[] = [];
    const newUser: string[] = [];
    const user = await this.userRepository.getUser(id);

    Object.entries(dto).forEach(([key, value]) => {
      const oldValue = user[key];
      const newValue = value;
      if (newValue !== oldValue) {
        oldUser.push(
          key === 'isActive' ? (oldValue ? 'Active' : 'Inactive') : oldValue,
        );
        newUser.push(
          key === 'isActive' ? (newValue ? 'Active' : 'Inactive') : newValue,
        );
      }
    });

    await this.userRepository.updateUser({
      id,
      ...dto,
      modifiedDate: rightNow,
    });
    await this.activityLogRepository.insertUpdateUserLog({
      newUser: Object.values(newUser).join(', '),
      oldUser: Object.values(oldUser).join(', '),
      updatedBy: azureUser.preferred_username,
      updatedAt: rightNow,
    });
  }

  // Delete User
  @Auth(Role.ADMIN)
  @ApiNotAcceptableResponse()
  @ApiOkResponse()
  @Delete('/:id')
  async deleteUser(
    @GetAzureUser() azureUser: AzureUser,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const user = await this.userRepository.getUser(id);

    if (
      (await this.userRepository.count([Role.ADMIN])) <= 1 &&
      user.role === Role.ADMIN
    )
      throw new NotAcceptableException();

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

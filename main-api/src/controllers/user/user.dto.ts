import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';
import { Role } from 'src/entities';

export class CreateUserAccountDto {
  @ApiProperty({
    format: 'email',
  })
  @IsNotEmpty({ message: 'Email is required.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Object ID is required.' })
  @IsString()
  objectId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Role is required.' })
  @IsString()
  role: Role;

  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required.' })
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString()
  lastName: string;
}

export class UpdateUserAccountDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Role is required.' })
  @IsString()
  role: Role;

  @ApiProperty()
  @IsNotEmpty({ message: 'First name is required.' })
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Last name is required.' })
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UserIsExistDto {
  @ApiProperty({
    format: 'email',
  })
  @IsString()
  @IsEmail({}, { message: 'Email is invalid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email: string;
}

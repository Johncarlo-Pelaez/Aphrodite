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
  @IsString()
  @IsEmail({}, { message: 'Email is invalid.' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Object ID is required.' })
  objectId: string;

  @ApiProperty()
  @IsString()
  role: Role;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
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

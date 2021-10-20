import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateUserAccountDto {
  @ApiProperty({
    format: 'email',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  lastName: string;
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

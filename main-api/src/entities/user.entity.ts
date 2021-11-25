import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  ENCODER = 'ENCODER',
  REVIEWER = 'REVIEWER',
}

@Entity()
export class User {
  @ApiProperty()
  id: number;

  @ApiProperty({
    format: 'email',
  })
  @PrimaryColumn()
  username: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty({
    enum: Role,
  })
  @Column({ enum: Role })
  role: Role;

  @ApiProperty()
  @Column()
  createdDate: Date;

  @ApiProperty()
  @Column()
  isActive: boolean;

  @ApiProperty()
  @Column()
  isDeleted: boolean;

  @ApiProperty()
  @Column()
  modifiedDate: Date;
}

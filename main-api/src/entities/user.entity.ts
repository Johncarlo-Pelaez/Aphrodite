import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  ENCODER = 'ENCODER',
  REVIEWER = 'REVIEWER',
}

@Entity()
export class User {
  @ApiProperty()
  @Generated('increment')
  @Column()
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
  modifiedDate: Date;

  @ApiProperty()
  @Column()
  objectId: string;

  @ApiProperty()
  @Column()
  isDeleted: boolean;
}

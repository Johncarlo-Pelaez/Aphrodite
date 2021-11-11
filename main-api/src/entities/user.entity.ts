import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  ADMIN = 'ADMIN',
  ENCODER = 'ENCODER',
  REVIEWER = 'REVIEWER',
}

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    format: 'email',
  })
  @Column()
  email: string;

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
}

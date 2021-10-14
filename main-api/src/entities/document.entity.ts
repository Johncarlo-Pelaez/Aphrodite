import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ format: 'uuid' })
  @Column({ type: 'uniqueidentifier' })
  uuid: string;

  @ApiProperty()
  @Column()
  documentName: string;

  @ApiProperty({
    description: 'In bytes',
  })
  @Column()
  documentSize: number;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  modifiedDate: Date;

  @ApiProperty()
  @Column()
  modifiedBy: number;

  @ApiProperty()
  @Column()
  status: string;

  @ApiProperty()
  @Column()
  qrCode: string;

  @ApiProperty()
  @Column()
  qrAt: Date;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @ManyToOne(() => User, (e) => e.id)
  user: User;
}

@Entity()
export class DocumentHistory {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({
    description: 'In bytes',
  })
  @Column()
  documentSize: number;

  @ApiProperty()
  @Column()
  createdDate: Date;

  @ApiProperty()
  @Column()
  documentId: number;

  @ApiProperty()
  @ManyToOne(() => Document, (e) => e.id)
  document: Document;

  @ApiProperty()
  @Column()
  userId: number;

  @ApiProperty()
  @ManyToOne(() => User, (e) => e.id)
  user: User;
}

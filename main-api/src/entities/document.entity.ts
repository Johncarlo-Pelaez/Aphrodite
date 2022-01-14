import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { DocumentStatus } from './document.enum';
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
  mimeType: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  modifiedDate: Date;

  @ApiProperty()
  @Column()
  modifiedBy: string;

  @ApiProperty({
    enum: DocumentStatus,
  })
  @Column({ enum: DocumentStatus })
  status: DocumentStatus;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  qrCode?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  qrAt?: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  documentType?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  contractDetails?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  springResponse?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  remarks?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  docTypeReqParams?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  contractDetailsReqParams?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  springcmReqParams?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  documentDate?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  encoder?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  encodedAt?: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  encodeValues?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  checker?: string;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  checkedAt?: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  approver?: string;

  @ApiProperty()
  @Column()
  userUsername: string;

  @ApiProperty()
  @Column()
  isFileDeleted: boolean;

  @ApiProperty()
  @Column()
  pageTotal: number;

  @OneToMany(
    () => DocumentHistory,
    (documentHistory) => documentHistory.document,
  )
  documentHistories: DocumentHistory[];

  @ApiProperty()
  @ManyToOne(() => User, (e) => e.username)
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
  @ManyToOne(() => Document, (document) => document.documentHistories)
  document: Document;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  userUsername: string;

  @ApiPropertyOptional({
    enum: DocumentStatus,
  })
  @Column({ enum: DocumentStatus, nullable: true })
  documentStatus?: DocumentStatus;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  note?: string;

  @ApiProperty()
  @Column()
  filename?: string;

  @ApiProperty()
  @Column()
  mimeType: string;

  @ApiProperty()
  @Column()
  pageTotal: number;
}

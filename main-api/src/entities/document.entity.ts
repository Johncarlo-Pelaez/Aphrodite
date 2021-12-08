import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  qrCode?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  qrAt?: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  documentType?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  contractDetails?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  springResponse?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  remarks?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  docTypeReqParams?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  contractDetailsReqParams?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  springcmReqParams?: string;

  @ApiProperty()
  @Column({ nullable: true })
  documentDate?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  encoder?: string;

  @ApiProperty()
  @Column({ nullable: true })
  encodedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  encodeValues?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  checker?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  checkedAt?: Date;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  approver?: string;

  @ApiProperty()
  @Column()
  userUsername: string;

  @ApiProperty()
  @Column()
  isFileDeleted: boolean;

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
  @ManyToOne(() => Document, (e) => e.id)
  document: Document;

  @ApiProperty()
  @Column()
  userUsername: string;

  @ApiProperty({
    enum: DocumentStatus,
    required: false,
  })
  @Column({ enum: DocumentStatus, nullable: true })
  documentStatus?: DocumentStatus;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  salesforceResponse?: string;

  @ApiProperty({ required: false })
  @Column({ nullable: true })
  springcmResponse?: string;
}

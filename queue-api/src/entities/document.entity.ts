import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uniqueidentifier' })
  uuid: string;

  @Column()
  documentName: string;

  @Column()
  documentSize: number;

  @Column()
  description: string;

  @Column()
  modifiedDate: Date;

  @Column()
  userId: number;

  @ManyToOne(() => User, (e) => e.id)
  user: User;
}

@Entity()
export class DocumentHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  description: string;

  @Column()
  documentSize: number;

  @Column()
  createdDate: Date;

  @Column()
  documentId: number;

  @ManyToOne(() => Document, (e) => e.id)
  document: Document;

  @Column()
  userId: number;

  @ManyToOne(() => User, (e) => e.id)
  user: User;
}

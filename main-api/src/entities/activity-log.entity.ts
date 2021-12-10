import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityLogType } from './activity-log.enum';

@Entity()
export class ActivityLog {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    enum: ActivityLogType,
  })
  @Column({ enum: ActivityLogType })
  type: ActivityLogType;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  loggedAt: Date;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  loggedBy?: string;
}

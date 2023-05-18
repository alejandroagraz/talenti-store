import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsDate, IsString } from 'class-validator';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  id: string;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @IsDate()
  public created_at: Date;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  @IsDate()
  public updated_at: Date;
}

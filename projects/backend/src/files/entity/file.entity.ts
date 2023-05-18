import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column } from 'typeorm';
import { IsInt, IsString } from 'class-validator';

@Entity({ name: 'files' })
export class FileEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: true, width: 100 })
  @IsString()
  url: string;

  @Column({ type: 'varchar', nullable: true, length: 60 })
  @IsString()
  key: string;
}

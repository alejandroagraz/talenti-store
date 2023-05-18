import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, BeforeInsert, OneToOne, JoinColumn } from 'typeorm';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { FileEntity } from '../../files/entity/file.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  firstname: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  lastname: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  username: string;

  @Column({ type: 'int', width: 12 })
  @IsInt()
  dni: number;

  @Column({ type: 'varchar', nullable: true, unique: true, length: 60 })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @Column({ select: false })
  @IsString()
  password: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  @IsString()
  phone: string;

  @Column({ type: 'boolean', nullable: true })
  @IsBoolean()
  state: boolean;

  @OneToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  avatar?: FileEntity;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}

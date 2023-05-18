import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { CategoryEntity } from '../../categories/entity/category.entity';

@Entity({ name: 'stores' })
export class StoreEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: true, unique: true, length: 50 })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  @IsString()
  phone: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  @IsString()
  address: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  city: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  @IsString()
  zip_code: string;

  @Column({ type: 'boolean', nullable: true })
  @IsBoolean()
  state: boolean;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => CategoryEntity, (categoty: CategoryEntity) => categoty.store)
  categories: CategoryEntity[];
}

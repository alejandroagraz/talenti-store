import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, OneToMany, BeforeInsert } from 'typeorm';
import { ProductEntity } from '../../products/entity/product.entity';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

@Entity({ name: 'product_providers' })
export class ProductProviderEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  @IsString()
  address: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  @IsString()
  phone: string;

  @Column({ type: 'boolean', nullable: true })
  @IsBoolean()
  state: boolean;

  @Column({ type: 'varchar', nullable: true, unique: true, length: 60 })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.provider)
  products: ProductEntity[];
}

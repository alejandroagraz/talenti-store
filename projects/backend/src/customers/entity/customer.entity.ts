import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, BeforeInsert, OneToMany } from 'typeorm';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { DeliveriesEntity } from '../../deliveries/entity/deliveries.entity';

@Entity({ name: 'customers' })
export class CustomerEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 30 })
  @IsString()
  phone: string;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  @IsString()
  address: string;

  @Column({ type: 'int', width: 12 })
  @IsInt()
  dni: number;

  @Column({ type: 'varchar', nullable: true, unique: true, length: 60 })
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @OneToMany(
    () => DeliveriesEntity,
    (deliveries: DeliveriesEntity) => deliveries.customer,
  )
  deliveries: DeliveriesEntity[];
}

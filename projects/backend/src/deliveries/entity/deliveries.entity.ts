import { Entity, Column, ManyToOne } from 'typeorm';
import { CustomerEntity } from '../../customers/entity/customer.entity';
import { AbstractEntity } from '../../common/entities/abstract.entity';
import { ProductEntity } from '../../products/entity/product.entity';
import { IsInt, IsString } from 'class-validator';

@Entity({ name: 'deliveries' })
export class DeliveriesEntity extends AbstractEntity {
  @Column({ type: 'int', width: 10 })
  @IsInt()
  amount: number;

  @Column({ type: 'varchar', nullable: true, length: 100 })
  @IsString()
  delivery_address: string;

  @Column({ type: 'varchar', nullable: true, length: 20 })
  @IsString()
  delivery_state: string;

  @ManyToOne(
    () => CustomerEntity,
    (customer: CustomerEntity) => customer.deliveries,
    {
      onDelete: 'CASCADE',
    },
  )
  customer: CustomerEntity;

  @ManyToOne(
    () => ProductEntity,
    (product: ProductEntity) => product.deliveries,
    {
      onDelete: 'CASCADE',
    },
  )
  product: ProductEntity;
}

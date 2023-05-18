import { AbstractEntity } from '../../common/entities/abstract.entity';
import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CategoryEntity } from '../../categories/entity/category.entity';
import { ProductProviderEntity } from '../../product-providers/entity/product-provider.entity';
import { DeliveriesEntity } from '../../deliveries/entity/deliveries.entity';
import { IsBoolean, IsInt, IsString } from 'class-validator';
import { FileEntity } from '../../files/entity/file.entity';

@Entity({ name: 'products' })
export class ProductEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  @IsString()
  description: string;

  @Column({ type: 'varchar', nullable: true, length: 10 })
  @IsString()
  price: string;

  @Column({ type: 'int', width: 10 })
  @IsInt()
  stock: number;

  @Column({ type: 'boolean', nullable: true })
  @IsBoolean()
  state: boolean;

  @ManyToOne(
    () => CategoryEntity,
    (category: CategoryEntity) => category.products,
    {
      onDelete: 'CASCADE',
    },
  )
  category: CategoryEntity;

  @ManyToOne(
    () => ProductProviderEntity,
    (provider: ProductProviderEntity) => provider.products,
    {
      onDelete: 'CASCADE',
    },
  )
  provider: ProductProviderEntity;

  @OneToMany(
    () => DeliveriesEntity,
    (deliveries: DeliveriesEntity) => deliveries.product,
  )
  deliveries: DeliveriesEntity[];

  @OneToOne(() => FileEntity, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  avatar?: FileEntity;
}

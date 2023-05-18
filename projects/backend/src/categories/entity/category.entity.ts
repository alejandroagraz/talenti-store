import { AbstractEntity } from '../../common/entities/abstract.entity';
import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { ProductEntity } from '../../products/entity/product.entity';
import { StoreEntity } from '../../stores/entity/store.entity';
import { IsBoolean, IsString } from 'class-validator';

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 50 })
  @IsString()
  name: string;

  @Column({ type: 'varchar', nullable: true, length: 500 })
  @IsString()
  description: string;

  @Column({ type: 'boolean', nullable: true })
  @IsBoolean()
  state: boolean;

  @ManyToOne(() => StoreEntity, (store: StoreEntity) => store.categories, {
    onDelete: 'CASCADE',
  })
  store: StoreEntity;

  @OneToMany(() => ProductEntity, (product: ProductEntity) => product.category)
  products: ProductEntity[];
}

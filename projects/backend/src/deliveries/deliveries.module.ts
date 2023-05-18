import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveriesEntity } from './entity/deliveries.entity';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { CustomerEntity } from '../customers/entity/customer.entity';
import { ProductEntity } from '../products/entity/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { ProductProvidersService } from '../product-providers/product-providers.service';
import { StoresService } from '../stores/stores.service';
import { CategoryEntity } from '../categories/entity/category.entity';
import { ProductProviderEntity } from '../product-providers/entity/product-provider.entity';
import { StoreEntity } from '../stores/entity/store.entity';
import { FilesService } from '../files/files.service';
import { FileEntity } from '../files/entity/file.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveriesEntity,
      CustomerEntity,
      ProductEntity,
      CategoryEntity,
      ProductProviderEntity,
      StoreEntity,
      FileEntity,
    ]),
  ],
  providers: [
    DeliveriesService,
    CustomersService,
    ProductsService,
    CategoriesService,
    ProductProvidersService,
    StoresService,
    FilesService,
  ],
  controllers: [DeliveriesController],
})
export class DeliveriesModule {}

import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { CategoriesService } from '../categories/categories.service';
import { ProductProvidersService } from '../product-providers/product-providers.service';
import { CategoryEntity } from '../categories/entity/category.entity';
import { ProductProviderEntity } from '../product-providers/entity/product-provider.entity';
import { StoresService } from '../stores/stores.service';
import { StoreEntity } from '../stores/entity/store.entity';
import { FileEntity } from '../files/entity/file.entity';
import { FilesService } from '../files/files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
      CategoryEntity,
      ProductProviderEntity,
      StoreEntity,
      FileEntity,
    ]),
  ],
  providers: [
    ProductsService,
    CategoriesService,
    ProductProvidersService,
    StoresService,
    FilesService,
  ],
  controllers: [ProductsController],
})
export class ProductsModule {}

import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entity/category.entity';
import { StoresService } from '../stores/stores.service';
import { StoreEntity } from '../stores/entity/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, StoreEntity])],
  providers: [CategoriesService, StoresService],
  controllers: [CategoriesController],
})
export class CategoriesModule {}

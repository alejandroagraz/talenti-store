import { Module } from '@nestjs/common';
import { ProductProvidersController } from './product-providers.controller';
import { ProductProvidersService } from './product-providers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductProviderEntity } from './entity/product-provider.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductProviderEntity])],
  controllers: [ProductProvidersController],
  providers: [ProductProvidersService],
})
export class ProductProvidersModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';
import { StoresModule } from './stores/stores.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { CustomersModule } from './customers/customers.module';
import { ProductProvidersModule } from './product-providers/product-providers.module';
import DatabaseModule from './database/database.module';

@Module({
  imports: [
    AuthsModule,
    UsersModule,
    StoresModule,
    CategoriesModule,
    ProductsModule,
    DeliveriesModule,
    CustomersModule,
    ProductProvidersModule,
    DatabaseModule,
  ],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}

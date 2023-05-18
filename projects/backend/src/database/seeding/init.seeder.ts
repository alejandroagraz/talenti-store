import { DataSource } from 'typeorm';
import { runSeeders, Seeder, SeederFactoryManager } from 'typeorm-extension';
import userFactory from './factories/user.factory';
import storeFactory from './factories/store.factory';
import productProviderFactory from './factories/product-provider.factory';
import categoryFactory from './factories/category.factory';
import productFactory from './factories/product.factory';
import customerFactory from './factories/customer.factory';
import deliveryFactory from './factories/delivey.factory';
import UserSeeder from './seeds/user.seeder';
import StoreSeeder from './seeds/store.seeder';
import CategorySeeder from './seeds/category.seeder';
import ProductProviderSeeder from './seeds/product-provider.seeder';
import ProductSeeder from './seeds/product.seeder';
import CustomerSeeder from './seeds/customer.seeder';
import DeliverySeeder from './seeds/delivery.seeder';

export default class InitSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    await runSeeders(dataSource, {
      seeds: [
        UserSeeder,
        StoreSeeder,
        ProductProviderSeeder,
        CategorySeeder,
        ProductSeeder,
        CustomerSeeder,
        DeliverySeeder,
      ],
      factories: [
        userFactory,
        storeFactory,
        productProviderFactory,
        categoryFactory,
        productFactory,
        customerFactory,
        deliveryFactory,
      ],
    });
  }
}

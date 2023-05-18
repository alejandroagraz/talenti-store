import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ProductProviderEntity } from '../../../product-providers/entity/product-provider.entity';

export default class ProductProviderSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(ProductProviderEntity);
    await userFactory.save();
    await userFactory.saveMany(10);
  }
}

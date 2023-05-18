import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CustomerEntity } from '../../../customers/entity/customer.entity';

export default class CustomerSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(CustomerEntity);
    await userFactory.save();
    await userFactory.saveMany(10);
  }
}

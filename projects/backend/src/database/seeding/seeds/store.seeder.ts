import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { StoreEntity } from '../../../stores/entity/store.entity';

export default class StoreSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userFactory = await factoryManager.get(StoreEntity);
    await userFactory.save();
    await userFactory.saveMany(10);
  }
}

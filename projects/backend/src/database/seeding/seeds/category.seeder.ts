import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CategoryEntity } from '../../../categories/entity/category.entity';
import { StoreEntity } from '../../../stores/entity/store.entity';

export default class CategorySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const stores = await dataSource.getRepository(StoreEntity).find({
      where: {
        state: true,
      },
    });

    if (stores.length > 0) {
      for (let i = 0; i < stores.length; i++) {
        const store = stores[i];
        const categoryFactory = factoryManager.get(CategoryEntity);
        await categoryFactory.save({ store });
      }
    }
  }
}

import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CategoryEntity } from '../../../categories/entity/category.entity';
import { ProductEntity } from '../../../products/entity/product.entity';
import { ProductProviderEntity } from '../../../product-providers/entity/product-provider.entity';

export default class ProductSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const categories = await dataSource.getRepository(CategoryEntity).find({
      where: {
        state: true,
      },
    });
    const providers = await dataSource
      .getRepository(ProductProviderEntity)
      .find({
        where: {
          state: true,
        },
      });

    if (categories.length > 0 && providers.length > 0) {
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const randomProvider = Math.random() * providers.length;
        const provider = providers[parseInt(String(randomProvider))];
        const categoryFactory = factoryManager.get(ProductEntity);
        await categoryFactory.save({ category, provider });
      }
    }
  }
}

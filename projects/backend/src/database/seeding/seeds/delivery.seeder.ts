import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ProductEntity } from '../../../products/entity/product.entity';
import { CustomerEntity } from '../../../customers/entity/customer.entity';
import { DeliveriesEntity } from '../../../deliveries/entity/deliveries.entity';

export default class DeliverySeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const customers = await dataSource.getRepository(CustomerEntity).find();
    const products = await dataSource
      .getRepository(ProductEntity)
      .createQueryBuilder('product')
      .where('product.state = :state', { state: true })
      .andWhere('product.stock > :amount', { amount: 0 })
      .getMany();

    if (products.length > 0 && customers.length > 0) {
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const randomPCustomer = Math.random() * customers.length;
        const customer = customers[parseInt(String(randomPCustomer))];
        const categoryFactory = factoryManager.get(DeliveriesEntity);
        const resp = await categoryFactory.save({ product, customer });
        const updateStock = product.stock - resp.amount;
        await dataSource
          .createQueryBuilder()
          .update(ProductEntity)
          .set({ stock: updateStock })
          .where('id = :id', { id: product.id, updateStock: updateStock })
          .execute();
      }
    }
  }
}

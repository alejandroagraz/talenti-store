import { setSeederFactory } from 'typeorm-extension';
import { ProductEntity } from '../../../products/entity/product.entity';

export default setSeederFactory(ProductEntity, async (faker) => {
  const product = new ProductEntity();

  product.name = faker.commerce.productName();
  product.description = faker.commerce.productDescription();
  product.price = faker.commerce.price();
  product.stock = faker.datatype.number({ min: 100, max: 1000 });
  product.state = true;
  return product;
});

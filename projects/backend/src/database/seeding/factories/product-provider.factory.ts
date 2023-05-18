import { setSeederFactory } from 'typeorm-extension';
import { ProductProviderEntity } from '../../../product-providers/entity/product-provider.entity';

export default setSeederFactory(ProductProviderEntity, async (faker) => {
  const provider = new ProductProviderEntity();

  provider.name = faker.company.name();
  provider.address = faker.address.streetAddress();
  provider.phone = faker.phone.number();
  provider.email = faker.internet.email(provider.name);
  provider.state = faker.datatype.boolean();
  return provider;
});

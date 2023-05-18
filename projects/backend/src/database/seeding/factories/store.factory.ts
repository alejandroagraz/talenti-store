import { setSeederFactory } from 'typeorm-extension';
import { StoreEntity } from '../../../stores/entity/store.entity';

export default setSeederFactory(StoreEntity, async (faker) => {
  const store = new StoreEntity();

  store.name = faker.company.name();
  store.email = faker.internet.email(store.name);
  store.phone = faker.phone.number();
  store.address = faker.address.streetAddress();
  store.city = faker.address.city();
  store.zip_code = faker.address.zipCode();
  store.state = faker.datatype.boolean();
  return store;
});

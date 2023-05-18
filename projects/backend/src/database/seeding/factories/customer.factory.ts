import { setSeederFactory } from 'typeorm-extension';
import { CustomerEntity } from '../../../customers/entity/customer.entity';

export default setSeederFactory(CustomerEntity, async (faker) => {
  const customer = new CustomerEntity();

  customer.name = faker.name.firstName();
  customer.dni = parseInt(faker.finance.account(8));
  customer.email = faker.internet.email(customer.name);
  customer.phone = faker.phone.number();
  customer.address = faker.address.streetAddress();
  return customer;
});

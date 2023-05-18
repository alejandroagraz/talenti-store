import { setSeederFactory } from 'typeorm-extension';
import { DeliveriesEntity } from '../../../deliveries/entity/deliveries.entity';
import { State } from '../../../common/constants/state.constant';

export default setSeederFactory(DeliveriesEntity, async (faker) => {
  const delivery = new DeliveriesEntity();

  delivery.amount = faker.datatype.number({ min: 1, max: 10 });
  delivery.delivery_address = faker.address.streetAddress();
  delivery.delivery_state = State.PENDING;
  return delivery;
});

import { setSeederFactory } from 'typeorm-extension';
import { CategoryEntity } from '../../../categories/entity/category.entity';

export default setSeederFactory(CategoryEntity, async (faker) => {
  const category = new CategoryEntity();

  category.name = faker.commerce.department();
  category.description = faker.lorem.paragraph(3);
  category.state = faker.datatype.boolean();
  return category;
});

import { hash } from 'bcrypt';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity } from '../../../users/entity/user.entity';

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);

    const data = {
      firstname: 'Jose',
      lastname: 'Agraz',
      username: 'admin',
      dni: 12345678,
      email: 'joseagraz29@gmail.com',
      phone: '+584127440921',
      state: true,
      password: await hash('admin', 10),
    };

    const user = await repository.findOneBy({ username: data.username });

    if (!user) {
      await repository.insert([data]);
    }

    const userFactory = await factoryManager.get(UserEntity);
    await userFactory.save();
    await userFactory.saveMany(10);
  }
}

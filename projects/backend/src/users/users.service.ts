import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { UserDto } from './dto/user.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { FilesService } from '../files/files.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly filesService: FilesService,
  ) {}

  async getUsers(pageOptionsDto: PageOptionsDto): Promise<PageDto<UserEntity>> {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    queryBuilder
      .orderBy('users.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('users')
      .leftJoinAndSelect('users.avatar', 'avatar')
      .where('users.id = :id', { id: id })
      .getOne();

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(data: CreateUserInput): Promise<UserDto> {

    const isUSer: UserEntity = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.state = :state', { state: true })
        .andWhere(
            new Brackets((qb) => {
              qb.where('user.email = :email', {
                email: data.email,
              });
              qb.orWhere('user.username = :username', {
                username: data.username,
              });
            }),
        )
        .getOne();

    if (isUSer)
      throw new HttpException('username or email already exist', HttpStatus.NOT_IMPLEMENTED);

    const createUser = new UserEntity();

    createUser.firstname = data.firstname;
    createUser.lastname = data.lastname;
    createUser.username = data.username;
    createUser.dni = data.dni;
    createUser.email = data.email;
    createUser.password = await hash(data.password, 10);
    createUser.phone = data.phone;
    createUser.state = data.state;

    try {
      return await this.userRepository.save(createUser);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserDto> {
    const date: Date = new Date();
    const updateUser = await this.findOneByID(id);

    if (!updateUser) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    updateUser.firstname = data.firstname || updateUser.firstname;
    updateUser.lastname = data.lastname || updateUser.lastname;
    updateUser.username = data.username || updateUser.username;
    updateUser.dni = data.dni || updateUser.dni;
    updateUser.email = data.email || updateUser.email;
    updateUser.phone = data.phone || updateUser.phone;
    updateUser.state = data.state || updateUser.state;
    updateUser.updated_at = date;

    try {
      return await this.userRepository.save(updateUser);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async addAvatar(id: string, imageBuffer: Buffer, filename: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (user.avatar) {
      await this.userRepository.update(id, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(user.avatar.id);
    }

    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );

    await this.userRepository.update(id, {
      ...user,
      avatar,
    });
    return avatar;
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      return await this.userRepository
        .createQueryBuilder('users')
        .delete()
        .from(UserEntity)
        .where('users.id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: id })
      .getOne();
  }

  async findOneUser(username: string): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.state = :state', { state: true })
      .andWhere(
        new Brackets((qb) => {
          qb.where('user.email = :email', {
            email: username,
          });
          qb.orWhere('user.username = :username', {
            username: username,
          });
        }),
      )
      .getOne();
  }
}

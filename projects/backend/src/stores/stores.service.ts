import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreEntity } from './entity/store.entity';
import { StoreDto } from './dto/store.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { CreateStoreInput } from './inputs/create-store.input';
import { UpdateStoreInput } from './inputs/update-store.input';
import { DetailStoreDto } from './dto/detail-store.dto';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(StoreEntity)
    private readonly storeRepository: Repository<StoreEntity>,
  ) {}

  async getStores(pageOptionsDto: PageOptionsDto): Promise<PageDto<StoreDto>> {
    const queryBuilder = this.storeRepository.createQueryBuilder('stores');

    queryBuilder
      .orderBy('stores.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailStoreDto> {
    return await this.storeRepository
      .createQueryBuilder('stores')
      .leftJoinAndSelect('stores.categories', 'categories')
      .where('stores.id = :id', { id: id })
      .getOne();
  }

  async createStore(data: CreateStoreInput): Promise<StoreDto> {
    const createStore = new StoreEntity();
    createStore.name = data.name;
    createStore.email = data.email;
    createStore.phone = data.phone;
    createStore.address = data.address;
    createStore.city = data.city;
    createStore.zip_code = data.zip_code;
    createStore.state = data.state;
    try {
      return await this.storeRepository.save(createStore);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateStore(id: string, data: UpdateStoreInput): Promise<StoreDto> {
    const date: Date = new Date();
    const updateStore = await this.findOneByID(id);

    if (!updateStore) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    updateStore.name = data.name || updateStore.name;
    updateStore.email = data.email || updateStore.email;
    updateStore.phone = data.phone || updateStore.phone;
    updateStore.address = data.address || updateStore.address;
    updateStore.city = data.city || updateStore.city;
    updateStore.zip_code = data.zip_code || updateStore.zip_code;
    updateStore.state = data.state || updateStore.state;
    updateStore.updated_at = date;

    try {
      return await this.storeRepository.save(updateStore);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      return await this.storeRepository
        .createQueryBuilder('stores')
        .delete()
        .from(StoreEntity)
        .where('stores.id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<StoreEntity> {
    return await this.storeRepository
      .createQueryBuilder('stores')
      .where('stores.id = :id', { id: id })
      .getOne();
  }
}

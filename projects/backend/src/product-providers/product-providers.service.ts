import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { ProductProviderEntity } from './entity/product-provider.entity';
import { ProviderDto } from './dto/provider.dto';
import { CreateProviderInput } from './inputs/create-provider.input';
import { UpdateProviderInput } from './inputs/update-provider.input';
import { DetailProviderDto } from './dto/detail-provider.dto';

@Injectable()
export class ProductProvidersService {
  constructor(
    @InjectRepository(ProductProviderEntity)
    private readonly providerRepository: Repository<ProductProviderEntity>,
  ) {}

  async getProductProviders(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProviderDto>> {
    const queryBuilder =
      this.providerRepository.createQueryBuilder('product_providers');

    queryBuilder
      .orderBy('product_providers.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailProviderDto> {
    return await this.providerRepository
      .createQueryBuilder('product_providers')
      .leftJoinAndSelect('product_providers.products', 'products')
      .where('product_providers.id = :id', { id: id })
      .getOne();
  }

  async createProvider(data: CreateProviderInput): Promise<ProviderDto> {
    const createProvider = new ProductProviderEntity();
    createProvider.name = data.name;
    createProvider.address = data.address;
    createProvider.phone = data.phone;
    createProvider.state = data.state;
    createProvider.email = data.email;
    try {
      return await this.providerRepository.save(createProvider);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateProvider(
    id: string,
    data: UpdateProviderInput,
  ): Promise<ProviderDto> {
    const date: Date = new Date();
    const updateProvider = await this.findOneByID(id);

    if (!updateProvider) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }

    updateProvider.name = data.name || updateProvider.name;
    updateProvider.email = data.email || updateProvider.email;
    updateProvider.phone = data.phone || updateProvider.phone;
    updateProvider.address = data.address || updateProvider.address;
    updateProvider.state = data.state || updateProvider.state;
    updateProvider.updated_at = date;

    try {
      return await this.providerRepository.save(updateProvider);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      return await this.providerRepository
        .createQueryBuilder('product_providers')
        .delete()
        .from(ProductProviderEntity)
        .where('product_providers.id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<ProductProviderEntity> {
    return await this.providerRepository
      .createQueryBuilder('product_providers')
      .where('product_providers.id = :id', { id: id })
      .getOne();
  }
}

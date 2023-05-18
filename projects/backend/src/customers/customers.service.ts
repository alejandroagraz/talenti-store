import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { CustomerEntity } from './entity/customer.entity';
import { CustomerDto } from './dto/customer.dto';
import { CreateCustomerInput } from './inputs/create-customer.input';
import { UpdateCustomerInput } from './inputs/update-customer.input';
import { DetailCustomerDto } from './dto/detail-customer.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomerEntity)
    private readonly customerRepository: Repository<CustomerEntity>,
  ) {}

  async getCustomers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CustomerDto>> {
    const queryBuilder =
      this.customerRepository.createQueryBuilder('customers');

    queryBuilder
      .orderBy('customers.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailCustomerDto> {
    return await this.customerRepository
      .createQueryBuilder('customers')
      .leftJoinAndSelect('customers.deliveries', 'deliveries')
      .where('customers.id = :id', { id: id })
      .getOne();
  }

  async createCustomer(data: CreateCustomerInput): Promise<CustomerDto> {
    const createCustomer = new CustomerEntity();

    createCustomer.name = data.name;
    createCustomer.dni = data.dni;
    createCustomer.email = data.email;
    createCustomer.phone = data.phone;
    createCustomer.address = data.address;

    try {
      return await this.customerRepository.save(createCustomer);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateCustomer(
    id: string,
    data: UpdateCustomerInput,
  ): Promise<CustomerDto> {
    const date: Date = new Date();
    const updateCustomer = await this.findOneByID(id);

    if (!updateCustomer) {
      throw new HttpException('Customers not found', HttpStatus.NOT_FOUND);
    }

    updateCustomer.name = data.name || updateCustomer.name;
    updateCustomer.dni = data.dni || updateCustomer.dni;
    updateCustomer.email = data.email || updateCustomer.email;
    updateCustomer.phone = data.phone || updateCustomer.phone;
    updateCustomer.address = data.address || updateCustomer.address;
    updateCustomer.updated_at = date;

    try {
      return await this.customerRepository.save(updateCustomer);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      return await this.customerRepository
        .createQueryBuilder('customers')
        .delete()
        .from(CustomerEntity)
        .where('customers.id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<CustomerEntity> {
    return await this.customerRepository
      .createQueryBuilder('customers')
      .where('customers.id = :id', { id: id })
      .getOne();
  }
}

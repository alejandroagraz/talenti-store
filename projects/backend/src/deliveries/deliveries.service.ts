import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { DeliveryDto } from './dto/delivery.dto';
import { DeliveriesEntity } from './entity/deliveries.entity';
import { CreateDeliveryInput } from './inputs/create-delivery.input';
import { CreateDetailDeliveryDto } from './dto/create-detail-delivery.dto';
import { CustomersService } from '../customers/customers.service';
import { ProductsService } from '../products/products.service';
import { UpdateDeliveryInput } from './inputs/update-delivery.input';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(DeliveriesEntity)
    private readonly deliveryRepository: Repository<DeliveriesEntity>,
    private readonly customersService: CustomersService,
    private readonly productsService: ProductsService,
  ) {}

  async getDeliveries(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DeliveryDto>> {
    const queryBuilder = this.deliveryRepository.createQueryBuilder('delivery');

    queryBuilder
      .orderBy('delivery.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<CreateDetailDeliveryDto> {
    const delivery = await this.deliveryRepository
      .createQueryBuilder('deliveries')
      .leftJoinAndSelect('deliveries.customer', 'customer')
      .leftJoinAndSelect('deliveries.product', 'product')
      .where('deliveries.id = :id', { id: id })
      .getOne();

    if (!delivery) {
      throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
    }

    return delivery;
  }

  async createDelivery(
    data: CreateDeliveryInput,
  ): Promise<CreateDetailDeliveryDto> {
    const createDelivery = new DeliveriesEntity();
    const product = await this.productsService.findOneByID(data.product_id);
    const customer = await this.customersService.findOneByID(data.customer_id);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    product.stock = product.stock - data.amount;
    const updateProduct = await this.productsService.updateProduct(
      data.product_id,
      product,
    );

    createDelivery.amount = data.amount;
    createDelivery.delivery_address = data.delivery_address;
    createDelivery.delivery_state = data.delivery_state;
    createDelivery.product = updateProduct;
    createDelivery.customer = customer;

    try {
      return await this.deliveryRepository.save(createDelivery);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateDelivery(
    id: string,
    data: UpdateDeliveryInput,
  ): Promise<CreateDetailDeliveryDto> {
    const date: Date = new Date();
    const updateDelivery = await this.findOneByID(id);

    if (!updateDelivery) {
      throw new HttpException('Delivery not found', HttpStatus.NOT_FOUND);
    }

    const product = data.product_id
      ? await this.productsService.findOneByID(data.product_id, true)
      : false;
    const customer = data.customer_id
      ? await this.customersService.findOneByID(data.customer_id)
      : false;

    if (data.customer_id && !customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    if (data.product_id && !product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product) {
      product.stock = product.stock - data.amount;
      updateDelivery.product = await this.productsService.updateProduct(
        data.product_id,
        product,
      );
    }

    updateDelivery.amount = data.amount || updateDelivery.amount;
    updateDelivery.delivery_address =
      data.delivery_address || updateDelivery.delivery_address;
    updateDelivery.delivery_state =
      data.delivery_state || updateDelivery.delivery_state;
    updateDelivery.customer = customer ? customer : updateDelivery.customer;
    updateDelivery.product = product ? product : updateDelivery.product;
    updateDelivery.updated_at = date;

    try {
      return await this.deliveryRepository.save(updateDelivery);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      return await this.deliveryRepository
        .createQueryBuilder('deliveries')
        .delete()
        .from(DeliveriesEntity)
        .where('deliveries.id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string): Promise<DeliveriesEntity> {
    return await this.deliveryRepository
      .createQueryBuilder('deliveries')
      .where('deliveries.id = :id', { id: id })
      .getOne();
  }
}

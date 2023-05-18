import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { ProductEntity } from './entity/product.entity';
import { ProductDto } from './dto/product.dto';
import { CreateProductInput } from './inputs/create-product.input';
import { UpdateProductInput } from './inputs/update-product.input';
import { DetailProductDto } from './dto/detail-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CategoriesService } from '../categories/categories.service';
import { ProductProvidersService } from '../product-providers/product-providers.service';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoriesService: CategoriesService,
    private readonly productProvidersService: ProductProvidersService,
    private readonly filesService: FilesService,
  ) {}

  async getProducts(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    const queryBuilder = this.productRepository.createQueryBuilder('products');

    queryBuilder
      .orderBy('products.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<ProductEntity> {
    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.avatar', 'avatar')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.provider', 'provider')
      .leftJoinAndSelect('products.deliveries', 'deliveries')
      .where('products.id = :id', { id: id })
      .getOne();
  }

  async createProduct(data: CreateProductInput): Promise<CreateProductDto> {
    const createProduct = new ProductEntity();
    const category = await this.categoriesService.findOneByID(
      data.category_id,
      true,
    );
    const provider = await this.productProvidersService.findOneByID(
      data.provider_id,
    );

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    if (!provider) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }

    createProduct.name = data.name;
    createProduct.description = data.description;
    createProduct.price = data.price;
    createProduct.stock = data.stock;
    createProduct.state = data.state;
    createProduct.category = category;
    createProduct.provider = provider;

    try {
      return await this.productRepository.save(createProduct);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateProduct(
    id: string,
    data: UpdateProductInput,
  ): Promise<ProductEntity> {
    const date: Date = new Date();
    const updateProduct = await this.findOneByID(id);

    if (!updateProduct) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const category = data.category_id
      ? await this.categoriesService.findOneByID(data.category_id, true)
      : false;
    const provider = data.provider_id
      ? await this.productProvidersService.findOneByID(data.provider_id)
      : false;

    if (data.category_id && !category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    if (data.provider_id && !provider) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }

    updateProduct.name = data.name || updateProduct.name;
    updateProduct.description = data.description || updateProduct.description;
    updateProduct.price = data.price || updateProduct.price;
    updateProduct.stock = data.stock || updateProduct.stock;
    updateProduct.state = data.state || updateProduct.state;
    updateProduct.category = category ? category : updateProduct.category;
    updateProduct.provider = provider ? provider : updateProduct.provider;
    updateProduct.updated_at = date;

    if (!updateProduct.category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    if (!updateProduct.provider) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.productRepository.save(updateProduct);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async addAvatar(id: string, imageBuffer: Buffer, filename: string) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    if (product.avatar) {
      await this.productRepository.update(id, {
        ...product,
        avatar: null,
      });
      await this.filesService.deletePublicFile(product.avatar.id);
    }

    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );

    await this.productRepository.update(id, {
      ...product,
      avatar,
    });
    return avatar;
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      return await this.productRepository
        .createQueryBuilder('products')
        .delete()
        .from(ProductEntity)
        .where('products.id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string, delivery?: boolean): Promise<ProductEntity> {
    if (delivery)
      return await this.productRepository
        .createQueryBuilder('products')
        .where('products.id = :id', { id: id })
        .getOne();

    return await this.productRepository
      .createQueryBuilder('products')
      .leftJoinAndSelect('products.category', 'category')
      .leftJoinAndSelect('products.provider', 'provider')
      .where('products.id = :id', { id: id })
      .getOne();
  }
}

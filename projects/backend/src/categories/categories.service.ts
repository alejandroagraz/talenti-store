import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { CategoryEntity } from './entity/category.entity';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { StoresService } from '../stores/stores.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DetailCategoryDto } from './dto/detail-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    private readonly storesService: StoresService,
  ) {}

  async getCategories(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    const queryBuilder =
      this.categoryRepository.createQueryBuilder('categories');

    queryBuilder
      .orderBy('categories.created_at', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  async getDetail(id: string): Promise<DetailCategoryDto> {
    return await this.categoryRepository
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.store', 'store')
      .leftJoinAndSelect('categories.products', 'products')
      .where('categories.id = :id', { id: id })
      .getOne();
  }

  async createCategory(data: CreateCategoryInput): Promise<CreateCategoryDto> {
    const createCategory = new CategoryEntity();
    const store = await this.storesService.findOneByID(data.store_id);

    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    createCategory.name = data.name;
    createCategory.description = data.description;
    createCategory.state = data.state;
    createCategory.store = store;

    if (!createCategory.store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.categoryRepository.save(createCategory);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async updateCategory(
    id: string,
    data: UpdateCategoryInput,
  ): Promise<CreateCategoryDto> {
    const date: Date = new Date();
    const updateCategory = await this.findOneByID(id);

    if (!updateCategory) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const store = data.store_id
      ? await this.storesService.findOneByID(data.store_id)
      : false;

    if (data.store_id && !store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    updateCategory.name = data.name || updateCategory.name;
    updateCategory.description = data.description || updateCategory.description;
    updateCategory.state = data.state || updateCategory.state;
    updateCategory.store = store ? store : updateCategory.store;
    updateCategory.updated_at = date;

    if (!updateCategory.store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    try {
      return await this.categoryRepository.save(updateCategory);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.NOT_IMPLEMENTED);
    }
  }

  async deleteOneByID(id: string): Promise<any> {
    try {
      return await this.categoryRepository
        .createQueryBuilder('categories')
        .delete()
        .from(CategoryEntity)
        .where('categories.id = :id', { id: id })
        .execute();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneByID(id: string, product?: boolean): Promise<CategoryEntity> {
    if (product) {
      return await this.categoryRepository
        .createQueryBuilder('categories')
        .where('categories.id = :id', { id: id })
        .getOne();
    }
    return await this.categoryRepository
      .createQueryBuilder('categories')
      .leftJoinAndSelect('categories.store', 'store')
      .where('categories.id = :id', { id: id })
      .getOne();
  }
}

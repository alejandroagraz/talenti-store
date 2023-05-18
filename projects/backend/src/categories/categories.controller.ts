import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryInput } from './inputs/create-category.input';
import { UpdateCategoryInput } from './inputs/update-category.input';
import { CreateCategoryDto } from './dto/create-category.dto';
import { DetailCategoryDto } from './dto/detail-category.dto';
import { ApiPaginatedResponse } from '../common/dto/api-pagination-response';

@ApiTags('Categories')
@ApiBearerAuth('token')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all categories' })
  @ApiExtraModels(PageDto, CategoryDto)
  @ApiPaginatedResponse(CategoryDto)
  async getCategories(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CategoryDto>> {
    return await this.categoriesService.getCategories(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a category according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [DetailCategoryDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailCategoryDto> {
    return await this.categoriesService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new category' })
  @ApiBody({ type: CreateCategoryInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [CreateCategoryDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async createProduct(
    @Body() newCategory: CreateCategoryInput,
  ): Promise<CreateCategoryDto> {
    return await this.categoriesService.createCategory(newCategory);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a category according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateCategoryInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [CreateCategoryDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateCategory: UpdateCategoryInput,
  ): Promise<CreateCategoryDto> {
    return await this.categoriesService.updateCategory(id, updateCategory);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a category according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove category' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    const resp = await this.categoriesService.deleteOneByID(id);

    if (!resp.affected) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    return { status: 200, message: 'Success remove category' };
  }
}

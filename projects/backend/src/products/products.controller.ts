import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { CreateProductInput } from './inputs/create-product.input';
import { UpdateProductInput } from './inputs/update-product.input';
import { DetailProductDto } from './dto/detail-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../files/dto/file.dto';
import { ProductEntity } from './entity/product.entity';
import { FileUploadDto } from '../common/dto/file-upload.dto';
import { ApiPaginatedResponse } from '../common/dto/api-pagination-response';

@ApiTags('Products')
@ApiBearerAuth('token')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all products' })
  @ApiExtraModels(PageDto, ProductDto)
  @ApiPaginatedResponse(ProductDto)
  async getProducts(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProductDto>> {
    return await this.productsService.getProducts(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a product according to its ID' })
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
    type: [DetailProductDto],
  })
  async getDetail(@Param('id') id: string): Promise<ProductEntity> {
    return await this.productsService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new product' })
  @ApiBody({ type: CreateProductInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [CreateProductDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async createProduct(
    @Body() newProduct: CreateProductInput,
  ): Promise<CreateProductDto> {
    return await this.productsService.createProduct(newProduct);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a product according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateProductInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [CreateProductDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProduct: UpdateProductInput,
  ): Promise<CreateProductDto> {
    return await this.productsService.updateProduct(id, updateProduct);
  }

  @Post('avatar/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Create avatar for product' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [FileDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async addAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5000000 })],
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<FileDto> {
    return this.productsService.addAvatar(
      id,
      avatar.buffer,
      avatar.originalname,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a product according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove Provider' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    const resp = await this.productsService.deleteOneByID(id);

    if (!resp.affected) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }

    return { status: 200, message: 'Success remove Provider' };
  }
}

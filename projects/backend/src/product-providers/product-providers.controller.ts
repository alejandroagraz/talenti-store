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
import { ProviderDto } from './dto/provider.dto';
import { ProductProvidersService } from './product-providers.service';
import { CreateProviderInput } from './inputs/create-provider.input';
import { UpdateProviderInput } from './inputs/update-provider.input';
import { DetailProviderDto } from './dto/detail-provider.dto';
import { ApiPaginatedResponse } from '../common/dto/api-pagination-response';

@ApiTags('Product Providers')
@ApiBearerAuth('token')
@Controller('product-providers')
export class ProductProvidersController {
  constructor(
    private readonly productProvidersService: ProductProvidersService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all providers' })
  @ApiExtraModels(PageDto, ProviderDto)
  @ApiPaginatedResponse(ProviderDto)
  async getProductProviders(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ProviderDto>> {
    return await this.productProvidersService.getProductProviders(
      pageOptionsDto,
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a provider according to its ID' })
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
    type: [DetailProviderDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailProviderDto> {
    return await this.productProvidersService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new provider' })
  @ApiBody({ type: CreateProviderInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [ProviderDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async createProvider(
    @Body() newProvider: CreateProviderInput,
  ): Promise<ProviderDto> {
    return await this.productProvidersService.createProvider(newProvider);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a provider according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateProviderInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [ProviderDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async updateProvider(
    @Param('id') id: string,
    @Body() updateProvider: UpdateProviderInput,
  ): Promise<ProviderDto> {
    return await this.productProvidersService.updateProvider(
      id,
      updateProvider,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a provider according to its ID' })
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
    const resp = await this.productProvidersService.deleteOneByID(id);

    if (!resp.affected) {
      throw new HttpException('Provider not found', HttpStatus.NOT_FOUND);
    }

    return { status: 200, message: 'Success remove Provider' };
  }
}

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
import { StoreDto } from './dto/store.dto';
import { StoresService } from './stores.service';
import { CreateStoreInput } from './inputs/create-store.input';
import { UpdateStoreInput } from './inputs/update-store.input';
import { DetailStoreDto } from './dto/detail-store.dto';
import { ApiPaginatedResponse } from '../common/dto/api-pagination-response';

@ApiTags('Stores')
@ApiBearerAuth('token')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all stores' })
  @ApiExtraModels(PageDto, StoreDto)
  @ApiPaginatedResponse(StoreDto)
  async getStores(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<StoreDto>> {
    return await this.storesService.getStores(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a store according to its ID' })
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
    type: [DetailStoreDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailStoreDto> {
    return await this.storesService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new store' })
  @ApiBody({ type: CreateStoreInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [StoreDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async createStore(@Body() newStore: CreateStoreInput): Promise<StoreDto> {
    return await this.storesService.createStore(newStore);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a store according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateStoreInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [StoreDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async updateStore(
    @Param('id') id: string,
    @Body() updateStore: UpdateStoreInput,
  ): Promise<StoreDto> {
    return await this.storesService.updateStore(id, updateStore);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a store according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove store' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    const resp = await this.storesService.deleteOneByID(id);

    if (!resp.affected) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }

    return { status: 200, message: 'Success remove store' };
  }
}

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
import { DeliveriesService } from './deliveries.service';
import { DeliveryDto } from './dto/delivery.dto';
import { CreateDeliveryInput } from './inputs/create-delivery.input';
import { CreateDetailDeliveryDto } from './dto/create-detail-delivery.dto';
import { UpdateDeliveryInput } from './inputs/update-delivery.input';
import { ApiPaginatedResponse } from '../common/dto/api-pagination-response';

@ApiTags('Deliveries')
@ApiBearerAuth('token')
@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all deliveries' })
  @ApiExtraModels(PageDto, DeliveryDto)
  @ApiPaginatedResponse(DeliveryDto)
  async getDeliveries(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<DeliveryDto>> {
    return await this.deliveriesService.getDeliveries(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a delivery according to its ID' })
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
    type: [CreateDetailDeliveryDto],
  })
  async getDetail(@Param('id') id: string): Promise<CreateDetailDeliveryDto> {
    return await this.deliveriesService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new delivery' })
  @ApiBody({ type: CreateDeliveryInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [CreateDetailDeliveryDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async createDelivery(
    @Body() newDelivery: CreateDeliveryInput,
  ): Promise<CreateDetailDeliveryDto> {
    return await this.deliveriesService.createDelivery(newDelivery);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a delivery according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateDeliveryInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [CreateDetailDeliveryDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async updateDelivery(
    @Param('id') id: string,
    @Body() updateDelivery: UpdateDeliveryInput,
  ): Promise<CreateDetailDeliveryDto> {
    return await this.deliveriesService.updateDelivery(id, updateDelivery);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a delivery according to its ID' })
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
    const resp = await this.deliveriesService.deleteOneByID(id);

    if (!resp.affected) {
      throw new HttpException('delivery not found', HttpStatus.NOT_FOUND);
    }

    return { status: 200, message: 'Success remove Provider' };
  }
}

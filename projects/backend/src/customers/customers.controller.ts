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
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { CustomerDto } from './dto/customer.dto';
import { CustomersService } from './customers.service';
import { CreateCustomerInput } from './inputs/create-customer.input';
import { UpdateCustomerInput } from './inputs/update-customer.input';
import { DetailCustomerDto } from './dto/detail-customer.dto';
import { ApiPaginatedResponse } from '../common/dto/api-pagination-response';

@ApiTags('Customers')
@ApiBearerAuth('token')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all customers' })
  @ApiExtraModels(PageDto, CustomerDto)
  @ApiPaginatedResponse(CustomerDto)
  async getCustomers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CustomerDto>> {
    return await this.customersService.getCustomers(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a customer according to its ID' })
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
    type: [DetailCustomerDto],
  })
  async getDetail(@Param('id') id: string): Promise<DetailCustomerDto> {
    return await this.customersService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new customer' })
  @ApiBody({ type: CreateCustomerInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [CustomerDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async createCustomer(
    @Body() newCustomer: CreateCustomerInput,
  ): Promise<CustomerDto> {
    return await this.customersService.createCustomer(newCustomer);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a customer according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateCustomerInput })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [CustomerDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomer: UpdateCustomerInput,
  ): Promise<CustomerDto> {
    return await this.customersService.updateCustomer(id, updateCustomer);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a customer according to its ID' })
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
    const resp = await this.customersService.deleteOneByID(id);

    if (!resp.affected) {
      throw new HttpException('product not found', HttpStatus.NOT_FOUND);
    }

    return { status: 200, message: 'Success remove Provider' };
  }
}

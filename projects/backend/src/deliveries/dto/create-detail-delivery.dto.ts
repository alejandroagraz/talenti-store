import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../products/dto/product.dto';
import { CustomerDto } from '../../customers/dto/customer.dto';

export class CreateDetailDeliveryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  delivery_address: string;

  @ApiProperty()
  delivery_state: string;

  @ApiProperty()
  product: ProductDto;

  @ApiProperty()
  customer: CustomerDto;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

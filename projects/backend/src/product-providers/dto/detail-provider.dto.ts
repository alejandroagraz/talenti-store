import { ApiProperty } from '@nestjs/swagger';
import { ProductDto } from '../../products/dto/product.dto';

export class DetailProviderDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  state: boolean;

  @ApiProperty()
  email: string;

  @ApiProperty({ isArray: true, type: ProductDto })
  products: ProductDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

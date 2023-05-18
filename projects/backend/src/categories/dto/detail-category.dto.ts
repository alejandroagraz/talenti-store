import { ApiProperty } from '@nestjs/swagger';
import { StoreDto } from '../../stores/dto/store.dto';
import { ProductDto } from '../../products/dto/product.dto';

export class DetailCategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  state: boolean;

  @ApiProperty()
  store: StoreDto;

  @ApiProperty({ isArray: true, type: ProductDto })
  products: ProductDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from '../../categories/dto/category.dto';
import { ProviderDto } from '../../product-providers/dto/provider.dto';

export class CreateProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: string;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  state: boolean;

  @ApiProperty()
  category: CategoryDto;

  @ApiProperty()
  provider: ProviderDto;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

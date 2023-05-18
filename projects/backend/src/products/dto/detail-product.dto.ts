import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from '../../categories/dto/category.dto';
import { ProviderDto } from '../../product-providers/dto/provider.dto';
import { DeliveryDto } from '../../deliveries/dto/delivery.dto';
import { FileDto } from '../../files/dto/file.dto';

export class DetailProductDto {
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
  avatar: FileDto;

  @ApiProperty()
  category: CategoryDto;

  @ApiProperty()
  provider: ProviderDto;

  @ApiProperty({ isArray: true, type: DeliveryDto })
  deliveries: DeliveryDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

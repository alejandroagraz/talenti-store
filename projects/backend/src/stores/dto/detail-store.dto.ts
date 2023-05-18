import { ApiProperty } from '@nestjs/swagger';
import { CategoryDto } from '../../categories/dto/category.dto';

export class DetailStoreDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  zip_code: string;

  @ApiProperty()
  state: boolean;

  @ApiProperty({ isArray: true, type: CategoryDto })
  categories: CategoryDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

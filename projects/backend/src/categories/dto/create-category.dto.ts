import { ApiProperty } from '@nestjs/swagger';
import { StoreDto } from '../../stores/dto/store.dto';

export class CreateCategoryDto {
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

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

import { ApiProperty } from '@nestjs/swagger';
import { DeliveryDto } from '../../deliveries/dto/delivery.dto';

export class DetailCustomerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  dni: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty({ isArray: true, type: DeliveryDto })
  deliveries: DeliveryDto[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

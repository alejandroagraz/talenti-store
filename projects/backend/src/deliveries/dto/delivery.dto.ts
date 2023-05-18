import { ApiProperty } from '@nestjs/swagger';

export class DeliveryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  delivery_address: string;

  @ApiProperty()
  delivery_state: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

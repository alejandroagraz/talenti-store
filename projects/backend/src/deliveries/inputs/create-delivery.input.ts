import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { State } from '../../common/constants/state.constant';

export class CreateDeliveryInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'The amount is required' })
  @IsInt()
  amount: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'The delivery_address is required' })
  @IsString()
  delivery_address: string;

  @ApiProperty({
    description: 'State delivery',
    enum: State,
    type: State,
    example: State.PENDING,
  })
  @IsEnum(State)
  @IsNotEmpty({ message: 'The customer_id is required' })
  delivery_state: State;

  @ApiProperty()
  @IsNotEmpty({ message: 'The customer_id is required' })
  @IsString()
  customer_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The product_id is required' })
  @IsString()
  product_id: string;
}

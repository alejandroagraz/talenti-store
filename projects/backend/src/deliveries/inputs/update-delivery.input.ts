import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { State } from '../../common/constants/state.constant';

export class UpdateDeliveryInput {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  amount?: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  delivery_address?: string;

  @ApiPropertyOptional({ enum: State, example: State.PENDING_SHIPPED })
  @IsEnum(State)
  @IsOptional()
  delivery_state?: State;

  @ApiProperty()
  @IsOptional()
  @IsString()
  customer_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  product_id?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateProductInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The description is required' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The price is required' })
  @IsString()
  price: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The stock is required' })
  @IsInt()
  stock: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'The state is required' })
  @IsBoolean()
  state: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'The category_id is required' })
  @IsString()
  category_id: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The provider_id is required' })
  @IsString()
  provider_id: string;
}

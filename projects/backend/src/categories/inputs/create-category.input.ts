import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The description is required' })
  @IsString()
  description: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The state is required' })
  @IsBoolean()
  state: boolean;

  @ApiProperty()
  @IsNotEmpty({ message: 'The store_id is required' })
  @IsString()
  store_id: string;
}

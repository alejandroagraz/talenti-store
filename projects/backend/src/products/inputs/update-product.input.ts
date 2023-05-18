import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateProductInput {
  @ApiProperty()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  price?: string;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  stock?: number;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  state?: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  category_id?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  provider_id?: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateStoreInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The phone is required' })
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The address is required' })
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The city is required' })
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The zip_code is required' })
  @IsString()
  zip_code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The state is required' })
  @IsBoolean()
  state: boolean;
}

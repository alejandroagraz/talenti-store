import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCustomerInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The dni is required' })
  @IsInt()
  dni: number;

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
}

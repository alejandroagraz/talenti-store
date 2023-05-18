import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateProviderInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'The name is required' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The address is required' })
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The phone is required' })
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The state is required' })
  @IsBoolean()
  state: boolean;

  @ApiProperty()
  @IsEmail({}, { message: 'Incorrect email' })
  @IsNotEmpty({ message: 'The email is required' })
  email: string;
}

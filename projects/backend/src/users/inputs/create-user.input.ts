import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserInput {
  @ApiProperty()
  @IsNotEmpty({ message: 'The firstname is required' })
  @IsString()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The lastname is required' })
  @IsString()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The username is required' })
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The dni is required' })
  @IsInt()
  dni: number;

  @ApiProperty()
  @IsNotEmpty({ message: 'The email is required' })
  @IsString()
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The password is required' })
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The phone is required' })
  @IsString()
  phone: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'The state is required' })
  @IsBoolean()
  state: boolean;
}

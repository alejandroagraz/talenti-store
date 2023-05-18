import { ApiProperty } from '@nestjs/swagger';
import { FileDto } from '../../files/dto/file.dto';

export class UserDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstname: string;

  @ApiProperty()
  lastname: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  dni: number;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  state: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

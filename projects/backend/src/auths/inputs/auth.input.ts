import { ApiProperty } from '@nestjs/swagger';

export class AuthInput {
  @ApiProperty()
  readonly username: string;

  @ApiProperty()
  readonly password: string;
}

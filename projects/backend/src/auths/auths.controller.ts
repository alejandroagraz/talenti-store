import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { AuthsService } from './auths.service';
import { AuthInput } from './inputs/auth.input';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';

@ApiTags('Auths')
@Controller('auths')
export class AuthController {
  constructor(private readonly authsService: AuthsService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Login with username or email and password',
  })
  @ApiBody({
    description: 'Log in',
    type: AuthInput,
  })
  @ApiCreatedResponse({
    description: 'The user has successfully logged in',
    type: AuthDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Username or Password is incorrect',
  })
  async login(@Body() authDto: AuthInput, @Req() req): Promise<AuthDto> {
    const { username, password } = authDto;

    const user = await this.authsService.validateUser({ username, password });
    if (!user)
      throw new HttpException(
        'Email o Password es incorrecto',
        HttpStatus.UNAUTHORIZED,
      );

    return await this.authsService.login(user);
  }
}

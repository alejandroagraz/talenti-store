import { Inject, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthInput } from './inputs/auth.input';
import { UserDto } from '../users/dto/user.dto';
import { UserEntity } from '../users/entity/user.entity';

@Injectable()
export class AuthsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(input: AuthInput): Promise<UserDto> {
    const { username, password } = input;
    const isUSer: UserEntity = await this.usersService.findOneUser(username);

    if (isUSer) {
      const verifyPassword = await bcrypt.compare(password, isUSer.password);
      if (verifyPassword) {
        return isUSer;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  async login(input: UserDto): Promise<AuthDto> {
    const authType = new AuthDto();
    const payload = {
      id: input.id,
      sub: input.email,
    };
    authType.access_token = this.jwtService.sign(payload);
    return authType;
  }
}

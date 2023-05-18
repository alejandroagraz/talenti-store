import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthsService } from './auths.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auths.controller';
import * as fs from 'fs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { FileEntity } from '../files/entity/file.entity';

config();
const configService = new ConfigService();

@Module({
  imports: [
    JwtModule.register({
      privateKey: fs.readFileSync('src/auths/certs/jwt-private.key', 'utf8'),
      publicKey: fs.readFileSync('src/auths/certs/jwt-public.key', 'utf8'),
      signOptions: {
        algorithm: configService.get('ALGORITHM'),
        expiresIn: configService.get('TIME_TOKEN'),
      },
    }),
    TypeOrmModule.forFeature([UserEntity, FileEntity]),
    PassportModule,
    UsersModule,
  ],
  providers: [JwtStrategy, AuthsService, UsersService, FilesService],
  exports: [AuthsService],
  controllers: [AuthController],
})
export class AuthsModule {}

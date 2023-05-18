import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UserEntity } from './entity/user.entity';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';
import { FileEntity } from '../files/entity/file.entity';
import { FilesService } from '../files/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FileEntity])],
  controllers: [UsersController],
  providers: [UsersService, FilesService, ConfigService],
})
export class UsersModule {}

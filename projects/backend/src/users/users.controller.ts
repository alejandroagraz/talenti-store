import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auths/guards/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { PageDto } from '../common/dto/page.dto';
import { FileUploadDto } from '../common/dto/file-upload.dto';
import {
  ApiBadGatewayResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DetailUserDto } from './dto/detail-user.dto';
import { UpdateUserInput } from './inputs/update-user.input';
import { CreateUserInput } from './inputs/create-user.input';
import { UserEntity } from './entity/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileDto } from '../files/dto/file.dto';
import { ApiPaginatedResponse } from '../common/dto/api-pagination-response';

@ApiTags('Users')
@ApiBearerAuth('token')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all users' })
  @ApiExtraModels(PageDto, UserDto)
  @ApiPaginatedResponse(UserDto)
  async getUsers(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return await this.userService.getUsers(pageOptionsDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a user according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  @ApiOkResponse({
    status: 200,
    description: 'Success response',
    type: [DetailUserDto],
  })
  async getDetail(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.getDetail(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create new user' })
  @ApiBody({ type: CreateUserInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [UserDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async createUser(@Body() newCategory: CreateUserInput): Promise<UserDto> {
    return await this.userService.createUser(newCategory);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a user according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiBody({ type: UpdateUserInput })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [UserDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateCategory: UpdateUserInput,
  ): Promise<UserDto> {
    return await this.userService.updateUser(id, updateCategory);
  }

  @Post('avatar/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiOperation({ summary: 'Create avatar for user' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @ApiOkResponse({
    status: 201,
    description: 'Success response',
    type: [FileDto],
  })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async addAvatar(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5000000 })],
      }),
    )
    avatar: Express.Multer.File,
  ): Promise<FileDto> {
    return this.userService.addAvatar(id, avatar.buffer, avatar.originalname);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a user according to its ID' })
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
    example: '6ec47750-727d-4d44-9f26-73ba303c3f61',
  })
  @ApiOkResponse({ status: 200, description: 'Success remove user' })
  @ApiUnauthorizedResponse({ status: 401, description: 'Unauthorized' })
  @ApiBadGatewayResponse({ status: 502, description: 'Something happened' })
  async deleteOneByID(@Param('id') id: string) {
    const resp = await this.userService.deleteOneByID(id);

    if (!resp.affected) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return { status: 200, message: 'Success remove user' };
  }
}

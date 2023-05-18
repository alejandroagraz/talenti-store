import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileEntity } from './entity/file.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly configService: ConfigService,
  ) {}

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const s3 = this.configS3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.fileRepository.create({
      name: filename,
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    return await this.fileRepository.save(newFile);
  }

  async deletePublicFile(id: string) {
    const file = await this.fileRepository
      .createQueryBuilder('files')
      .where('files.id = :id', { id: id })
      .getOne();

    const s3 = this.configS3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();

    return await this.fileRepository
      .createQueryBuilder('files')
      .delete()
      .from(FileEntity)
      .where('files.id = :id', { id: id })
      .execute();
  }

  configS3() {
    return new S3({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }
}

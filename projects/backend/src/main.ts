import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/setup-swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  setupSwagger(app);

  await app.listen(3000);
  const url = await app
    .getUrl()
    .then((url) =>
      url.includes('[::1]') ? url.replace('[::1]', 'localhost') : url,
    );
  logger.verbose(`Server is running on ${url}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const port = parseInt(process.env.PORT ?? '3000', 10);

async function bootstrap() {
  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors();

  logger.log(`Running server on PID=${process.pid}, http://localhost:${port}`);
  await app.listen(port);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqOptions } from '@nestjs/microservices';
import { RmqService } from './rmq';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const rmqService = app.get<RmqService>(RmqService);
  const configService = app.get<ConfigService>(ConfigService);
  app.enableCors();
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('PAYMENT', true));
  await app.startAllMicroservices();

  await app.listen(configService.get('PORT'));
  console.log(`🚀 Microservice is listening`);
}
bootstrap();

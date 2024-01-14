import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqOptions } from '@nestjs/microservices';
import { RmqService } from './rmq';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('PAYMENT', true));
  await app.startAllMicroservices();

  await app.listen(8001);
  console.log(`🚀 Microservice is listening`);
}
bootstrap();

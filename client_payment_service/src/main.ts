import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'payment_res',
      noAck: true,
      persistent: true,
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  await app.listen(8000);

  // await app.listen(3000);
}
bootstrap();

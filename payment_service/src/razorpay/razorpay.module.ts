import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RazorpayController } from './razorpay.controller';
import { RazorpayService } from './razorpay.service';
import { RmqModule } from 'src/rmq';
import { PAYMENT_SERVICE } from 'src/services/services';
import { JsonBodyMiddleware } from 'src/middleware/json-body.middleware';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [RazorpayController],
  providers: [RazorpayService],
})
export class RazorpayModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(JsonBodyMiddleware).forRoutes('*');
  }
}

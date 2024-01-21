import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { RmqModule } from 'src/rmq';
import { PAYMENT_SERVICE } from 'src/services/services';
import { RawBodyMiddleware } from 'src/middleware/raw-body.middleware';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RawBodyMiddleware).forRoutes({
      path: '/stripe/webhooks',
      method: RequestMethod.POST,
    });
  }
}

import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { RazorpayModule } from './razorpay/razorpay.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { StripeModule } from './stripe/stripe.module';
import { RawBodyMiddleware } from './middleware/raw-body.middleware';
import { PhonepayModule } from './phonepay/phonepay.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_PAYMENT_REQ_QUEUE: Joi.string().required(),
        RABBIT_MQ_PAYMENT_RES_QUEUE: Joi.string().required(),
      }),
    }),
    RazorpayModule,
    StripeModule,
    PhonepayModule,
  ],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RawBodyMiddleware).forRoutes({
      path: '/stripe/webhooks',
      method: RequestMethod.POST,
    });
    //Uncomment below in case of another route
    // .apply(JsonBodyMiddleware)
    // .forRoutes('*');
  }
}

import { Module } from '@nestjs/common';
import { RazorpayModule } from './razorpay/razorpay.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { StripeModule } from './stripe/stripe.module';

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
  ],
})
export class AppModule {}

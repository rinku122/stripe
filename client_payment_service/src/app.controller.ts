import { Body, Controller,  Inject, Post } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  //PhonePay
  @Post('phonepay')
  async phonepay(@Body() body: any) {
    return lastValueFrom(this.client.send('phonepay_checkout', body));
  }

  @EventPattern('phonepay_payment_intent')
  async phonePayintent(data: any) {
    console.log(data, 'client');
  }

  @EventPattern('phonepay_webhook_resp')
  async phonePayResponse(data: any) {
    console.log(data, 'client');
  }

  @MessagePattern('phonepay_validate')
  async phonePayValidate(data: any) {
    const db = {
      T1705933875268: {
        amount: '35000',
      },
    };
    if (!db[data]) return null;
    return db[data]?.amount;
  }

  //Stripe

  @Post('stripe')
  stripe(@Body() body: any) {
    return lastValueFrom(this.client.send('stripe_checkout', body));
  }

  @EventPattern('stripe_payment_intent')
  async stripePayintent(data: any) {
    console.log(data, 'client');
  }

  @EventPattern('stripe_webhook_resp')
  async stripeResponse(data: any) {
    console.log(data, 'client');
  }

  //Razorpay
  @Post('razorpay')
  razorpay(@Body() body: any) {
    return lastValueFrom(this.client.send('razorpay_checkout', body));
  }

  @EventPattern('razorpay_payment_intent')
  async razorpayPayintent(data: any) {
    console.log(data, 'client');
  }

  @EventPattern('razorpay_webhook_resp')
  async razorpayResponse(data: any) {
    console.log(data, 'client');
  }

  //CoinbaseCommerce
  @Post('coinbase_commerce')
  coinbaseCommerce(@Body() body: any) {
    return lastValueFrom(this.client.send('coinbase_commerce_checkout', body));
  }

  @EventPattern('coinbase_commerce_payment_intent')
  async coinbase_commercePayintent(data: any) {
    console.log(data, 'client');
  }

  @EventPattern('coinbase_commerce_webhook_resp')
  async coinbase_commerceResponse(data: any) {
    console.log(data, 'client');
  }
}

import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    @Inject('PRODUCT_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @EventPattern('razorpay_created')
  async hello(data: any) {
    console.log(data, 'client');
  }

  @Get('razorpay')
  getHello() {
    this.client.emit('razorpay_created', { hi: 'Hello there ' });
  }

  @Post('stripe')
  stripe(@Body() body: any) {
    return lastValueFrom(this.client.send('stripe_checkout', body));
  }

  @Post('phonepay')
  async phonepay(@Body() body: any) {
    const res = await lastValueFrom(
      this.client.send('phonepay_checkout', body),
    );
    console.log(res);
    return res;
  }

  @EventPattern('stripe_webhook_resp')
  async stripeResponse(data: any) {
    console.log(data, 'client');
  }

  @EventPattern('phonepay_webhook_resp')
  async phonePayResponse(data: any) {
    console.log(data, 'client');
  }
}

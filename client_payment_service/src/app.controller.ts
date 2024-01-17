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
  getHelloS(@Body() body: any) {
    return lastValueFrom(this.client.send('stripe_checkout', body));
  }

  @EventPattern('stripe_webhook_resp')
  async hello5(data: any) {
    console.log(data, 'client');
  }
}

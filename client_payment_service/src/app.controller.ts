import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

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

  @EventPattern('stripe_created')
  async hello5(data: any) {
    console.log(data, 'client');
  }

  @Get('razorpay')
  getHello() {
    this.client.emit('razorpay_created', { hi: 'Hello there ' });
  }

  @Post('stripe')
  getHelloS(@Body() body: any) {
    this.client.emit('stripe_checkout', body);
  }
}

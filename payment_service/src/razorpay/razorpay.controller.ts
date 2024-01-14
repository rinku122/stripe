import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';

@Controller('razorpay')
export class RazorpayController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  @Get()
  getHello() {
    try {
      this.client.emit('product_created', { hi: 'Hello there ' });
    } catch (error) {
      console.log(error);
    }
  }

  @EventPattern('test_created')
  async hello(data: any) {
    console.log(data, 'razorpay');
  }
}

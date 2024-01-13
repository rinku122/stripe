import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller('razorpay')
export class RazorpayController {
  @EventPattern('product_created')
  async hello(data: any) {
    console.log(data, 'razorpay');
  }
}

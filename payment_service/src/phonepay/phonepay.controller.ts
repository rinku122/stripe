import { Controller, Post, Req, Res } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PhonePayService } from './phonepay.service';

const EVENT_PREFIX = 'phonepay';

@Controller(EVENT_PREFIX)
export class PhonePayController {
  constructor(private readonly stripeService: PhonePayService) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkOut(data: any) {
    return this.stripeService.checkout(data);
  }

  @Post('status/:id')
  async checkStatus(data: any, @Res() res: any) {
    return this.stripeService.checkStatus(data, res);
  }
}

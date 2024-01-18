import { Controller, Post, Param } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PhonePayService } from './phonepay.service';

const EVENT_PREFIX = 'phonepay';

@Controller(EVENT_PREFIX)
export class PhonePayController {
  constructor(private readonly stripeService: PhonePayService) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkOut(data: any) {
    return this.stripeService.checkout();
  }

  @Post('status/:id')
  checkStatus(@Param('id') id: string) {
    return this.stripeService.checkStatus(id, EVENT_PREFIX);
  }
}

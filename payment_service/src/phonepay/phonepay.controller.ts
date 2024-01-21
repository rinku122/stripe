import { Body, Controller, Post, Res } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { PhonePayService } from './phonepay.service';

const EVENT_PREFIX = 'phonepay';

@Controller(EVENT_PREFIX)
export class PhonePayController {
  constructor(private readonly stripeService: PhonePayService) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkOut(data: any) {
    return this.stripeService.checkout(data, EVENT_PREFIX);
  }

  @Post('webhook')
  webhook(@Body() body: string, @Res() res: any) {
    return this.stripeService.webhook(body, res, EVENT_PREFIX);
  }

  @Post('status')
  getStatus(@Body() body: string, @Res() res: any) {
    return this.stripeService.webhook(body, res, EVENT_PREFIX, false);
  }
}

import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RazorpayService } from './razorpay.service';

const EVENT_PREFIX = 'razorpay';
@Controller(EVENT_PREFIX)
export class RazorpayController {
  constructor(private readonly razorpayService: RazorpayService) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkout(data: any) {
    return this.razorpayService.checkout(data, EVENT_PREFIX);
  }

  @Post('status')
  handleWebhook(@Body() event: any, @Res() res: any) {
    return this.razorpayService.handleWebhook(event, EVENT_PREFIX, res);
  }
}

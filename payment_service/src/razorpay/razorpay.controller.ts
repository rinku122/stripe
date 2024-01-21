import { Body, Controller, Get, Headers, Inject, Post } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';
import { RazorpayService } from './razorpay.service';

const EVENT_PREFIX = 'razorpay';
@Controller(EVENT_PREFIX)
export class RazorpayController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
    private readonly razorpayService: RazorpayService,
  ) {}

  reply(event: string, data: any) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkout(data: any) {
    return this.razorpayService.checkout(data);
  }

  @Post('status')
  handleWebhook(@Body() event: any) {
    return this.razorpayService.handleWebhook(event, EVENT_PREFIX);
  }
}

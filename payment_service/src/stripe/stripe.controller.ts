import { Body, Controller, Get, Inject, Post, Headers } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';
import { StripeService } from './stripe.service';

const EVENT_PREFIX = 'stripe';

@Controller(EVENT_PREFIX)
export class StripeController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
    private readonly stripeService: StripeService,
  ) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkOut(data: any) {
    return this.stripeService.checkout(data);
  }

  @Post('webhooks')
  handleWebhook(
    @Body() event: any,
    @Headers('stripe-signature') header: string,
  ) {
    return this.stripeService.handleWebhook(event, header, EVENT_PREFIX);
  }
}

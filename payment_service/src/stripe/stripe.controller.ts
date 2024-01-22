import { Controller, Post, Headers, Req, Res } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { StripeService } from './stripe.service';

const EVENT_PREFIX = 'stripe';

@Controller(EVENT_PREFIX)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkOut(data: any) {
    return this.stripeService.checkout(data, EVENT_PREFIX);
  }

  @Post('webhooks')
  handleWebhook(@Headers('stripe-signature') header: string, @Req() req: any) {
    return this.stripeService.handleWebhook(req.rawBody, header, EVENT_PREFIX);
  }
}

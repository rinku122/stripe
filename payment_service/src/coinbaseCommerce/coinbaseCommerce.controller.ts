import { Controller, Post, Headers, Req } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CoinbaseCommerceService } from './coinbaseCommerce.service';

const EVENT_PREFIX = 'coinbase_commerce';

@Controller(EVENT_PREFIX)
export class CoinbaseCommerceController {
  constructor(private readonly stripeService: CoinbaseCommerceService) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkOut(data: any) {
    return this.stripeService.checkout(data, EVENT_PREFIX);
  }

  @Post('webhooks')
  handleWebhook(@Headers('x-cc-webhook-signature') signature: string, @Req() req: any) {
    return this.stripeService.handleWebhook(req.rawBody, signature, EVENT_PREFIX);
  }


}

import { Controller, Post, Headers, Req } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CoinpaymentService } from './coinpayment.service';
import { CreatePaymentDto } from './dto/createpayment.dto';

const EVENT_PREFIX = 'coinpayment';

@Controller(EVENT_PREFIX)
export class CoinpaymentController {
  constructor(private readonly coinpaymentService: CoinpaymentService) {}

  @MessagePattern(`${EVENT_PREFIX}_checkout`)
  checkOut(data: CreatePaymentDto) {
    return this.coinpaymentService.checkout(data, EVENT_PREFIX);
  }

  // @Post('webhooks')
  // handleWebhook(@Headers('x-cc-webhook-signature') signature: string, @Req() req: any) {
  //   return this.coinpaymentService.handleWebhook(req.rawBody, signature, EVENT_PREFIX);
  // }
}

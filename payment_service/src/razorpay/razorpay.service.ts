import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
const crypto = require('crypto');
import { PAYMENT_SERVICE } from 'src/services/services';
const Razorpay = require('razorpay');

@Injectable()
export class RazorpayService {
  private readonly razorpay: any;
  constructor(
    private readonly configService: ConfigService,
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.get('KEY_ID'),
      key_secret: this.configService.get('KEY_SECRET'),
    });
  }

  async checkout(options: any) {
    try {
      const response = await this.razorpay.orders.create(options);
      return response;
    } catch (error) {
      return new BadRequestException(
        'Not able to create order. Please try again!',
      );
    }
  }

  async handleWebhook(event: any, EVENT_PREFIX: string) {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      event;
    const generated_signature = crypto
      .createHmac('sha256', this.configService.get('KEY_SECRET'))
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    const isAuthentic = generated_signature === razorpay_signature;

    if (isAuthentic) {
      this.reply('webhook_resp', event, EVENT_PREFIX);
    } else {
      console.log(`⚠️ Signature verification failed.`);
    }
  }

  private reply(event: string, data: any, EVENT_PREFIX: string) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }
}

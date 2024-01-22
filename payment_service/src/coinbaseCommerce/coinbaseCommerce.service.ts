import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';
import { Client, resources, Webhook } from 'coinbase-commerce-node';

const crypto = require('crypto');

@Injectable()
export class CoinbaseCommerceService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {
    //Uncomment after having credentials, as there is no test enviroment for coinpayment
    // Client.init(this.configService.get('COINBASE_API'));
  }

  async checkout(data: any, EVENT_PREFIX: string) {
    const { product, metadata, pricing_type } = data;
    const { Charge } = resources;

    const chargeData = {
      name: product.name,
      description: product.description,
      pricing_type,
      local_price: {
        amount: product.price,
        currency: product.currency,
      },
      metadata,
    };

    const charge = await Charge.create(chargeData);
    this.reply('payment_intent', charge, EVENT_PREFIX);

    return charge;
  }

  async handleWebhook(rawBody: any, signature: string, EVENT_PREFIX: string) {
    const webhookSecret = this.configService.get('COINBASE_SECRET');
    let event: any;

    try {
      event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
    } catch (error) {
      console.log(`⚠️  Webhook signature verification failed.`, error.message);
      return new BadRequestException();
    }

    this.reply('webhook_resp', event, EVENT_PREFIX);
  }

  private reply(event: string, data: any, EVENT_PREFIX: string) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }
}

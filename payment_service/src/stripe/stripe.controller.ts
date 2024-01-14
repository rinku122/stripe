import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';

const EVENT_PREFIX = 'stripe';

@Controller(EVENT_PREFIX)
export class StripeController {
  constructor(
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  reply(event: string, data: any) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }

  @Get()
  getHello() {
    try {
      this.reply('created', { hi: 'Hello there ', service: EVENT_PREFIX });
    } catch (error) {
      console.log(error);
    }
  }

  @EventPattern(`${EVENT_PREFIX}_created`)
  async hello(data: any) {
    console.log(data, EVENT_PREFIX);
  }
}

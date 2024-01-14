import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy, EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    // private readonly appService: AppService,
    @Inject('PRODUCT_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  @EventPattern('product_created')
  async hello(data: any) {
    console.log(data, 'client');
  }

  @Get()
  getHello() {
    this.client.emit('test_created', { hi: 'Hello there ' });
  }
}

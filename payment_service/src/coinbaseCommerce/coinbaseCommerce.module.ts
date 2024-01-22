import { Module } from '@nestjs/common';
import { CoinbaseCommerceController } from './coinbaseCommerce.controller';
import { CoinbaseCommerceService } from './coinbaseCommerce.service';
import { RmqModule } from 'src/rmq';
import { PAYMENT_SERVICE } from 'src/services/services';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [CoinbaseCommerceController],
  providers: [CoinbaseCommerceService],
})
export class CoinbaseCommerceModule {}

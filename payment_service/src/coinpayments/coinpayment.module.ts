import { Module } from '@nestjs/common';
import { CoinpaymentController } from './coinpayment.controller';
import { CoinpaymentService } from './coinpayment.service';
import { RmqModule } from 'src/rmq';
import { PAYMENT_SERVICE } from 'src/services/services';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [CoinpaymentController],
  providers: [CoinpaymentService],
})
export class CoinpaymentModule {}

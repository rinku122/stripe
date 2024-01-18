import { Module } from '@nestjs/common';
import { PhonePayController } from './phonepay.controller';
import { PhonePayService } from './phonepay.service';
import { RmqModule } from 'src/rmq';
import { PAYMENT_SERVICE } from 'src/services/services';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [PhonePayController],
  providers: [PhonePayService],
})
export class PhonepayModule {}

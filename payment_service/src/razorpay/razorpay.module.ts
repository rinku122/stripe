import { Module } from '@nestjs/common';
import { RazorpayController } from './razorpay.controller';
import { RazorpayService } from './razorpay.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqModule } from 'src/rmq';
import { PAYMENT_SERVICE } from 'src/services/services';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [RazorpayController],
  providers: [RazorpayService],
})
export class RazorpayModule {}

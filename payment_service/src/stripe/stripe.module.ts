import { Module } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import { RmqModule } from 'src/rmq';
import { PAYMENT_SERVICE } from 'src/services/services';

@Module({
  imports: [RmqModule.register({ name: PAYMENT_SERVICE })],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}

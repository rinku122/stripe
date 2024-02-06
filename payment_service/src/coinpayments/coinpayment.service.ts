import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';
import { CreatePaymentDto } from './dto/createpayment.dto';
const Coinpayments = require('coinpayments');

@Injectable()
export class CoinpaymentService {
  private readonly coinpayment: any;
  constructor(
    private readonly configService: ConfigService,
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {
    const options = {
      key: this.configService.get('COINPAYMENT_API'),
      secret: this.configService.get('COINPAYMENT_SECRET'),
      // autoIpn: false,
      // ipnTime: 30,
    };
    this.coinpayment = new Coinpayments(options);
  }

  async checkout(body: CreatePaymentDto, EVENT_PREFIX: string) {
    const options = {
      ...body,

      //URL for your IPN callbacks. If not set it will use the IPN URL in your Edit Settings page if you have one set.
      ipn_url: `${this.configService.get('COINPAYMENT_BASE_URL')}/coinpayment/webhook`,

      // Sets a URL to go to if the buyer does complete payment. (Only if you use the returned 'checkout_url', no effect/need if designing your own checkout page.)
      success_url: this.configService.get('SUCCESS_PAGE'),

      //Sets a URL to go to if the buyer does not complete payment. (Only if you use the returned 'checkout_url', no effect/need if designing your own checkout page.)
      cancel_url: this.configService.get('CANCEL_PAGE'),
    };

    const tx = await this.coinpayment.createTransaction(options);
    //The result wil have the following fields:
    // amount = The amount for the buyer to send in the destination currency (currency2).
    // address = The address the buyer needs to send the coins to.
    // dest_tag = The tag buyers need to attach for the payment to complete. (only included for coins that require them such as XRP/XMR/etc.)
    // alt_address = Optional alternate representation of an address such as X-address format for Ripple or legacy V-prefix for Velas EVM.
    // txn_id = The CoinPayments.net payment ID.
    // confirms_needed = The number of confirms needed for the payment to be complete.
    // timeout = How long the buyer has to send the coins and have them be confirmed in seconds.
    // checkout_url = While normally you would be designing the full checkout experience on your site you can use this URL to provide the final payment page to the buyer.
    // status_url = A longer-term URL where the buyer can view the payment status and leave feedback for you. This would typically be emailed to the buyer.
    // qrcode_url = A URL to a QR code you can display for buyer's paying with a QR supporting wallet.

    //Example

    //   {
    //     "error":"ok",
    //     "result":{
    //        "amount":"1.00000000",
    //        "address":"ZZZ",
    //        "dest_tag":"YYY",
    //        "txn_id":"XXX",
    //        "confirms_needed":"10",
    //        "timeout":9000,
    //        "checkout_url":"https:\/\/www.coinpayments.net\/index.php?cmd=checkout&id=XXX&key=ZZZ"
    //        "status_url":"https:\/\/www.coinpayments.net\/index.php?cmd=status&id=XXX&key=ZZZ"
    //        "qrcode_url":"https:\/\/www.coinpayments.net\/qrgen.php?id=XXX&key=ZZZ"
    //     }
    //  }

    this.reply('payment_intent', tx, EVENT_PREFIX);
    return tx;
  }

  // async handleWebhook(rawBody: any, signature: string, EVENT_PREFIX: string) {
  //   const webhookSecret = this.configService.get('COINBASE_SECRET');
  //   let event: any;

  //   try {
  //     event = Webhook.verifyEventBody(rawBody, signature, webhookSecret);
  //   } catch (error) {
  //     console.log(`⚠️  Webhook signature verification failed.`, error.message);
  //     return new BadRequestException();
  //   }

  //   this.reply('webhook_resp', event, EVENT_PREFIX);
  // }

  private reply(event: string, data: any, EVENT_PREFIX: string) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }
}

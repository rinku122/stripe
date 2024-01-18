import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';
const crypto = require('crypto');
import axios from 'axios';

// import Stripe from 'stripe';

@Injectable()
export class PhonePayService {
  // private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async checkout() {
    const body = {
      name: 'Waleed',
      amount: 1,
      number: '7498608775',
      MUID: 'MUID' + Date.now(),
      transactionId: 'T' + Date.now(),
    };

    const merchantTransactionId = body.transactionId;
    const data = {
      merchantId: this.configService.get('MERCHANT_ID'),
      merchantTransactionId: merchantTransactionId,
      merchantUserId: body.MUID,
      name: body.name,
      amount: body.amount * 100,
      redirectUrl: `http://localhost:8001/phonepay/status/${merchantTransactionId}`,
      redirectMode: 'POST',
      mobileNumber: body.number,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const payload = JSON.stringify(data);

    const payloadMain = Buffer.from(payload).toString('base64');

    const keyIndex = 1;
    const string =
      payloadMain + '/pg/v1/pay' + this.configService.get('SALTKEY');
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + '###' + keyIndex;
    const UAT_URL = `${this.configService.get('PHONEPE_URL')}pay`;
    const options = {
      method: 'POST',
      url: UAT_URL,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
      },
      data: {
        request: payloadMain,
      },
    };

    const res = await axios(options);
    return { url: res.data.data.instrumentResponse.redirectInfo.url };
  }

  private reply(event: string, data: any, EVENT_PREFIX: string) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }

  async checkStatus(merchantTransactionId: string, EVENT_PREFIX: string) {
    const keyIndex = 1;
    const merchantId = this.configService.get('MERCHANT_ID');

    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` +
      this.configService.get('SALTKEY');

    const sha256 = crypto.createHash('sha256').update(string).digest('hex');

    const checksum = sha256 + '###' + keyIndex;

    const options = {
      method: 'GET',
      url: `${this.configService.get('PHONEPE_URL')}status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`,
      },
    };

    const res = await axios(options);
    this.reply('webhook_resp', res.data, EVENT_PREFIX);
    // if (res.data.success === true) {
    //   console.log(res.data);
    //   return { success: true, message: 'Payment Success' };
    // } else {
    //   return { success: false, message: 'Payment Failure' };
    // }
  }
}

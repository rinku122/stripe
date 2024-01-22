import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
const crypto = require('crypto');
import axios from 'axios';
import { lastValueFrom } from 'rxjs';
import { PAYMENT_SERVICE } from 'src/services/services';

@Injectable()
export class PhonePayService {
  constructor(
    private readonly configService: ConfigService,
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async checkout(body: any, EVENT_PREFIX: string) {
    const merchantTransactionId = body.transactionId;
    const data = {
      merchantId: this.configService.get('MERCHANT_ID'),
      merchantTransactionId: merchantTransactionId,
      merchantUserId: body.MUID,
      name: body.name,
      amount: body.amount,
      redirectUrl: `${this.configService.get('BASE_URL')}/phonepay/webhook`,
      redirectMode: 'POST',
      mobileNumber: body.number,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    };

    const payload = JSON.stringify(data);

    const payloadMain = Buffer.from(payload).toString('base64');

    const keyIndex = this.configService.get('KEY_INDEX');
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

    // console.log(body.amount);
    // console.log(res.data.data.merchantTransactionId);

    this.reply('payment_intent', res.data, EVENT_PREFIX);
    return { url: res.data.data.instrumentResponse.redirectInfo.url };
  }

  async webhook(
    body: any,
    res: any,
    EVENT_PREFIX: string,
    isWebHook: boolean = true,
  ) {
    //Check for transaction id and amount

    const { merchantId, transactionId, amount } = body;

    const merchantIdSafe = this.configService.get('MERCHANT_ID');

    const safeAmount = await lastValueFrom(
      this.client.send(`${EVENT_PREFIX}_validate`, transactionId),
    );
    if (!safeAmount || amount !== safeAmount || merchantIdSafe !== merchantId)
      throw new BadRequestException();

    const keyIndex = this.configService.get('KEY_INDEX');

    const string =
      `/pg/v1/status/${merchantId}/${transactionId}` +
      this.configService.get('SALTKEY');

    const sha256 = crypto.createHash('sha256').update(string).digest('hex');

    const checksum = sha256 + '###' + keyIndex;

    const options = {
      method: 'GET',
      url: `${this.configService.get('PHONEPE_URL')}status/${merchantId}/${transactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': `${merchantId}`,
      },
    };

    try {
      const response = await axios(options);
      // Incase of success redirect user to success page
      if (isWebHook) {
        if (response?.data?.code === 'PAYMENT_SUCCESS') {
          res.redirect(this.configService.get('SUCCESS_PAGE'));
        } else {
          // Otherthen success it can be pending of failed, so taking user to another page.
          res.redirect(this.configService.get('CANCEL_PAGE'));
        }
        //  Sending respone of payment to client service.
        this.reply('webhook_resp', response.data, EVENT_PREFIX);
      } else {
        res.json(response.data);
      }
    } catch (error) {
      console.log(error);
      if (!isWebHook) res.json(error);
    }
  }

  private reply(event: string, data: any, EVENT_PREFIX: string) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }
}

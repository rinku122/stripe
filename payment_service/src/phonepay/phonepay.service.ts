import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const crypto = require('crypto');
import axios from 'axios';

@Injectable()
export class PhonePayService {
  constructor(private readonly configService: ConfigService) {}

  async checkout(body: any) {
    const merchantTransactionId = body.transactionId;
    const data = {
      merchantId: this.configService.get('MERCHANT_ID'),
      merchantTransactionId: merchantTransactionId,
      merchantUserId: body.MUID,
      name: body.name,
      amount: body.amount * 100,
      redirectUrl: `${this.configService.get('BASE_URL')}/phonepay/status/${merchantTransactionId}`,
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
    return { url: res.data.data.instrumentResponse.redirectInfo.url };
  }

  async checkStatus(merchantTransactionId: string, res: any) {
    const keyIndex = this.configService.get('KEY_INDEX');
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

    const response = await axios(options);
    if (response.data.success === true) {
      res.redirect(this.configService.get('SUCCESS_PAGE'));
    } else {
      res.redirect(this.configService.get('CANCEL_PAGE'));
    }
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class StripeService {
  async checkout(data: any) {
    console.log('i rann', data);
  }
}

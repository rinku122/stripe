import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SK'));
  }
  async checkout(data: any) {
    const { products } = data;
    console.log(products);
    const lineItems = products.map((product: any) => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: product.dish,
          images: [product.imgdata],
        },
        unit_amount: product.price * 100,
      },
      quantity: product.qnty,
    }));

    console.log(lineItems);

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/sucess',
      cancel_url: 'http://localhost:3000/cancel',
    });

    return { id: session.id };
  }
}

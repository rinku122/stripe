import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from 'src/services/services';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    @Inject(PAYMENT_SERVICE)
    private readonly client: ClientProxy,
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SK'));
  }

  async checkout(data: any, EVENT_PREFIX: string) {
    const { lineItems } = data;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: this.configService.get('SUCCESS_PAGE'),
      cancel_url: this.configService.get('CANCEL_PAGE'),
    });
    this.reply('payment_intent', session, EVENT_PREFIX);
    return { id: session.id };
  }

  async handleWebhook(req: any, signature: string, EVENT_PREFIX: string) {
    const endpointSecret = 'whsec_EZUNR6KrnSwMWKDi68vuv0FyLC9yVd0f'; //Keep this in env.
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(
        req,
        signature,
        endpointSecret,
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return new BadRequestException();
    }

    this.reply('webhook_resp', event, EVENT_PREFIX);

    // switch (event.type) {
    //   case 'payment_intent.succeeded':
    //     console.log(`payment_intent.succeeded : `, event.data.object);
    //     // Then define and call a method to handle the successful payment intent.
    //     // handlePaymentIntentSucceeded(paymentIntent);
    //     break;
    //   case 'payment_method.attached':
    //     // Then define and call a method to handle the successful attachment of a PaymentMethod.
    //     // handlePaymentMethodAttached(paymentMethod);
    //     console.log(`payment_method.attached : `, event.data.object);
    //     break;
    //   case 'checkout.session.completed':
    //     console.log(`checkout.session.completed : `, event.data.object);
    //     break;
    //   default:
    //     // Unexpected event type
    //     console.log(`Unhandled event type ${event.type}.`);
    // }

    // Return a 200 response to acknowledge receipt of the event
    return { received: true };
  }

  private reply(event: string, data: any, EVENT_PREFIX: string) {
    this.client.emit(`${EVENT_PREFIX}_${event}`, data);
  }
}

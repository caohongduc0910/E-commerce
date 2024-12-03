import { Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Controller('webhook')
export class StripeController {
  private stripe = new Stripe(process.env.STRIPE_SK);
  constructor(private readonly stripeService: StripeService) {}

  @Post()
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    const signature = req.headers['stripe-signature'];
    const endpointSecret = process.env.WEBHOOK_SC;

    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        endpointSecret,
      );
      await this.stripeService.handleWebHook(event);
    } catch (err) {
      console.error('Webhook signature verification failed.', err.message);
      return;
    }
  }
}

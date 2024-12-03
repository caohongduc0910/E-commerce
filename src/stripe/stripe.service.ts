import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Status } from 'src/enums/status.enum';
import { OrderService } from 'src/orders/order.service';
import { Order } from 'src/orders/schemas/order.schema';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Order.name)
    private orderModel: mongoose.Model<Order>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SK);
  }

  async createCheckoutSession(
    products: any,
    orderId: string,
  ): Promise<Stripe.Checkout.Session> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: products.map((product: any) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.title,
            description: `Category: ${product.category}, Size: ${product.size}, Color: ${product.color}`,
            images: [product.image],
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      })),
      mode: 'payment',
      success_url: `https://domain.com/success?orderId=${orderId}`,
      cancel_url: `https://domain.com/cancel?orderId=${orderId}`,
      metadata: {
        orderId: orderId,
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: 'Standard shipping',
            type: 'fixed_amount',
            fixed_amount: {
              amount: 3000,
              currency: 'usd',
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 5 },
              maximum: { unit: 'business_day', value: 7 },
            },
          },
        },
        {
          shipping_rate_data: {
            display_name: 'Express shipping',
            type: 'fixed_amount',
            fixed_amount: {
              amount: 5000,
              currency: 'usd',
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
    });
    return session;
  }

  async handleWebHook(event: any) {
    switch (event.type) {
      case 'checkout.session.completed':
        const sessionCompleted = event.data.object;
        const id = sessionCompleted.metadata.orderId;
        await this.orderModel.findByIdAndUpdate(id, {
          status: Status.PAID,
        });
        console.log(
          `Checkout Session was completed!`,
          sessionCompleted.metadata,
        );
        break;
      case 'payment_intent.canceled':
        console.log(`PaymentIntent was canceled!`);
        break;
      case 'payment_intent.payment_failed':
        console.log(`PaymentIntent was failed!`);
        break;
      case 'payment_intent.succeeded':
        console.log(`PaymentIntent was successful!`);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }
}

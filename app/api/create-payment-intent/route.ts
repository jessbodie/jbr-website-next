import { NextRequest, NextResponse } from "next/server";
import { Stripe } from "stripe";

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 234,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
        });
        return NextResponse.json({ clientSecret: paymentIntent.client_secret})
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to create PaymentIntent'}, {status: 500});
        }
    }

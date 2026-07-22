import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

const MERCHANT_IDENTIFIER = 'merchant.com.jessbodie.applepay';

export async function POST(request: NextRequest) {
    const { paymentData } = await request.json();

    if (!paymentData) {
        return NextResponse.json({ error: 'Missing paymentData'}, {status: 400});
    }

    const cert = process.env.APPLE_PAY_PAYMENT_PROCESSING_CERT!;
    const key = process.env.APPLE_PAY_PAYMENT_PROCESSING_KEY!;

    console.log('decrypt-token received:', paymentData); 

    return NextResponse.json({ ok: true });
}
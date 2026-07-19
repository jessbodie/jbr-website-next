'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import styles from './page.module.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Inner component - helper, lives inside <Elements>, so it can use Stripe context
function CheckoutButton() {
    const [ready, setReady] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    return (
        <>
        {ready && (
            <>
            <h3 className={styles.subhead}>Apple Pay with Stripe</h3>
            <p className={`${styles.descrip}`}>
                Unlike the Apple Pay button above, this one lets Stripe own the full merchant
        identity — their own Merchant ID, certificate, and merchant validation. Stripe
        decrypts the payment token internally; this page and its server never see the raw
        encrypted payload. This is representative of how Stripe with Apple Pay integrations are built.</p>
            </>
        )}
        <div className={styles.stripeButtonWrap}>
            <ExpressCheckoutElement
                onReady={(event) => {
                    console.log('Stripe ECE ready. Available methods:', event.availablePaymentMethods);
                }}
                onLoadError={(event) => {
                    console.log('ECE Stripe load error:', event);
                }}
                onAvailablePaymentMethodsChange={({ paymentMethods }) => {
                    console.log('available payment methods:', paymentMethods);
                    if (paymentMethods) setReady(true);
                }}
                onConfirm={ async () => {
                    if (!stripe || !elements) return;

                    const { error: submitError } = await elements.submit();
                    if (submitError) {
                        console.log('submit error:', submitError);
                        return;
                    }
                    
                const res = await fetch('/api/create-payment-intent', { method: 'POST' });
                const { clientSecret } = await res.json();

                const { error } = await stripe.confirmPayment({
                    elements,
                    clientSecret,
                    confirmParams: { return_url: 'https://www.jessbodie.com/sandbox'},
                    redirect: 'if_required'
                });

                if (error) {
                    console.log('confirm error:', error);
                } else {
                    console.log('payment succeeded');
                    }
                }} 
            />
        </div>
    </>
    );
}

// Outer component - page imports and renders
export default function StripeApplePay() {
    return (
    <Elements stripe ={stripePromise} options={
        { mode: 'payment', amount: 234, currency: 'usd'}
        }>
        <CheckoutButton />    
    </Elements>
    );
}


'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useState } from 'react';
import styles from './page.module.scss';
import { debug } from './debugLog';

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
                    // Lifecycle only — the widget finished loading. Wallet availability
                    // is reported separately by onAvailablePaymentMethodsChange below.
                    debug.log('stripe', 'info', 'Stripe Express Checkout widget loaded', event.availablePaymentMethods);
                }}
                onLoadError={(event) => {
                    debug.log('stripe', 'error', 'Stripe Express Checkout failed to load', event);
                }}
                onAvailablePaymentMethodsChange={({ paymentMethods }) => {
                    // Stripe reports each wallet separately as { available: boolean }.
                    // List the ones it can actually offer on this browser + device.
                    const available = paymentMethods
                        ? Object.entries(paymentMethods)
                              .filter(([, v]) => v?.available)
                              .map(([name]) => name)
                        : [];
                    if (available.length > 0) {
                        debug.log('stripe', 'info', `Stripe reports available wallet(s): ${available.join(', ')} → showing button`, paymentMethods);
                        setReady(true);
                    } else {
                        debug.log('stripe', 'info', 'Stripe reports no available wallets — Apple Pay, Google Pay, and Link are all unavailable on this browser + device', paymentMethods);
                    }
                }}
                onConfirm={ async () => {
                    if (!stripe || !elements) return;

                    const { error: submitError } = await elements.submit();
                    if (submitError) {
                        debug.log('stripe', 'error', 'Element validation failed (elements.submit)', submitError);
                        return;
                    }

                const res = await fetch('/api/create-payment-intent', { method: 'POST' });
                const { clientSecret } = await res.json();
                debug.log('stripe', 'info', 'POST /api/create-payment-intent → server created a $2.34 PaymentIntent; client secret received');

                debug.log('stripe', 'info', 'stripe.confirmPayment() → Stripe decrypts the token internally; this app never sees the raw payload');
                const { error } = await stripe.confirmPayment({
                    elements,
                    clientSecret,
                    confirmParams: { return_url: 'https://www.jessbodie.com/sandbox'},
                    redirect: 'if_required'
                });

                if (error) {
                    debug.log('stripe', 'error', 'Payment failed: ' + error.message, error);
                } else {
                    debug.log('stripe', 'success', 'Payment succeeded ($2.34 sandbox)');
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


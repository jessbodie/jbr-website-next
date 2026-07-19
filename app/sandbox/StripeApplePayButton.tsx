'use client';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, ExpressCheckoutElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import styles from './page.module.scss';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Inner component - helper, lives inside <Elements>, so it can use Stripe context
function CheckoutButton() {
    const [ready, setReady] = useState(false);

    return (
        <>
        {ready && (
            <p className={`${styles.intro} ${styles.descrip}`}>
                 Unlike the Apple Pay button above, this one lets Stripe own the full merchant
          identity — their own Merchant ID, certificate, and merchant validation. Stripe
          decrypts the payment token internally; this page and its server never see the raw
          encrypted payload. This is representative of how Stripe with Apple Pay integrations are built.</p>
        )}
        <ExpressCheckoutElement
            options={{
                paymentMethods: {
                    applePay: 'auto',
                    googlePay: 'auto',
                    link: 'never',
                    paypal: 'auto',
                    amazonPay: 'never',
    },
  }}
            onAvailablePaymentMethodsChange={({ paymentMethods }) => {
                if (paymentMethods) setReady(true);
            }}
            onConfirm={() => {}} // TODO STEP 6
        />
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


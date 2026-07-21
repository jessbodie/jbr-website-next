'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './page.module.scss';
import { debug } from './debugLog';

async function onApplePayButtonClicked() {
    const paymentRequest: ApplePayJS.ApplePayPaymentRequest ={
        countryCode: 'US',
        currencyCode: 'USD',
        supportedNetworks: ['visa', 'masterCard', 'amex'],
        merchantCapabilities: ['supports3DS'],
        total: {
            label: 'Jess Bodie Richards (Sandbox)',
            amount: '1.23',
        },
    };
    debug.log('direct', 'info', 'Button clicked → building ApplePayPaymentRequest (US · USD · $1.23 · Visa/Mastercard/Amex)', paymentRequest);

    const session = new ApplePaySession(3, paymentRequest);
    debug.log('direct', 'info', 'Created ApplePaySession v3; calling session.begin()');

    session.onvalidatemerchant = async (event) => {
        debug.log('direct', 'info', 'Apple requested merchant validation', { validationURL: event.validationURL });
        debug.log('direct', 'info', 'POST /api/apple-pay/validate-merchant → server does the mTLS handshake with Apple using the Merchant Identity Certificate');
        try {
            const response = await fetch('/api/apple-pay/validate-merchant', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({validationURL: event.validationURL})
            });

            if (!response.ok) {
                throw new Error(`Merchant validation failed: ${response.status}`);
            }

            const merchantSession = await response.json();
            session.completeMerchantValidation(merchantSession);
            debug.log('direct', 'success', 'Merchant validated — sheet presented', merchantSession);
        } catch (err) {
            debug.log('direct', 'error', 'Merchant validation failed → session.abort()', err);
            session.abort();
        }
    }

    session.onpaymentauthorized = (event) => {
        const method = event.payment.token?.paymentMethod;
        debug.log(
            'direct',
            'success',
            `Payment authorized — encrypted EC_v1 token received (network: ${method?.network ?? 'unknown'}, type: ${method?.type ?? 'unknown'})`,
            event.payment,
        );
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
        debug.log('direct', 'info', 'Reported STATUS_SUCCESS. This build does NOT decrypt the token — that is Button 3 (self-decrypt).');
    };

    session.begin();
}


export default function ProcessApplePay() {

    const [canPay, setCanPay] = useState(false);
    const buttonRef = useRef<HTMLElement>(null);

    useEffect(() => {
        // Check if the Apple Pay JS API is available.
        if (window.ApplePaySession) {
            const merchantIdentifier = 'merchant.com.jessbodie.applepay';
            const promise = ApplePaySession.applePayCapabilities(merchantIdentifier);

            promise.then(function(capabilities) {
            // Check if the person has an active payment credential provisioned in Wallet.
            switch (capabilities.paymentCredentialStatus) {
                case "paymentCredentialsAvailable":
                    // Display an Apple Pay button and offer Apple Pay as the primary payment option.
                    debug.log('direct', 'info', 'Capability check → paymentCredentialsAvailable: active card in Wallet, showing button', capabilities);
                    setCanPay(true);
                    break;
                case "paymentCredentialStatusUnknown":
                    // Display an Apple Pay button and offer Apple Pay as a payment option.
                    debug.log('direct', 'info', 'Capability check → paymentCredentialStatusUnknown: status unknown, showing button anyway', capabilities);
                    setCanPay(true);
                    break;
                case "paymentCredentialsUnavailable":
                    // Consider displaying an Apple Pay button.
                    debug.log('direct', 'info', 'Capability check → paymentCredentialsUnavailable: no card provisioned, still showing button', capabilities);
                    setCanPay(true);
                    break;
                case "applePayUnsupported":
                    debug.log('direct', 'info', 'Capability check → applePayUnsupported: device/browser cannot use Apple Pay, button hidden', capabilities);
                    setCanPay(false);
                    break;
                }
            }).catch(function(err) {
                debug.log('direct', 'error', 'Capability check failed (applePayCapabilities rejected) — button hidden', err);
            });
        } else {
            // Most common "not available" case: the Apple Pay JS API isn't present at
            // all (any non-Safari browser, or a non-Apple device). Nothing above runs.
            debug.log('direct', 'info', 'Apple Pay unavailable — window.ApplePaySession is undefined. Apple Pay on the web requires Safari on Apple hardware (iPhone/iPad/Mac). Button hidden.');
        }
    }, []);

    useEffect(() => {
        const button = buttonRef.current;
        if (canPay && button) {
            button.addEventListener('click', onApplePayButtonClicked);
            return () => button.removeEventListener('click', onApplePayButtonClicked);
        }
    }, [canPay]);

    if (canPay) {
       return (
        <>
        <h3 className={styles.subhead}>Apple Pay (Direct)</h3>
        <p className={`${styles.descrip}`}>
        This button integrates Apple Pay directly, without a payment processor in between. This page owns the full merchant identity including my Merchant ID and certificate. The server performs merchant validation itself and the encrypted payment token is returned straight to this app, where a real integration would decrypt it server-side using the payment processing certificate. </p>
        <apple-pay-button 
            ref={buttonRef}
            buttonstyle="black" 
            type="tip" 
            className={styles.applePayButton}></apple-pay-button>
        </>
        )}
    else {
        return null
    }
}

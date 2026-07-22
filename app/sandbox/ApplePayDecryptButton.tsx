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
    debug.log('decrypt', 'info', 'Button clicked → building ApplePayPaymentRequest (US · USD · $1.23 · Visa/Mastercard/Amex)', paymentRequest);

    const session = new ApplePaySession(3, paymentRequest);
    debug.log('decrypt', 'info', 'Created ApplePaySession v3; calling session.begin()');

    session.onvalidatemerchant = async (event) => {
        debug.log('decrypt', 'info', 'Apple requested merchant validation', { validationURL: event.validationURL });
        debug.log('decrypt', 'info', 'POST /api/apple-pay/validate-merchant → server does the mTLS handshake with Apple using the Merchant Identity Certificate');
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
            debug.log('decrypt', 'success', 'Merchant validated — sheet presented', merchantSession);
        } catch (err) {
            debug.log('decrypt', 'error', 'Merchant validation failed → session.abort()', err);
            session.abort();
        }
    }

    session.onpaymentauthorized = async (event) => {
        debug.log('decrypt', 'info', 'Apple requested payment authorization', { paymentData: event.payment.token.paymentData });
        debug.log('decrypt', 'info', 'POST /api/apple-pay/decrypt-token → server decrypts the token locally with the Payment Processing Certificate\'s private key (no call to Apple)');

        try {
            const response = await fetch('/api/apple-pay/decrypt-token', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({paymentData: event.payment.token.paymentData})
            });

            if (!response.ok) {
                throw new Error(`Payment authorization failed: ${response.status}`);
            }

            const decryptResult  = await response.json();
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
            debug.log('decrypt', 'success', 'Payment authorization — sheet dismissed', decryptResult); 
        } catch (err) {
            debug.log('decrypt', 'error', 'Payment authorization failed → ApplePaySession.STATUS_FAILURE', err);
            session.completePayment(ApplePaySession.STATUS_FAILURE);
        }
    }
    session.begin();
}


export default function ProcessApplePayDecrypt() {

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
                    debug.log('decrypt', 'info', 'Capability check → paymentCredentialsAvailable: active card in Wallet, showing button', capabilities);
                    setCanPay(true);
                    break;
                case "paymentCredentialStatusUnknown":
                    // Display an Apple Pay button and offer Apple Pay as a payment option.
                    debug.log('decrypt', 'info', 'Capability check → paymentCredentialStatusUnknown: status unknown, showing button anyway', capabilities);
                    setCanPay(true);
                    break;
                case "paymentCredentialsUnavailable":
                    // Consider displaying an Apple Pay button.
                    debug.log('decrypt', 'info', 'Capability check → paymentCredentialsUnavailable: no card provisioned, still showing button', capabilities);
                    setCanPay(true);
                    break;
                case "applePayUnsupported":
                    debug.log('decrypt', 'info', 'Capability check → applePayUnsupported: device/browser cannot use Apple Pay, button hidden', capabilities);
                    setCanPay(false);
                    break;
                }
            }).catch(function(err) {
                debug.log('decrypt', 'error', 'Capability check failed (applePayCapabilities rejected) — button hidden', err);
            });
        } else {
            // Most common "not available" case: the Apple Pay JS API isn't present at
            // all (any non-Safari browser, or a non-Apple device). Nothing above runs.
            debug.log('decrypt', 'info', 'Apple Pay unavailable — window.ApplePaySession is undefined. Apple Pay on the web requires Safari on Apple hardware (iPhone/iPad/Mac). Button hidden.');
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
        <h3 className={styles.subhead}>Apple Pay Direct (Self-Decrypt)</h3>
        <p className={`${styles.descrip}`}>
        This button picks up where Apple Pay (Direct) leaves off. It uses the same direct integration — my own Merchant ID, certificate, and server-side merchant validation, with no payment processor in between — but instead of discarding the encrypted payment token, the server decrypts it itself using the Payment Processing Certificate. This is the work a processor like Stripe does out of sight: unwrapping Apple's encrypted token to the underlying card and transaction data. It runs in the sandbox only — the decrypted result is logged server-side and nothing is ever charged.
        </p>
        <apple-pay-button 
            ref={buttonRef}
            buttonstyle="black" 
            type="plain" 
            className={styles.applePayButton}></apple-pay-button>
        </>
        )}
    else {
        return null
    }
}

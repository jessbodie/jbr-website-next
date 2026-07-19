'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './page.module.scss';

async function onApplePayButtonClicked() {
    console.log('button clicked');
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
    console.log(paymentRequest);

    const session = new ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = async (event) => {
        console.log(event.validationURL);
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
            console.log(merchantSession);
        } catch (err) {
            console.log(err);
            session.abort();
        }
    }

    session.onpaymentauthorized = (event) => {
        console.log(event.payment);        
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
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
            console.log(capabilities);
            // Check if the person has an active payment credential provisioned in Wallet.
            switch (capabilities.paymentCredentialStatus) {
                case "paymentCredentialsAvailable":
                    // Display an Apple Pay button and offer Apple Pay as the primary payment option. 
                    setCanPay(true);
                    break;
                case "paymentCredentialStatusUnknown":
                    // Display an Apple Pay button and offer Apple Pay as a payment option.
                    setCanPay(true);
                    break;
                case "paymentCredentialsUnavailable":
                    // Consider displaying an Apple Pay button.
                    setCanPay(true);
                    break;
                case "applePayUnsupported":
                    setCanPay(false);
                    break;
                }
            })
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

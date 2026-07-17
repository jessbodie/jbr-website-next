'use client';

import { useEffect, useState } from 'react';
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

    const session = new ApplePaySession(3, paymentRequest);

    session.onvalidatemerchant = async (event) => {
        try {
            console.log('inside onvalidatemerchant');
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

        } catch (err) {
            console.log(err);
            session.abort();
        }
    }

    session.onpaymentauthorized = () => {
        // TODO, after adding PSP processing
        session.completePayment(ApplePaySession.STATUS_SUCCESS);
    };

    session.begin();
}


export default function ProcessApplePay() {

    const [canPay, setCanPay] = useState(false);

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

    if (canPay) {
       return (<apple-pay-button 
            buttonstyle="black" 
            type="tip" 
            className={styles.applePayButton} 
            onClick={onApplePayButtonClicked}></apple-pay-button>)
        }
    else {
        return null
    }
}

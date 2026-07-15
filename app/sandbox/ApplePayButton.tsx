'use client';

import { useEffect, useState } from 'react';
import styles from './page.module.scss';

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
       return (<apple-pay-button buttonstyle="black" type="tip" className={styles.applePayButton}></apple-pay-button>)
        }
    else {
        return null
    }
}

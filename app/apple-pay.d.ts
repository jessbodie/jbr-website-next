import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'apple-pay-button': DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          buttonstyle?: 'black' | 'white' | 'white-outline';
          type?: 'plain' | 'buy' | 'tip' | 'checkout';
          locale?: string;
        },
        HTMLElement
      >;
    }
  }
}

declare global {
  interface Window {
    ApplePaySession?: typeof ApplePaySession;
  }
}

export {};

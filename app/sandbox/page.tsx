import styles from './page.module.scss';
import Script from 'next/script';

export const metadata = {
  title: 'Sandbox',
};

export default function SandboxPage() {
  return (
    <main>
      <section className={styles.sectionSandbox}>
        <div className={styles.intro}>
          <h1 className="heading-primary">Sandbox</h1>
          <h2 className="heading-tertiary">Apple Pay Web - Test Implementation</h2>
          <p className={styles.notice}>
            Transactions are simulations only. No financial charges will be processed.
          </p>
        </div>

        <apple-pay-button buttonstyle="black" type="tip" className={styles.applePayButton}></apple-pay-button>
        <Script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" strategy="afterInteractive"/>
      </section>
    </main>
  );
}

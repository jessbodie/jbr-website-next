import styles from './page.module.scss';
import Script from 'next/script';
import ApplePayButton from './ApplePayButton';

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

        <Script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" strategy="afterInteractive"/>
        <ApplePayButton />
      </section>
    </main>
  );
}

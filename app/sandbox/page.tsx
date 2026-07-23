import styles from './page.module.scss';
import ApplePayButton from './ApplePayButton';
import ApplePayDecryptButton from './ApplePayDecryptButton';
import StripeApplePay from './StripeApplePayButton';
import DebugPanel from './DebugPanel';

export const metadata = {
  title: 'Sandbox',
};

export default function SandboxPage() {
  return (
    <main>
      <section className={styles.sectionSandbox}>
        <div className={styles.intro}>
          <h1 className="heading-primary">Sandbox</h1>
          <h2 className="heading-tertiary">Apple Pay on the Web - Integration Sandbox</h2>
          <p>
           Payments infrastructure was part of my work at Zip (a BNPL company). This sandbox extends that into Apple Pay on the web across three approaches, from self-owned to delegated: returning the encrypted token, decrypting it myself with my own payment processing certificate, and handing both merchant identity and decryption to a provider (Stripe).
          </p>
          <p className={styles.descrip}>
            Transactions are simulations only. No financial charges will be processed.
          </p>

        <ApplePayButton />

        <ApplePayDecryptButton />

        <StripeApplePay />

        <DebugPanel />

        </div>

      </section>
    </main>
  );
}

import styles from './page.module.scss';
import ApplePayButton from './ApplePayButton';
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
          <h2 className="heading-tertiary">Apple Pay Web - Integration Sandbox</h2>
          <p>
            Payments infrastructure was part of my work at Zip (a BNPL company). This sandbox extends that experience into Apple Pay on the web, comparing two integration models: owning merchant identity and decryption directly, versus delegating both to a payment service provider (Stripe).
          </p>
          <p className={styles.notice}>
            Transactions are simulations only. No financial charges will be processed.
          </p>

        <ApplePayButton />

        <StripeApplePay />

        <DebugPanel />

        </div>

      </section>
    </main>
  );
}

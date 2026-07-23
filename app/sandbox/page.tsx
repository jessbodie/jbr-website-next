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
        <div>
          <h1 className="heading-primary">Sandbox</h1>
          <h2 className="heading-tertiary">Apple Pay on the Web <br/> Integration Sandbox</h2>
          <p className={styles.intro}>
           Payments infrastructure was part of my work at Zip (a BNPL company). This sandbox extends that into three approaches to Apple Pay on the web, from fully self-owned to fully delegated.
          </p>
          <p className={styles.disclaimer}>
            Transactions are simulations only. <br/>
            No financial charges will be processed.
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

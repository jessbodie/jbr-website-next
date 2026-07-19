import styles from './page.module.scss';
import ApplePayButton from './ApplePayButton';
import StripeApplePay from './StripeApplePayButton';

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

        <h3 className={styles.subhead}>Apple Pay</h3>
        <ApplePayButton />

        <StripeApplePay />

        </div>

      </section>
    </main>
  );
}

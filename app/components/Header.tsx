import Link from 'next/link';
import styles from './Header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logoNav}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoText}>JBR</Link>
        </div>
        <nav className={styles.nav}>
          <div className={styles.navLink}>
            <Link href="/projects" className={styles.navLinkText}>projects</Link>
          </div>
          <div className={styles.navLink}>
            <Link href="/about" className={styles.navLinkText}>about</Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

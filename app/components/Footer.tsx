import Image from 'next/image';
import styles from './Footer.module.scss';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="row">
        <div className={styles.bgImage}>&nbsp;</div>
        <ul className={styles.links}>
          <li className={styles.linksItem}>
            <span className={styles.linksItemText}>
              <a href="mailto:jessbodie@gmail.com?subject=Yo!">@</a>
            </span>
          </li>
          <li className={styles.linksItem}>
            <a href="https://www.linkedin.com/in/jessbodie/" target="_blank" rel="noopener noreferrer">
              <Image
                src="/vendor/img/LinkedIn/Screen/White/In-White-66px-TM.png"
                alt="Jess on LinkedIn"
                width={35}
                height={35}
              />
            </a>
          </li>
          <li className={styles.linksItem}>
            <a href="https://github.com/jessbodie" target="_blank" rel="noopener noreferrer">
              <Image
                src="/vendor/img/GitHub-Mark/PNG/GitHub-Mark-Light-64px.png"
                alt="Jess on GitHub"
                width={35}
                height={35}
              />
            </a>
          </li>
        </ul>
        <div className={styles.copyright}>
          &copy; {new Date().getFullYear()} Jess Bodie Richards. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

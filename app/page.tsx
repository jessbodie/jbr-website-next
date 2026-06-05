import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.scss';
import HeroGreeting from './HeroGreeting';

export default function Home() {
  return (
    <main>
      <section className={styles.sectionHero}>
        <div className="row u-height-100">
          <div className={styles.hero}>
            <div className={styles.heroImage}></div>
            <div className={styles.heroText}>
              <HeroGreeting />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionHaiku}>
        <div className="row u-margin-top-med">
          <div className={styles.haiku}>
            <div className={styles.haikuHeader}>
              <div className={styles.haikuHeaderRotate}>
                <h2 className={`heading-secondary ${styles.haikuHeaderTop}`}>quest</h2>
              </div>
            </div>
            <div className={styles.haikuText}>
              <p className={styles.haikuTextSingle}>join me. watt by watt,</p>
              <p className={styles.haikuTextSingle}>we&apos;ll leverage tech to deploy</p>
              <p className={styles.haikuTextSingle}>green solutions, now.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionPurpose}>
        <div className="row">
          <div className={styles.purpose}>
            <figure className={styles.purposeImage}>
              <Image
                src="/img/rain_garden_front2.jpg"
                alt="Alternative ground coverings in my front garden"
                fill
                style={{ objectFit: 'cover' }}
              />
            </figure>
            <div className={styles.purposeText}>
              <p>
                In response to local flash flooding, I designed and built urban residential rain gardens to manage stormwater runoff. 
                I also created a{' '}
                <a
                  href="https://app.hex.tech/22816b08-0e6f-4dd8-8bc7-fda1c98d25d4/app/f0ab67e7-2431-42fe-a98c-4805f6071d74/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Rain Garden Calculator in Python
                </a>
                {' '}to help others do the same. 
              </p>
              <p>
                <br />
                Check out my{' '}
                <Link href="/projects">other recent projects</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

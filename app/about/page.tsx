import Image from 'next/image';
import styles from './page.module.scss';
import CaptionGenerator from './CaptionGenerator';
import DragAndDrop from './DragAndDrop';

export const metadata = {
  title: 'Jess Bodie Richards - About',
};

export default function AboutPage() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.sectionHeroAbout}>
        <div className="row u-height-100">
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <h1 className="heading-primary">
                <span className={styles.heroText2nd}>about</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* The Obligatory */}
      <section className={styles.sectionObligatory}>
        <div className="row u-margin-bottom-med u-margin-top-med">
          <div className={styles.obligatory}>

            <div className={styles.obligatoryImage}>
              <figure>
                <div className={styles.obligatoryImageOnly}>
                  <Image
                    className={styles.obligatoryImageCrazy}
                    src="/img/profile_janice.jpg"
                    alt="My Alter Ego"
                    width={320}
                    height={400}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div className="captions">
                  <figcaption>
                    <CaptionGenerator />
                  </figcaption>
                </div>
              </figure>
            </div>

            <div className={styles.obligatoryText}>
              <div className={styles.obligatoryTextWrapper}>
                <h3 className="heading-tertiary">Serenity Now</h3>
                <p className="obligatory__text-single">
                  After years of product/project management{' '}
                  <a href="https://www.linkedin.com/in/jessbodie/" target="_blank" rel="noopener noreferrer">
                    experience
                  </a>
                  , I am focusing on meaningful, impactful projects that align with my passions.
                </p>
              </div>
              <div className={styles.obligatoryTextWrapper}>
                <h3 className="heading-tertiary">Airing of Grievances</h3>
                <p className="obligatory__text-single">
                  Why can&apos;t I eat the chocolate chip oatmeal and walnut cookies from Bread Alone
                  for every meal? Why can&apos;t I sleep on a bed of these cookies? Bathe in them?
                </p>
              </div>
              <div className={styles.obligatoryTextWrapper}>
                <h3 className="heading-tertiary" draggable>Festivus Miracle</h3>
                <p className="obligatory__text-single">
                  Every single night, PBS NewsHour beams a fantastic news program into my living
                  room! It isn&apos;t sexy but it sure is fantastic!
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Many Hats — drag and drop */}
      <section className={styles.sectionDnD}>
        <div className="row u-margin-bottom-med" >
          <DragAndDrop />
        </div>
      </section>

    </main>
  );
}

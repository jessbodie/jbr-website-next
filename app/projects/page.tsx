import Image from 'next/image';
import styles from './page.module.scss';
import ProjectsList from './ProjectsList';
import projectsData from './data/projects_list.json';
import SprigScript from '../components/SprigScript';

export const metadata = {
  title: 'Jess Bodie Richards - Projects',
};

export default function ProjectsPage() {
  return (
    <main>
      {/* Hero */}
      <section className={styles.sectionHeroTextOnly}>
        <div className="row u-height-100">
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <h1 className="heading-primary">
                <span className={styles.heroText1st}>projects</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* Climate projects — hardcoded */}
      <section className={styles.sectionObligatory}>
        <div className="obligatory__text-label u-margin-top-med" style={{ marginLeft: '4rem' }}>
          <h2 className="heading-secondary">Climate</h2>
        </div>

        <div className="row u-margin-top-sm">
          <div className={styles.obligatoryListing}>
            <Image
              className={styles.obligatoryImageThumb}
              src="/img/projects/proj_shades2.png"
              alt="Windows with Blinds"
              width={200}
              height={150}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.obligatoryListingBlurb}>
              <div className="heading-tertiary">
                <a
                  href="https://app.hex.tech/22816b08-0e6f-4dd8-8bc7-fda1c98d25d4/app/dac917e3-bc06-472a-a214-167419a9fa8c/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Throw No Shade: Closed Blinds Lower Temperatures
                </a>
              </div>
              <div className={styles.obligatoryTextDate}>(Summer 2024)</div>
              <p className={styles.obligatoryTextMulti}>
                Have you ever wondered if closing your shades during those hot summer days actually
                matters? It does! Using Python, Arduino sensors, and Open-Meteo data, I quantified
                how much closing your shades cools your home. Check out my analysis in this{' '}
                <a
                  href="https://app.hex.tech/22816b08-0e6f-4dd8-8bc7-fda1c98d25d4/app/dac917e3-bc06-472a-a214-167419a9fa8c/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hex Notebook
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="row u-margin-top-sm">
          <div className={styles.obligatoryListing}>
            <Image
              className={styles.obligatoryImageThumb}
              src="/img/projects/proj_BA_electricity_lines.png"
              alt="Power Lines"
              width={200}
              height={150}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.obligatoryListingBlurb}>
              <div className="heading-tertiary">
                <a
                  href="https://app.hex.tech/22816b08-0e6f-4dd8-8bc7-fda1c98d25d4/app/ede39a0b-fd2b-4797-9189-cd550c1c5dd1/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Sparking Insights: Electricity Demand and Generation
                </a>
              </div>
              <div className={styles.obligatoryTextDate}>(Summer 2024)</div>
              <p className={styles.obligatoryTextMulti}>
                What&apos;s charging up your home? Using Python, I analyzed where a home&apos;s
                electricity really comes from. Explore your Balancing Authority&apos;s energy mix
                in this{' '}
                <a
                  href="https://app.hex.tech/22816b08-0e6f-4dd8-8bc7-fda1c98d25d4/app/ede39a0b-fd2b-4797-9189-cd550c1c5dd1/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Hex Notebook
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="row u-margin-top-sm">
          <div className={styles.obligatoryListing}>
            <Image
              className={styles.obligatoryImageThumb}
              src="/img/projects/proj_raingarden_sm.jpg"
              alt="Small Urban Rain Garden"
              width={200}
              height={150}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.obligatoryListingBlurb}>
              <div className="heading-tertiary">
                <a
                  href="https://app.hex.tech/22816b08-0e6f-4dd8-8bc7-fda1c98d25d4/app/f0ab67e7-2431-42fe-a98c-4805f6071d74/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DIY Rain Garden Calculator
                </a>
              </div>
              <div className={styles.obligatoryTextDate}>(Fall 2024)</div>
              <p className={styles.obligatoryTextMulti}>
                Ready to be a climate hero in your own backyard? Use the{' '}
                <a
                  href="https://app.hex.tech/22816b08-0e6f-4dd8-8bc7-fda1c98d25d4/app/f0ab67e7-2431-42fe-a98c-4805f6071d74/latest"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  DIY Rain Garden Calculator
                </a>{' '}
                to design a beautiful landscape feature that protects your property from flooding.
                Take a look at my{' '}
                <a
                  href="https://www.instagram.com/p/DBfTURIxyaA/?img_index=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  just launched rain garden
                </a>{' '}
                to see this green tech in action.
              </p>
            </div>
          </div>
        </div>

        <div className="row u-margin-top-sm">
          <div className={styles.obligatoryListing}>
            <Image
              className={styles.obligatoryImageThumb}
              src="/img/projects/proj_nograss.png"
              alt="Project Just Say No to Grass"
              width={200}
              height={150}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.obligatoryListingBlurb}>
              <div className="heading-tertiary">
                <a
                  href="https://www.instagram.com/sustainable.urban.gardening/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Tearing Up the Turf
                </a>
              </div>
              <div className={styles.obligatoryTextDate}>(Spring 2023 - present)</div>
              <p className={styles.obligatoryTextMulti}>
                Replacing turf lawn with more sustainable alternative ground covers is my current
                fascination. I am documenting my progress{' '}
                <a
                  href="https://www.instagram.com/sustainable.urban.gardening/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @sustainable.urban.gardening
                </a>
                .
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginLeft: '4rem', marginTop: '3rem' }}>
          <h2 className="heading-secondary">Professional Highlights</h2>
        </div>
      </section>

      {/* JSON-driven interactive project list — Professional Highlights */}
      <ProjectsList projects={projectsData.filter(p => [-1, 5, 6, 7, 8, 9, 10, 11].includes(p.id))} />

      {/* Don't Poke Your Eye Out section */}
      <section className={styles.sectionObligatory}>
        <div className="obligatory__text-label u-margin-top-med" style={{ marginLeft: '4rem' }}>
          <h2 className="heading-secondary">Fun & Games</h2>
        </div>

        <div className="row u-margin-top-sm" style={{ marginLeft: '4rem' }}>
          <p>Developed with JavaScript, SASS, CSS.</p>
        </div>

        {projectsData
          .filter(p => [1, 0, 2, 3].includes(p.id))
          .sort((a, b) => [1, 0, 2, 3].indexOf(a.id) - [1, 0, 2, 3].indexOf(b.id))
          .map(project => (
            <div className="row u-margin-top-sm" key={project.id}>
              <div className={styles.obligatoryListing}>
                <Image
                  className={styles.obligatoryImageThumb}
                  src={`/${project.screenshot}`}
                  alt={project.alt}
                  width={200}
                  height={150}
                  style={{ objectFit: 'cover' }}
                />
                <div className={styles.obligatoryListingBlurb}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: `<div class="heading-tertiary">${project.title}</div>${project.description}`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
      </section>
      {/* Test Sprig Survey */}
      <SprigScript eventName="viewed_projects_page" />
    </main>
  );
}

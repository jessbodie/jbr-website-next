'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.scss';

interface Project {
  id: number;
  title: string;
  link: string;
  label: string;
  screenshot: string;
  alt: string;
  description: string;
}

export default function ProjectsList({ projects }: { projects: Project[] }) {
  const [featuredIndex, setFeaturedIndex] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const featured = featuredIndex !== null ? projects[featuredIndex] : null;
  const hasPrev = featuredIndex !== null && featuredIndex > 0;
  const hasNext = featuredIndex !== null && featuredIndex < projects.length - 1;

  function handleCardClick(index: number) {
    setFeaturedIndex(index);
    setExpandedCard(expandedCard === index ? null : index);
  }

  return (
    <>
      {/* Featured panel — visible on tablet+ via CSS */}
      {featured && (
        <section className={styles.sectionFeatured}>
          <div className="row">
            <div className={styles.listFeatured}>
              <div className={styles.listFeaturedContainer}>
                <button
                  className={styles.listFeaturedPrev}
                  onClick={() => hasPrev && setFeaturedIndex(featuredIndex! - 1)}
                  aria-label="Previous project"
                  style={{ visibility: hasPrev ? 'visible' : 'hidden' }}
                >
                  &#60;
                </button>

                <div className={styles.listFeaturedImage}>
                  <Image
                    src={`/${featured.screenshot}`}
                    alt={featured.alt}
                    width={400}
                    height={300}
                    style={{ objectFit: 'cover', objectPosition: 'top left' }}
                  />
                </div>

                <div
                  className={styles.listFeaturedText}
                  dangerouslySetInnerHTML={{
                    __html: `<h3 class="heading-tertiary">${featured.title}</h3>${featured.description}`,
                  }}
                />

                <button
                  className={styles.listFeaturedNext}
                  onClick={() => hasNext && setFeaturedIndex(featuredIndex! + 1)}
                  aria-label="Next project"
                  style={{ visibility: hasNext ? 'visible' : 'hidden' }}
                >
                  &#62;
                </button>

                <button
                  className={styles.listFeaturedClose}
                  onClick={() => setFeaturedIndex(null)}
                  aria-label="Close featured project"
                >
                  <div className={styles.listFeaturedCloseShape}></div>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Project card grid */}
      <section className={styles.sectionProjects}>
        <div className="row u-margin-bottom-med">
          <div className={styles.list}>
            {projects.map((project, index) => (
              <div className={styles.listContainer} key={project.id}>
                <div
                  className={styles.listContainerImage}
                  onClick={() => handleCardClick(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCardClick(index)}
                >
                  <div className={styles.listContainerHeader}>
                    <div className={styles.listContainerHeaderRotate}>
                      <h2 className="heading-secondary">{project.label}</h2>
                    </div>
                  </div>
                  <Image
                    src={`/${project.screenshot}`}
                    alt={project.alt}
                    fill
                    style={{ objectFit: 'cover', objectPosition: '0% 0%' }}
                    sizes="(max-width: 600px) 100vw, 50vw"
                  />
                </div>

                {/* Mobile: expandable text */}
                <div
                  className={`${styles.listContainerExpand} ${
                    expandedCard === index
                      ? styles.listContainerExpandOpen
                      : styles.listContainerExpandClosed
                  }`}
                >
                  <div
                    className={styles.listContainerText}
                    dangerouslySetInnerHTML={{
                      __html: `<h3 class="heading-tertiary">${project.title}</h3>${project.description}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

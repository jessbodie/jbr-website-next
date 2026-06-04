'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';

export default function HeroGreeting() {
  const [firstDone, setFirstDone] = useState(false);
  const [secondDone, setSecondDone] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFirstDone(true);
      setSecondDone(true);
      return;
    }
    const t1 = setTimeout(() => setFirstDone(true), 3600);  // 600ms delay + 3s anim
    const t2 = setTimeout(() => setSecondDone(true), 4300); // 800ms delay + 3.5s anim
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <h1 className="heading-primary">
      <span className={firstDone ? styles.heroTextFinal : styles.heroText1stHome}>
        {firstDone ? '' : '(^_^)/'}
      </span>
      <span className={secondDone ? styles.heroTextFinal2nd : styles.heroText2ndHome}>
        {secondDone ? 'jess bodie richards' : 'Yoohoooo!'}
      </span>
    </h1>
  );
}

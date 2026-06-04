'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './page.module.scss';

const DEFAULT_CAPTIONS = [
  'J Boh the Damager',
  "If it's going to be that kind of party, I'll stick my thumb in the mashed potatoes!",
  'Jelly beans in the dryer... again!',
  "Happy St. Paddy's Day!",
  'That tea was HOT!',
  'Come on, add something funny, YOU CAN DO IT!',
  'HEY! Keep it PG-13!',
  'All the cool kids are writing their own captions.',
  'Hey, YOU, get in the game! Enter your own caption!',
  'Seriously, I know how creative you are. FEED ME CAPTIONS!',
];

export default function CaptionGenerator() {
  const [captions, setCaptions] = useState(DEFAULT_CAPTIONS);
  const [current, setCurrent] = useState(DEFAULT_CAPTIONS[0]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showRehash, setShowRehash] = useState(false);
  const prevIndexRef = useRef(0);

  const getRand = useCallback((max: number) => {
    let idx: number;
    do { idx = Math.floor(Math.random() * max); } while (idx === prevIndexRef.current && max > 1);
    prevIndexRef.current = idx;
    return idx;
  }, []);

  const cycleCaption = useCallback(() => {
    setCaptions(caps => {
      setCurrent(caps[getRand(caps.length)]);
      return caps;
    });
  }, [getRand]);

  useEffect(() => {
    if (isFocused) return;
    const id = setInterval(cycleCaption, 5000);
    return () => clearInterval(id);
  }, [isFocused, cycleCaption]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = inputValue.trim();
      if (val) {
        setCaptions(prev => [...prev, val]);
        setCurrent(val);
        setShowRehash(true);
      }
      setInputValue('');
      setIsFocused(false);
    }
  }

  return (
    <div className={styles.captionsContainer}>
      <textarea
        className={styles.captionsForm}
        value={isFocused ? inputValue : current}
        onChange={e => setInputValue(e.target.value)}
        onFocus={() => { setIsFocused(true); setInputValue(''); }}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        aria-label="Photo caption — type your own and press Enter"
      />
      {showRehash && (
        <button className={styles.captionsRehash} onClick={cycleCaption}>
          Rehash
        </button>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.scss';

const ROLE_PICS = [
  { id: 'colleague', fileName: 'tina.jpg', altText: 'Liz Lemon (Tina Fey)' },
  { id: 'friend', fileName: 'joan.jpg', altText: 'Permanent BFF (Joan Cusack)' },
  { id: 'mom', fileName: 'lois.jpg', altText: 'Lois Wilkerson (Jane Kaczmarek)' },
  { id: 'wife', fileName: 'courtney.jpg', altText: 'Courtney Love' },
  { id: 'daughter', fileName: 'marcia.jpg', altText: 'Marcia Brady (Maureen McCormick)' },
] as const;

const BOWIE = { id: null, fileName: 'bowie_you_awesome.gif', altText: 'David Bowie thinks you are awesome!' };

const DROP_ZONES = [
  { id: 'colleague', label: 'Colleague' },
  { id: 'mom', label: 'Mom' },
  { id: 'wife', label: 'Wife' },
  { id: 'friend', label: 'Friend' },
  { id: 'daughter', label: 'Daughter, Sister' },
] as const;

type ZoneId = typeof DROP_ZONES[number]['id'];

export default function DragAndDrop() {
  const [remaining, setRemaining] = useState<typeof ROLE_PICS[number][]>([...ROLE_PICS]);
  const [matched, setMatched] = useState<Partial<Record<ZoneId, string>>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const current = remaining[0] ?? BOWIE;
  const isDone = remaining.length === 0;

  function handleDragStart(e: React.DragEvent) {
    setDragId(current.id);
    e.dataTransfer.setData('text', current.id ?? '');
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleDrop(e: React.DragEvent, zoneId: ZoneId) {
    e.preventDefault();
    setActiveZone(null);
    if (zoneId === dragId && remaining[0]) {
      setMatched(prev => ({ ...prev, [zoneId]: remaining[0].fileName }));
      setRemaining(prev => prev.slice(1));
    }
  }

  return (
    <div className={styles.dnd}>
      <div className={styles.dndToDrag}>
        <h3 className="heading-tertiary">Many Hats</h3>
        {!isDone && (
          <p className="obligatory__text-single">Drag the photo to the corresponding role.</p>
        )}
        <figure
          className={styles.dndToDragImg}
          draggable={!isDone}
          onDragStart={handleDragStart}
        >
          <Image
            src={`/img/roles/${current.fileName}`}
            alt={current.altText}
            width={300}
            height={300}
            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
            unoptimized={current.fileName.endsWith('.gif')}
          />
        </figure>
      </div>

      <ul className={styles.dndDropZone}>
        {DROP_ZONES.map(zone => (
          <li key={zone.id} className={styles.dndDropZoneWrapper}>
            <figure
              className={`${styles.dndDropZoneDropHere} ${activeZone === zone.id ? styles.dndDropZoneActive : ''}`}
              onDragOver={e => { e.preventDefault(); setActiveZone(zone.id); }}
              onDragEnter={e => { e.preventDefault(); setActiveZone(zone.id); }}
              onDragLeave={() => setActiveZone(null)}
              onDrop={e => handleDrop(e, zone.id)}
            >
              {matched[zone.id] && (
                <Image
                  src={`/img/roles/${matched[zone.id]}`}
                  alt={zone.label}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              )}
            </figure>
            <figcaption>{zone.label}</figcaption>
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { sprig } from '@sprig-technologies/sprig-browser';

export default function SprigScript({ eventName }: { eventName?: string }) {
  useEffect(() => {
    const Sprig = sprig.configure({ environmentId: 'weR-zKIN2yiJ' });
    if (eventName) {
      Sprig.identifyAndTrack({ eventName });
    }
  }, [eventName]);
  return null;
}
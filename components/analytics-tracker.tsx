'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin, auth, or internal routes
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/auth') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_')
    ) {
      return;
    }

    // Avoid duplicate tracking on fast re-renders of the same path
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    // Get or create persistent anonymous visitor ID
    let visitorId = '';
    try {
      visitorId = localStorage.getItem('dct_vid') || '';
      if (!visitorId) {
        visitorId = `v-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
        localStorage.setItem('dct_vid', visitorId);
      }
    } catch {
      visitorId = `v-anon-${Date.now()}`;
    }

    // Determine device
    let device = 'desktop';
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent || '';
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        device = 'mobile';
      }
    }

    // Determine referrer
    let referrer = 'Direct';
    if (typeof document !== 'undefined' && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.hostname !== window.location.hostname) {
          referrer = refUrl.hostname;
        }
      } catch {
        referrer = 'Web';
      }
    }

    // Fire tracking beacon
    try {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: pathname,
          visitor_id: visitorId,
          device,
          referrer,
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  }, [pathname]);

  return null;
}

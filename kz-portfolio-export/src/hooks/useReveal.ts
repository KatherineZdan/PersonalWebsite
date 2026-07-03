import { useEffect } from 'react';

/**
 * Staggers `.reveal` elements in as they enter the viewport, mirroring the
 * design prototype's motion system but via IntersectionObserver instead of
 * a scroll-position poll.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal:not(.in)'));
    if (els.length === 0) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      els.forEach((el) => el.classList.add('in'));
      return;
    }

    let order = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.animationDelay = `${Math.min(order * 70, 420)}ms`;
          order += 1;
          el.classList.add('in');
          observer.unobserve(el);
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

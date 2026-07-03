import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react';
import { Link, useNavigate, type To } from 'react-router-dom';
import styles from './PaintTransition.module.css';

/**
 * Paint-sweep page transitions. Navigation triggered through
 * `usePaintNavigate` (or `<TransitionLink>`) covers the viewport with
 * staggered bands of paint, swaps the route at full cover, then sweeps
 * the paint off. Reduced-motion users navigate instantly.
 */

const COVER_MS = 580;
const REVEAL_MS = 620;

type Phase = 'idle' | 'cover' | 'reveal';

const PaintNavContext = createContext<(to: To) => void>(() => {});

export function usePaintNavigate() {
  return useContext(PaintNavContext);
}

export function PaintTransitionProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('idle');
  const busy = useRef(false);

  const paintNavigate = useCallback(
    (to: To) => {
      if (busy.current) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        navigate(to);
        window.scrollTo(0, 0);
        return;
      }
      busy.current = true;
      setPhase('cover');
      window.setTimeout(() => {
        navigate(to);
        window.scrollTo(0, 0);
        setPhase('reveal');
        window.setTimeout(() => {
          setPhase('idle');
          busy.current = false;
        }, REVEAL_MS);
      }, COVER_MS);
    },
    [navigate],
  );

  return (
    <PaintNavContext.Provider value={paintNavigate}>
      {children}
      {phase !== 'idle' && (
        <div className={styles.overlay} aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`${styles.band} ${phase === 'cover' ? styles.bandIn : styles.bandOut}`}
              style={{ animationDelay: `${i * 55}ms` }}
              data-band={i}
            />
          ))}
        </div>
      )}
    </PaintNavContext.Provider>
  );
}

type TransitionLinkProps = {
  to: To;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

/** Drop-in replacement for react-router's Link that sweeps paint. */
export function TransitionLink({ to, children, onClick, ...rest }: TransitionLinkProps) {
  const paintNavigate = usePaintNavigate();
  return (
    <Link
      to={to}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        // Let modified clicks (new tab etc.) behave natively.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        paintNavigate(to);
      }}
      {...rest}
    >
      {children}
    </Link>
  );
}

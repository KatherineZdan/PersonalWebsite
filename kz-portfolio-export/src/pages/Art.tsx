import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { useReveal } from '../hooks/useReveal';
import styles from './Art.module.css';

/**
 * To add a piece: drop the photo into kz-portfolio-export/public/art/
 * (e.g. public/art/painting-01.jpg) and set its `src` below to
 * '/art/painting-01.jpg'. Pieces without a `src` render as placeholder
 * canvases until the photo arrives.
 */

type Piece = {
  id: string;
  title: string;
  medium: string;
  year: string;
  ratio: string; // CSS aspect-ratio
  src?: string;
  wash: string; // placeholder background until the photo is added
};

const PAINTINGS: Piece[] = [
  {
    id: 'p1',
    title: 'Untitled I',
    medium: 'Acrylic on canvas',
    year: '—',
    ratio: '4 / 5',
    wash: 'radial-gradient(120% 90% at 20% 15%, rgba(229,72,43,0.5), transparent 55%), radial-gradient(90% 110% at 85% 80%, rgba(201,143,45,0.35), transparent 60%), linear-gradient(160deg, rgba(244,241,234,0.06), rgba(23,21,15,0.4))',
  },
  {
    id: 'p2',
    title: 'Untitled II',
    medium: 'Mixed media on canvas',
    year: '—',
    ratio: '1 / 1',
    wash: 'radial-gradient(100% 80% at 75% 20%, rgba(201,143,45,0.45), transparent 55%), radial-gradient(120% 90% at 15% 85%, rgba(229,72,43,0.3), transparent 50%), linear-gradient(20deg, rgba(58,52,40,0.6), transparent 70%)',
  },
  {
    id: 'p3',
    title: 'Untitled III',
    medium: 'Acrylic on canvas',
    year: '—',
    ratio: '3 / 4',
    wash: 'radial-gradient(140% 100% at 50% 100%, rgba(199,58,32,0.45), transparent 60%), radial-gradient(80% 70% at 80% 10%, rgba(244,241,234,0.12), transparent 55%), linear-gradient(200deg, rgba(155,150,140,0.18), transparent 60%)',
  },
  {
    id: 'p4',
    title: 'Untitled IV',
    medium: 'Mixed media on canvas',
    year: '—',
    ratio: '5 / 4',
    wash: 'radial-gradient(110% 90% at 30% 70%, rgba(229,72,43,0.4), transparent 55%), radial-gradient(90% 80% at 90% 30%, rgba(58,52,40,0.7), transparent 60%), linear-gradient(120deg, rgba(201,143,45,0.22), transparent 65%)',
  },
  {
    id: 'p5',
    title: 'Untitled V',
    medium: 'Acrylic & texture paste',
    year: '—',
    ratio: '4 / 5',
    wash: 'radial-gradient(100% 100% at 60% 40%, rgba(244,241,234,0.14), transparent 55%), radial-gradient(120% 80% at 10% 20%, rgba(199,58,32,0.4), transparent 55%), linear-gradient(300deg, rgba(229,72,43,0.25), transparent 70%)',
  },
  {
    id: 'p6',
    title: 'Untitled VI',
    medium: 'Mixed media on canvas',
    year: '—',
    ratio: '1 / 1',
    wash: 'radial-gradient(90% 90% at 80% 75%, rgba(201,143,45,0.5), transparent 55%), radial-gradient(110% 100% at 25% 25%, rgba(58,52,40,0.65), transparent 65%), linear-gradient(45deg, rgba(229,72,43,0.2), transparent 60%)',
  },
];

const FURNITURE: Piece[] = [
  {
    id: 'f1',
    title: 'Seating study',
    medium: 'Sketches & prototypes',
    year: 'in progress',
    ratio: '4 / 3',
    wash: 'radial-gradient(120% 100% at 70% 30%, rgba(155,150,140,0.25), transparent 60%), linear-gradient(160deg, rgba(58,52,40,0.7), transparent 75%), radial-gradient(80% 80% at 20% 80%, rgba(201,143,45,0.3), transparent 55%)',
  },
  {
    id: 'f2',
    title: 'Joinery explorations',
    medium: 'Form & materials',
    year: 'in progress',
    ratio: '4 / 3',
    wash: 'radial-gradient(100% 90% at 25% 20%, rgba(201,143,45,0.35), transparent 55%), linear-gradient(220deg, rgba(58,52,40,0.65), transparent 70%), radial-gradient(90% 90% at 85% 85%, rgba(229,72,43,0.22), transparent 55%)',
  },
];

function PieceCard({ piece, onOpen }: { piece: Piece; onOpen: (p: Piece) => void }) {
  const clickable = Boolean(piece.src);
  const frame = (
    <>
      <div className={styles.canvasWrap} style={{ aspectRatio: piece.ratio }}>
        {piece.src ? (
          <img src={piece.src} alt={`${piece.title} — ${piece.medium}`} className={styles.photo} />
        ) : (
          <div className={styles.wash} style={{ background: piece.wash }}>
            <span>[ drop art/{piece.id}.jpg ]</span>
          </div>
        )}
      </div>
      <div className={styles.caption}>
        <span className={styles.captionTitle}>{piece.title}</span>
        <span className={styles.captionMeta}>
          {piece.medium} · {piece.year}
        </span>
      </div>
    </>
  );

  return clickable ? (
    <button type="button" className={`${styles.piece} reveal`} onClick={() => onOpen(piece)}>
      {frame}
    </button>
  ) : (
    <div className={`${styles.piece} reveal`}>{frame}</div>
  );
}

export default function Art() {
  useReveal();
  const [open, setOpen] = useState<Piece | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <Layout>
      <div className={`${styles.eyebrow} reveal`}>
        <span className={styles.eyebrowNum}>03</span>
        <span>Art</span>
      </div>

      <div className={styles.pageHead}>
        <h1 className={`${styles.title} reveal`}>
          Texture, layering, and <span className={styles.accent}>happy accidents</span>.
        </h1>
        <p className={`${styles.intro} reveal`}>
          Acrylic and mixed media on canvas — the same instinct for pattern and composition that
          shapes the strategy work, off the clock. Furniture is the next material.
        </p>
      </div>

      <section className={styles.gallerySection}>
        <div className={`${styles.sectionLabel} reveal`}>Paintings — acrylic &amp; mixed media</div>
        <div className={styles.grid}>
          {PAINTINGS.map((p) => (
            <PieceCard key={p.id} piece={p} onOpen={setOpen} />
          ))}
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className={`${styles.sectionLabel} reveal`}>Furniture — studies in progress</div>
        <div className={styles.gridWide}>
          {FURNITURE.map((p) => (
            <PieceCard key={p.id} piece={p} onOpen={setOpen} />
          ))}
        </div>
      </section>

      <p className={`${styles.note} reveal`}>
        Gallery photos are on their way — each canvas above holds a spot for the real piece.
      </p>

      {open && open.src && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          onClick={() => setOpen(null)}
        >
          <img src={open.src} alt={`${open.title} — ${open.medium}`} />
          <div className={styles.lightboxCaption}>
            {open.title} — {open.medium} · {open.year}
          </div>
        </div>
      )}
    </Layout>
  );
}

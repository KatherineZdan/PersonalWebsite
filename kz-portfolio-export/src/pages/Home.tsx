import { useState } from 'react';
import { Layout } from '../components/Layout';
import { PaintCanvas } from '../components/PaintCanvas';
import { TransitionLink } from '../transition/PaintTransition';
import { useClock } from '../hooks/useClock';
import { useReveal } from '../hooks/useReveal';
import styles from './Home.module.css';

const INDEX = [
  {
    n: '01',
    path: '/about',
    title: 'About',
    desc: 'The evidence, the ethics, and the person behind the strategy.',
  },
  {
    n: '02',
    path: '/work',
    title: 'Work',
    desc: 'Selected engagements across retail, CPG, healthcare & finance.',
  },
  {
    n: '03',
    path: '/art',
    title: 'Art',
    desc: 'Acrylic & mixed media on canvas — plus furniture in progress.',
  },
  {
    n: '04',
    path: '/experience',
    title: 'Experience',
    desc: 'Roles, education, and a downloadable CV.',
  },
  {
    n: '05',
    path: '/contact',
    title: 'Contact',
    desc: 'Start a conversation about your next growth question.',
  },
];

export default function Home() {
  const clock = useClock('America/Toronto', 'EST');
  const [settled, setSettled] = useState(false);
  useReveal();

  return (
    <Layout>
      <section className={styles.hero}>
        <PaintCanvas onSettled={() => setSettled(true)} />

        <div className={`${styles.heroContent} ${settled ? styles.heroIn : ''}`}>
          <div className={`${styles.status} ${styles.heroItem}`}>
            <span className={`${styles.dot} pulse`} />
            <span>Senior Consultant — Growth Strategy &amp; Customer Research</span>
          </div>

          <h1 className={`${styles.headline} ${styles.heroItem}`}>
            Turning a fragmented customer, channel &amp; product picture into{' '}
            <span className={styles.accent}>a clear set of choices</span> a business can actually
            execute.
          </h1>

          <div className={`${styles.summaryRow} ${styles.heroItem}`}>
            <p className={styles.summary}>
              I lead consumer-focused strategy engagements for merchants, marketers, and C-suite
              teams across retail, CPG, healthcare, and financial services — pairing qualitative
              human insight with quantitative rigour to inform decisions executives can fund and
              act on.
            </p>
            <div className={styles.facts}>
              <div>
                <div className={styles.factLabel}>Based</div>
                <div>Toronto / Remote</div>
              </div>
              <div>
                <div className={styles.factLabel}>Local time</div>
                <div>{clock}</div>
              </div>
              <div>
                <div className={styles.factLabel}>Status</div>
                <div className={styles.factStatus}>Open to projects</div>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.heroHints} ${settled ? styles.heroIn : ''}`}>
          <span className={styles.heroItem}>[ the paint is still wet — try your cursor ]</span>
          <span className={styles.heroItem}>Scroll ↓</span>
        </div>
      </section>

      <div className={styles.indexWrap}>
        <div className={`${styles.indexHeading} reveal`}>Index</div>
        {INDEX.map((item) => (
          <TransitionLink
            key={item.path}
            to={item.path}
            className={`${styles.indexRow} index-row reveal`}
          >
            <span className={styles.indexNumber}>{item.n}</span>
            <span className={styles.indexTitle}>{item.title}</span>
            <span className={styles.indexDesc}>{item.desc}</span>
            <span className={`${styles.indexArrow} row-arrow`}>↗</span>
          </TransitionLink>
        ))}
      </div>
    </Layout>
  );
}

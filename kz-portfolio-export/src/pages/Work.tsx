import { Layout } from '../components/Layout';
import { TransitionLink } from '../transition/PaintTransition';
import { useReveal } from '../hooks/useReveal';
import styles from './Work.module.css';

const PROJECTS = [
  {
    num: '01',
    sector: 'Retail',
    discipline: 'Growth Strategy',
    year: '2025',
    title: 'Experience-led growth strategy for a national retailer',
    desc: 'Reframed a fragmented store, digital, and omnichannel picture into a single set of growth choices, grounded in fresh customer research across segments and journeys.',
    metric: '$1.8M engagement · executive funding secured',
    shot: '[ strategy artefact ]',
  },
  {
    num: '02',
    sector: 'CPG',
    discipline: 'Go-to-Market',
    year: '2024',
    title: 'Go-to-market and loyalty redesign for a CPG portfolio',
    desc: 'Built the consumer evidence base and operating model for a refreshed loyalty proposition, aligning marketing, product, and channel teams around shared priorities.',
    metric: '12 segments · 3 markets',
    shot: '[ journey map ]',
  },
  {
    num: '03',
    sector: 'Healthcare',
    discipline: 'Service Design',
    year: '2024',
    title: 'Patient-experience service blueprint for a health network',
    desc: 'Mapped the end-to-end patient journey and designed a future-state service blueprint that connected qualitative insight to measurable experience and access outcomes.',
    metric: 'Human-centred · ethics-embedded',
    shot: '[ service blueprint ]',
  },
  {
    num: '04',
    sector: 'Financial Services',
    discipline: 'Customer Strategy',
    year: '2023',
    title: 'Customer strategy and operating-model redesign for a bank',
    desc: 'Turned a complex customer, channel, and product picture into a prioritised set of choices and a redesigned operating model the executive team could fund and execute.',
    metric: '$2M+ programme · delivered end-to-end',
    shot: '[ operating model ]',
  },
  {
    num: '05',
    sector: 'Cross-sector',
    discipline: 'Innovation Strategy',
    year: '2023',
    title: 'Responsible AI innovation framework for customer experiences',
    desc: 'Defined a human-centred framework for adopting AI in customer experiences — embedding ethics, inclusivity, and transparency to anticipate risk and mitigate bias.',
    metric: 'Behavioural science · rapid prototyping',
    shot: '[ framework diagram ]',
  },
];

export default function Work() {
  useReveal();

  return (
    <Layout>
      <div className={styles.pageHead}>
        <div>
          <div className={`${styles.eyebrow} reveal`}>
            <span className={styles.eyebrowNum}>02</span>
            <span>Work</span>
          </div>
          <h1 className={`${styles.title} reveal`}>Selected engagements, end to end.</h1>
        </div>
        <p className={`${styles.intro} reveal`}>
          Representative work across sectors. Each program started with customer evidence and
          ended with funded, executable choices. Detailed case studies available on request.
        </p>
      </div>

      <div className={styles.list}>
        {PROJECTS.map((p) => (
          <TransitionLink key={p.num} to="/contact" className={`${styles.project} reveal`}>
            <span className={styles.projectNum}>{p.num}</span>
            <div className={styles.projectBody}>
              <div>
                <div className={styles.tags}>
                  <span className={styles.tagPill}>{p.sector}</span>
                  <span className={styles.tagPill}>{p.discipline}</span>
                  <span className={styles.tagYear}>{p.year}</span>
                </div>
                <h2 className={styles.projectTitle}>{p.title}</h2>
                <p className={styles.projectDesc}>{p.desc}</p>
                <span className={styles.projectMetric}>{p.metric}</span>
              </div>
              <div className={styles.shotMask}>
                {/* Drop a project visual at public/images/work-01.jpg etc. and
                    replace this placeholder with <img className={styles.shot} … /> */}
                <div className={styles.shot}>
                  <span>{p.shot}</span>
                </div>
              </div>
            </div>
          </TransitionLink>
        ))}
      </div>

      <div className={`${styles.cta} reveal`}>
        <span className={styles.ctaText}>Curious about a specific sector?</span>
        <TransitionLink to="/contact" className={styles.ctaButton}>
          Ask for case studies ↗
        </TransitionLink>
      </div>
    </Layout>
  );
}

import { Layout } from '../components/Layout';
import { TransitionLink } from '../transition/PaintTransition';
import { useReveal } from '../hooks/useReveal';
import styles from './About.module.css';

const SPECIALTIES = [
  'Customer Strategy',
  'Corporate Strategy',
  'Organic Growth Strategy',
  'Market Research',
  'Business Modelling',
  'Go-to-Market Strategy',
  'Innovation Strategy',
  'Design Thinking',
  'Behavioural Science',
  'Marketing',
  'Digital Marketing',
  'Brand Strategy',
  'Human-Centred Design',
  'Business Design',
  'Ethics',
  'Rapid Prototyping',
  'Service Design',
  'Loyalty',
];

const PURSUITS = [
  {
    label: '[ rowing — on the water ]',
    title: 'Rowing',
    desc: 'Early mornings, long pieces, and the discipline of a crew that moves as one.',
    to: null,
  },
  {
    label: '[ acrylic & mixed media ]',
    title: 'Painting',
    desc: 'Acrylic and mixed media on canvas — texture, layering, and happy accidents.',
    to: '/art',
  },
  {
    label: '[ furniture sketch ]',
    title: 'Furniture design',
    desc: 'An aspiring furniture designer — drawn to form, joinery, and objects built to last.',
    to: '/art',
  },
];

export default function About() {
  useReveal();

  return (
    <Layout>
      <div className={`${styles.eyebrow} reveal`}>
        <span className={styles.eyebrowNum}>01</span>
        <span>About</span>
      </div>

      <div className={styles.topGrid}>
        <div>
          <h1 className={`${styles.title} reveal`}>
            I build the case for change on{' '}
            <span className={styles.accent}>real customer evidence</span> — then turn it into
            choices teams can execute.
          </h1>

          <div className={`${styles.body} reveal`}>
            <p>
              My work spans customer and growth strategy, service design, marketing, loyalty, and
              operating-model redesign — connecting qualitative human insight with quantitative
              rigour to inform executive-level decisions.
            </p>
            <p>
              The programs I lead secure executive funding because the case for change is grounded
              in real customer evidence: it moves teams faster and shows measurable impact for the
              business. I&apos;ve scoped, sold, and delivered{' '}
              <strong>$500K–$2M+ engagements end-to-end</strong> across retail, CPG, healthcare,
              and financial services.
            </p>
            <p>
              As AI and emerging technologies reshape customer experiences, I advocate for
              responsible, human-centred innovation — embedding ethics, inclusivity, and
              transparency directly into strategy and design decisions to anticipate risk,
              mitigate bias, and protect long-term value for organizations and the communities
              they serve.
            </p>
          </div>
        </div>

        <figure className={`${styles.portrait} reveal`}>
          {/* Drop a headshot at kz-portfolio-export/public/images/headshot.jpg
              and swap this placeholder for:
              <img src="/images/headshot.jpg" alt="Katherine Zdanowski" /> */}
          <div className={styles.portraitSlot}>
            <span>[ headshot — drop images/headshot.jpg ]</span>
          </div>
          <figcaption className={styles.portraitCaption}>
            <span>FIG. 01 — Katherine Zdanowski</span>
            <span>Toronto</span>
          </figcaption>
        </figure>
      </div>

      <section className={styles.section}>
        <div className={`${styles.sectionLabel} reveal`}>Specialties</div>
        <div className="marquee-mask">
          <div className="marquee">
            {[...SPECIALTIES, ...SPECIALTIES].map((tag, i) => (
              <span key={`${tag}-${i}`} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.sectionLabel} reveal`}>Beyond the work</div>
        <p className={`${styles.sectionLede} reveal`}>
          A practice that runs on craft, materials, and being on the water.
        </p>
        <div className={styles.pursuits}>
          {PURSUITS.map((p) => {
            const card = (
              <>
                <div className={styles.pursuitArt}>
                  <span>{p.label}</span>
                </div>
                <div>
                  <div className={styles.pursuitTitle}>
                    {p.title}
                    {p.to && <span className={`${styles.pursuitArrow} row-arrow`}> ↗</span>}
                  </div>
                  <div className={styles.pursuitDesc}>{p.desc}</div>
                </div>
              </>
            );
            return p.to ? (
              <TransitionLink key={p.title} to={p.to} className={`${styles.pursuit} reveal`}>
                {card}
              </TransitionLink>
            ) : (
              <div key={p.title} className={`${styles.pursuit} reveal`}>
                {card}
              </div>
            );
          })}
        </div>
      </section>
    </Layout>
  );
}

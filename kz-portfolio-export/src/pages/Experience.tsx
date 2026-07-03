import { useEffect, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useReveal } from '../hooks/useReveal';
import styles from './Experience.module.css';

/**
 * Résumé data. Bracketed items are placeholders — fill them in from the
 * real CV. The download button serves kz-portfolio-export/public/resume.pdf;
 * drop the PDF there with that exact name.
 */

const ROLES = [
  {
    dates: '20XX — Present',
    title: 'Senior Consultant — Growth Strategy & Customer Research',
    org: '[ Add firm name ]',
    points: [
      'Lead consumer-focused strategy engagements for merchants, marketers, and C-suite teams across retail, CPG, healthcare, and financial services.',
      'Scope, sell, and deliver $500K–$2M+ engagements end-to-end — from the case for change to a funded, executable set of choices.',
      'Pair qualitative human insight with quantitative rigour to inform executive-level decisions, and embed ethics, inclusivity, and transparency into strategy and design.',
    ],
  },
  {
    dates: '20XX — 20XX',
    title: '[ Previous role title ]',
    org: '[ Add company ]',
    points: ['Add a key responsibility or outcome.', 'Add a measurable result or scope.'],
  },
  {
    dates: '20XX — 20XX',
    title: '[ Earlier role title ]',
    org: '[ Add company ]',
    points: ['Add a key responsibility or outcome.'],
  },
];

const EDUCATION = [
  {
    years: 'Masters',
    degree: 'MA — AI Ethics (New Media & Digital Culture)',
    school: 'University of Amsterdam',
    note: '',
  },
  {
    years: 'Bachelors',
    degree: 'Hon. BA — Digital Enterprise Management Specialist',
    school: 'University of Toronto',
    note: 'High Distinction',
  },
];

const SKILLS = [
  'Customer Strategy',
  'Growth Strategy',
  'Service Design',
  'Market Research',
  'Business Modelling',
  'Behavioural Science',
  'Human-Centred Design',
  'AI Ethics',
  'Operating-Model Redesign',
  'Loyalty',
  'Brand Strategy',
  'Rapid Prototyping',
];

function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = `${to}`;
      return;
    }
    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        observer.disconnect();
        const dur = 1100;
        const t0 = performance.now();
        const step = (t: number) => {
          const k = Math.min((t - t0) / dur, 1);
          el.textContent = `${Math.round(to * (1 - Math.pow(1 - k, 3)))}`;
          if (k < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <>
      <span ref={ref}>0</span>
      {suffix}
    </>
  );
}

export default function Experience() {
  useReveal();

  return (
    <Layout>
      <div className={styles.pageHead}>
        <div>
          <div className={`${styles.eyebrow} reveal`}>
            <span className={styles.eyebrowNum}>04</span>
            <span>Experience</span>
          </div>
          <h1 className={`${styles.title} reveal`}>The résumé.</h1>
        </div>
        <a href="/resume.pdf" download="Katherine-Zdanowski-CV.pdf" className={`${styles.cvButton} reveal`}>
          Download CV (PDF) ↓
        </a>
      </div>

      <div className={styles.columns}>
        <div>
          <div className={`${styles.sectionLabel} reveal`}>Experience</div>
          {ROLES.map((r) => (
            <div key={r.title} className={`${styles.role} reveal`}>
              <div className={styles.roleDates}>{r.dates}</div>
              <div>
                <h3 className={styles.roleTitle}>{r.title}</h3>
                <div className={styles.roleOrg}>{r.org}</div>
                <ul className={styles.rolePoints}>
                  {r.points.map((pt) => (
                    <li key={pt}>
                      <span className={styles.dash}>—</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sidebar}>
          <div>
            <div className={`${styles.sectionLabel} reveal`}>Education</div>
            {EDUCATION.map((e) => (
              <div key={e.degree} className={`${styles.edu} reveal`}>
                <div className={styles.eduYears}>{e.years}</div>
                <h3 className={styles.eduDegree}>{e.degree}</h3>
                <div className={styles.eduSchool}>{e.school}</div>
                {e.note && <div className={styles.eduNote}>{e.note}</div>}
              </div>
            ))}
          </div>

          <div className="reveal">
            <div className={styles.sectionLabel}>Core capabilities</div>
            <div className={styles.skills}>
              {SKILLS.map((s) => (
                <span key={s} className={styles.skill}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className={`${styles.glance} reveal`}>
            <div className={styles.glanceLabel}>At a glance</div>
            <div className={styles.glanceItems}>
              <div>
                <div className={styles.glanceNum}>
                  $<CountUp to={2} />
                  M+
                </div>
                <div className={styles.glanceDesc}>
                  Largest engagement scoped, sold &amp; delivered end-to-end
                </div>
              </div>
              <div className={styles.glanceRule} />
              <div>
                <div className={styles.glanceNum}>
                  <CountUp to={4} /> sectors
                </div>
                <div className={styles.glanceDesc}>
                  Retail · CPG · Healthcare · Financial Services
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

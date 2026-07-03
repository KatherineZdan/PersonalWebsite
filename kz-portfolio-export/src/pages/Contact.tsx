import { Layout } from '../components/Layout';
import { TransitionLink } from '../transition/PaintTransition';
import { useReveal } from '../hooks/useReveal';
import styles from './Contact.module.css';

export default function Contact() {
  useReveal();

  return (
    <Layout>
      <div className={styles.center}>
        <div className={`${styles.eyebrow} reveal`}>
          <span className={styles.eyebrowNum}>05</span>
          <span>Contact</span>
        </div>

        <h1 className={`${styles.title} reveal`}>
          Let&apos;s turn a hard <span className={styles.accent}>customer question</span> into a
          clear answer.
        </h1>

        <div className={styles.grid}>
          <a
            href="https://www.linkedin.com/in/katherine-zdanowski/"
            target="_blank"
            rel="noreferrer"
            className={`${styles.cell} reveal`}
          >
            <div className={styles.cellLabel}>LinkedIn</div>
            <div className={styles.cellValue}>
              in/katherine-zdanowski <span className="row-arrow">↗</span>
            </div>
          </a>
          <a href="mailto:katherinezdanowski@outlook.com" className={`${styles.cell} reveal`}>
            <div className={styles.cellLabel}>Email</div>
            <div className={styles.cellValue}>
              katherinezdanowski@outlook.com <span className="row-arrow">↗</span>
            </div>
          </a>
          <div className={`${styles.cell} ${styles.cellStatic} reveal`}>
            <div className={styles.cellLabel}>Based in</div>
            <div className={styles.cellValue}>Toronto / Remote</div>
          </div>
          <TransitionLink to="/experience" className={`${styles.cell} reveal`}>
            <div className={styles.cellLabel}>Résumé</div>
            <div className={styles.cellValue}>
              Download CV <span className="row-arrow">↗</span>
            </div>
          </TransitionLink>
        </div>
      </div>
    </Layout>
  );
}

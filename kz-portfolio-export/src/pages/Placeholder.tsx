import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useReveal } from '../hooks/useReveal';
import styles from './Placeholder.module.css';

export function Placeholder({ n, title, desc }: { n: string; title: string; desc: string }) {
  useReveal([title]);

  return (
    <Layout>
      <div className={`${styles.eyebrow} reveal`}>{n} — {title}</div>
      <h1 className={`${styles.title} reveal`}>{title}</h1>
      <p className={`${styles.desc} reveal`}>{desc}</p>
      <div className={`${styles.note} reveal`}>
        This page is still being written.
        <br />
        <Link to="/" className={`${styles.back} navlink`}>
          ← Back to Index
        </Link>
      </div>
    </Layout>
  );
}

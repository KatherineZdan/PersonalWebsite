import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

const NAV_ITEMS = [
  { path: '/', label: 'Index' },
  { path: '/about', label: 'About' },
  { path: '/work', label: 'Work' },
  { path: '/experience', label: 'Experience' },
  { path: '/contact', label: 'Contact ↗' },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <span className={styles.brandName}>Katherine Zdanowski</span>
          <span className={styles.brandTag}>Strategy &amp; Research</span>
        </Link>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isContact = item.path === '/contact';
            const isActive = pathname === item.path;
            const className = [
              styles.navItem,
              'navlink',
              isContact ? styles.navItemAccent : isActive ? styles.navItemActive : '',
            ]
              .filter(Boolean)
              .join(' ');
            return (
              <Link key={item.path} to={item.path} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <span>© {new Date().getFullYear()} Katherine Zdanowski</span>
        <span className={styles.footerTag}>Customer · Growth · Service Design</span>
        <a
          href="https://www.linkedin.com/in/katherine-zdanowski/"
          target="_blank"
          rel="noreferrer"
          className={`${styles.footerLink} navlink`}
        >
          LinkedIn ↗
        </a>
      </footer>
    </div>
  );
}

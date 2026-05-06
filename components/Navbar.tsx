'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const showDark = !isHome || scrolled;

  const navLinks = [
    { label: 'Properties', href: '/properties' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <>
      <nav className={`navbar ${showDark ? 'navbar-scrolled' : 'navbar-transparent'}`}>
        <div className="container-main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 100%)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="2.5" rx="1.2" fill="white" opacity="1" />
                  <rect x="2" y="8.75" width="12" height="2.5" rx="1.2" fill="white" opacity="0.8" />
                  <rect x="2" y="13.5" width="8" height="2.5" rx="1.2" fill="white" opacity="0.6" />
                </svg>
              </div>
              <div>
                <span className="font-display" style={{
                  fontSize: '22px',
                  fontWeight: 600,
                  color: showDark ? '#1A1A2E' : '#FAF9F7',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}>
                  Meridian
                </span>
                <span style={{
                  display: 'block',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#C9A84C',
                  lineHeight: 1,
                  marginTop: '1px',
                }}>
                  Properties
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="hidden-mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={showDark ? 'nav-link-dark' : 'nav-link-light'}
                  style={{ borderBottomColor: pathname === link.href ? '#C9A84C' : 'transparent', color: pathname === link.href ? '#C9A84C' : undefined }}
                >
                  {link.label}
                </Link>
              ))}
              <a href="tel:+97143456789" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 500,
                color: showDark ? '#4A5568' : 'rgba(250,249,247,0.8)',
                textDecoration: 'none',
              }}>
                <Phone size={14} />
                +971 4 345 6789
              </a>
              <Link href="/properties" className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                Make Enquiry              
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', color: showDark ? '#1A1A2E' : '#FAF9F7' }}
              className="show-mobile"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-nav"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#FAF9F7' }}
            >
              <X size={28} />
            </button>
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className="mobile-nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Link href="/contact" className="btn-primary" onClick={() => setMobileOpen(false)}>
                Make Enquiry              
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

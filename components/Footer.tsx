import Link from 'next/link';
import { Phone, Mail, MapPin, Globe, Share2, Link2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer-bg">
      <div className="container-main" style={{ paddingTop: '72px', paddingBottom: '72px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '48px', marginBottom: '64px' }}>
          
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #C9A84C 0%, #E8D5A3 100%)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="2.5" rx="1.2" fill="white" />
                  <rect x="2" y="8.75" width="12" height="2.5" rx="1.2" fill="white" opacity="0.8" />
                  <rect x="2" y="13.5" width="8" height="2.5" rx="1.2" fill="white" opacity="0.6" />
                </svg>
              </div>
              <div>
                <span className="font-display" style={{ fontSize: '22px', fontWeight: 600, color: '#FAF9F7', letterSpacing: '-0.02em', lineHeight: 1 }}>Meridian</span>
                <span style={{ display: 'block', fontSize: '9px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9A84C', lineHeight: 1, marginTop: '1px' }}>Properties</span>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'rgba(250,249,247,0.6)', marginBottom: '24px', maxWidth: '280px' }}>
              Where Vision Meets Value. Premium real estate advisory across the UAE and Gulf region since 2009.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              {[Globe, Share2, Link2].map((Icon, i) => (
                <a key={i} href="#" style={{ width: '36px', height: '36px', borderRadius: '6px', border: '1px solid rgba(250,249,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(250,249,247,0.5)', textDecoration: 'none' }}>
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>Quick Links</h4>
            {[
              { label: 'Properties for Sale', href: '/properties?status=sale' },
              { label: 'Properties for Rent', href: '/properties?status=rent' },
              { label: 'Apartments', href: '/properties?type=apartment' },
              { label: 'Villas', href: '/properties?type=villa' },
              { label: 'Commercial', href: '/properties?type=commercial' },
              { label: 'About Meridian', href: '/about' },
            ].map(link => (
              <Link key={link.href} href={link.href} className="footer-link">{link.label}</Link>
            ))}
          </div>

          {/* Areas */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>Prime Areas</h4>
            {['Dubai Marina', 'Palm Jumeirah', 'Downtown Dubai', 'Business Bay', 'Dubai Hills Estate', 'DIFC', 'Abu Dhabi', 'Dubai Creek Harbour'].map(area => (
              <Link key={area} href={`/properties?location=${encodeURIComponent(area)}`} className="footer-link">{area}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>Contact Us</h4>
            {[
              { icon: MapPin, text: 'Unit 1402, Emaar Square Building 2\nDowntown Dubai, UAE' },
              { icon: Phone, text: '+971 4 345 6789' },
              { icon: Mail, text: 'hello@meridianproperties.ae' },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <Icon size={16} style={{ color: '#C9A84C', marginTop: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '14px', color: 'rgba(250,249,247,0.6)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{text}</span>
              </div>
            ))}
            <div style={{ marginTop: '24px', padding: '16px', borderRadius: '8px', border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(201,168,76,0.05)' }}>
              <p style={{ fontSize: '12px', color: '#C9A84C', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '4px' }}>Office Hours</p>
              <p style={{ fontSize: '13px', color: 'rgba(250,249,247,0.6)' }}>Mon–Sat: 9:00 AM – 7:00 PM</p>
              <p style={{ fontSize: '13px', color: 'rgba(250,249,247,0.6)' }}>Sunday: By Appointment</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(250,249,247,0.08)', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(250,249,247,0.4)' }}>
            © 2025 Meridian Properties LLC. All rights reserved. RERA Licensed.
          </p>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" style={{ fontSize: '13px', color: 'rgba(250,249,247,0.4)', textDecoration: 'none' }}>{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

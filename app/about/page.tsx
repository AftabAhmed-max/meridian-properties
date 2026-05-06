'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Users, TrendingUp, Globe, Check } from 'lucide-react';

const team = [
  {
    name: 'Rajan Mehrotra',
    role: 'Founder & CEO',
    bio: '20 years in Gulf real estate. Former investment director at Emaar. Closed over AED 4B in transactions.',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
    languages: 'English, Hindi, Arabic',
  },
  {
    name: 'Sara Al Hashimi',
    role: 'Head of Luxury Sales',
    bio: 'Specialist in Palm Jumeirah, DIFC, and Downtown Dubai. Trusted advisor to Gulf and international UHNW clients.',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    languages: 'Arabic, English, French',
  },
  {
    name: 'Aryan Mehta',
    role: 'Senior Property Advisor',
    bio: 'Expert in off-plan and investment properties. Consistent top performer with a portfolio spanning Dubai Marina to Business Bay.',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    languages: 'English, Hindi, Urdu',
  },
  {
    name: 'Priya Nair',
    role: 'Residential Specialist',
    bio: 'Renowned for her care for clients at every stage of their property journey. Specialist in family communities and apartments.',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    languages: 'English, Malayalam, Tamil',
  },
  {
    name: 'Omar Farouq',
    role: 'Commercial Director',
    bio: 'Leading Meridian\'s commercial division across DIFC, Business Bay, and TECOM. Expert in Grade A office and retail acquisitions.',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    languages: 'Arabic, English',
  },
  {
    name: 'Layla Hussain',
    role: 'Head of Property Management',
    bio: 'Oversees a portfolio of 400+ managed units. Committed to maximising landlord returns while delivering exceptional tenant experience.',
    photo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80',
    languages: 'Arabic, English, Urdu',
  },
  {
    name: 'David Chen',
    role: 'Investment Analyst',
    bio: 'Quantitative analyst providing data-driven market intelligence. Previously with JLL and CBRE in Hong Kong and Singapore.',
    photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
    languages: 'English, Mandarin',
  },
  {
    name: 'Fatima Al Nuaimi',
    role: 'Client Relations Manager',
    bio: 'The heart of Meridian\'s client experience. Ensures every interaction reflects our commitment to five-star service.',
    photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80',
    languages: 'Arabic, English',
  },
];

const milestones = [
  { year: '2009', event: 'Meridian Properties founded in Downtown Dubai' },
  { year: '2012', event: 'Expanded to Abu Dhabi, first international client base established' },
  { year: '2015', event: 'Launched commercial division; AED 1B in annual transactions' },
  { year: '2018', event: 'Recognised as Top 5 Boutique Agency by Gulf Property Awards' },
  { year: '2021', event: 'Launched Property Management division; 200+ units under management' },
  { year: '2023', event: 'AED 12B cumulative transaction volume; team expanded to 40+ advisors' },
];

const values = [
  { title: 'Transparency', desc: 'We believe every client deserves complete clarity at every stage of their property journey.' },
  { title: 'Expertise', desc: 'Our team holds RERA certifications and deep market knowledge built over decades in the Gulf.' },
  { title: 'Discretion', desc: 'We handle every transaction with the highest level of confidentiality and professionalism.' },
  { title: 'Results', desc: 'Our track record speaks for itself — 98% client satisfaction and AED 12B+ in transactions.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920&q=80"
            alt="Dubai Skyline"
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
        </div>
        <div className="page-hero-overlay" />
        <div className="container-main" style={{ position: 'relative', zIndex: 2, paddingBottom: '56px', width: '100%' }}>
          <span className="section-eyebrow">Our Story</span>
          <h1 className="section-title-light">About Meridian</h1>
        </div>
      </div>

      {/* Story */}
      <section className="section-pad">
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '80px', alignItems: 'center' }}>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-eyebrow">Established 2009</span>
              <h2 className="section-title" style={{ marginBottom: '24px' }}>Built on Trust,<br />Driven by Results</h2>
              <p style={{ fontSize: '16px', color: '#4A5568', lineHeight: 1.85, marginBottom: '20px' }}>
                Meridian Properties was founded with a singular belief: that every client — whether purchasing their first apartment or assembling a multi-billion dirham portfolio — deserves the same level of dedication, expertise, and care.
              </p>
              <p style={{ fontSize: '16px', color: '#4A5568', lineHeight: 1.85, marginBottom: '32px' }}>
                Over fifteen years, we have grown from a boutique Downtown Dubai operation to one of the Gulf region's most trusted real estate advisories, with a team of 40+ certified professionals serving clients across 30 nationalities. Our market coverage spans the full UAE, with specialist knowledge of Dubai, Abu Dhabi, and the broader GCC.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {['RERA Licensed Brokerage', 'Member — Forbes Global Properties Network', '40+ Certified Advisors', 'Serving clients in 30+ nationalities'].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '20px', height: '20px', background: 'rgba(201,168,76,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} style={{ color: '#C9A84C' }} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#4A5568' }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', aspectRatio: '4/5' }}>
                <Image
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
                  alt="Meridian Office"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', background: 'rgba(15,15,26,0.85)', borderRadius: '8px', padding: '20px', backdropFilter: 'blur(8px)' }}>
                  <p className="font-display" style={{ fontSize: '28px', fontWeight: 600, color: '#C9A84C', lineHeight: 1 }}>AED 12B+</p>
                  <p style={{ fontSize: '13px', color: 'rgba(250,249,247,0.7)', marginTop: '4px' }}>Cumulative transaction volume since inception</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: '#1A1A2E', padding: '64px 0' }}>
        <div className="container-main">
          <div className="stats-grid">
            {[
              { icon: Award, value: '15+', label: 'Years of Excellence' },
              { icon: Users, value: '3,200+', label: 'Properties Transacted' },
              { icon: TrendingUp, value: '98%', label: 'Client Satisfaction' },
              { icon: Globe, value: '30+', label: 'Client Nationalities' },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ padding: '40px 32px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(250,249,247,0.08)' : 'none' }}>
                <stat.icon size={24} style={{ color: '#C9A84C', margin: '0 auto 16px' }} />
                <p className="font-display" style={{ fontSize: '40px', fontWeight: 600, color: '#FAF9F7', lineHeight: 1, marginBottom: '8px' }}>{stat.value}</p>
                <p style={{ fontSize: '13px', color: 'rgba(250,249,247,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background: '#F0EDE8' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-eyebrow">Our Philosophy</span>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: '#FFFFFF', borderRadius: '8px', padding: '40px 32px' }}>
                <span className="gold-line" />
                <h3 style={{ fontSize: '22px', fontWeight: 600, fontFamily: 'var(--font-display)', color: '#1A1A2E', marginBottom: '12px' }}>{v.title}</h3>
                <p style={{ fontSize: '14px', color: '#4A5568', lineHeight: 1.75 }}>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad">
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-eyebrow">The People Behind Meridian</span>
            <h2 className="section-title">Meet Our Team</h2>
          </div>
          <div className="team-grid">
            {team.map((member, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                style={{ background: '#FFFFFF', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(26,26,46,0.06)', transition: 'all 0.3s' }}>
                <div style={{ position: 'relative', height: '280px' }}>
                  <Image src={member.photo} alt={member.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                </div>
                <div style={{ padding: '24px' }}>
                  <p style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>{member.name}</p>
                  <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>{member.role}</p>
                  <p style={{ fontSize: '13px', color: '#4A5568', lineHeight: 1.65, marginBottom: '12px' }}>{member.bio}</p>
                  <p style={{ fontSize: '11px', color: '#8A8FA8' }}>🌐 {member.languages}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-pad" style={{ background: '#1A1A2E' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-eyebrow">Our Journey</span>
            <h2 className="section-title-light">15 Years of Milestones</h2>
          </div>
          <div style={{ maxWidth: '720px', margin: '0 auto' }}>
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ display: 'flex', gap: '32px', marginBottom: '40px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, textAlign: 'right', minWidth: '60px' }}>
                  <span className="font-display" style={{ fontSize: '20px', fontWeight: 600, color: '#C9A84C' }}>{m.year}</span>
                </div>
                <div style={{ width: '1px', background: 'rgba(201,168,76,0.3)', position: 'relative', flexShrink: 0, marginTop: '6px' }}>
                  <div style={{ width: '10px', height: '10px', background: '#C9A84C', borderRadius: '50%', position: 'absolute', top: 0, left: '-4.5px' }} />
                </div>
                <p style={{ fontSize: '15px', color: 'rgba(250,249,247,0.75)', lineHeight: 1.65, paddingTop: '2px' }}>{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad" style={{ background: '#FAF9F7', textAlign: 'center' }}>
        <div className="container-main">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-eyebrow">Work With Us</span>
            <h2 className="section-title" style={{ marginBottom: '20px' }}>Ready to Find<br />Your Perfect Property?</h2>
            <p style={{ fontSize: '16px', color: '#4A5568', marginBottom: '40px', maxWidth: '480px', margin: '0 auto 40px' }}>
              Our team of certified advisors is ready to guide you through every step of your real estate journey.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/properties" className="btn-primary">Browse Properties</Link>
              <Link href="/contact" className="btn-dark">Get in Touch</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

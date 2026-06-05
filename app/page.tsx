'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, ArrowRight, ChevronRight, Star, Award, TrendingUp, Shield } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import { useProperties } from '@/lib/properties';
import CustomSelect from '@/components/CustomSelect';

const typeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa / Townhouse' },
  { value: 'commercial', label: 'Commercial' },
];
const locationOptions = [
  { value: 'Dubai Marina', label: 'Dubai Marina' },
  { value: 'Palm Jumeirah', label: 'Palm Jumeirah' },
  { value: 'Downtown Dubai', label: 'Downtown Dubai' },
  { value: 'Business Bay', label: 'Business Bay' },
  { value: 'DIFC', label: 'DIFC' },
  { value: 'Dubai Hills Estate', label: 'Dubai Hills Estate' },
  { value: 'Jumeirah Village Circle', label: 'JVC' },
  { value: 'Abu Dhabi', label: 'Abu Dhabi' },
];
const priceOptions = [
  { value: 'under-2m', label: 'Under AED 2M' },
  { value: '2m-5m', label: 'AED 2M – 5M' },
  { value: '5m-10m', label: 'AED 5M – 10M' },
  { value: '10m-plus', label: 'AED 10M+' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function HomePage() {
  const router = useRouter();
  const { properties } = useProperties();
  const [searchType, setSearchType] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchPrice, setSearchPrice] = useState('');

  const featuredProperties = useMemo(
    () => properties.filter(p => !p.hidden && p.featured).slice(0, 6),
    [properties]
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchType) params.set('type', searchType);
    if (searchLocation) params.set('location', searchLocation);
    if (searchPrice) params.set('price', searchPrice);
    router.push(`/properties?${params.toString()}`);
  };

  const stats = [
    { value: '15+', label: 'Years in Market' },
    { value: '3,200+', label: 'Properties Sold' },
    { value: 'AED 12B+', label: 'Transaction Volume' },
    { value: '98%', label: 'Client Satisfaction' },
  ];

  const services = [
    { icon: Search, title: 'Property Search', desc: 'Access thousands of exclusive listings across the UAE, curated for your lifestyle and investment goals.' },
    { icon: TrendingUp, title: 'Investment Advisory', desc: 'Data-driven market intelligence to help you identify the highest-performing assets in the Gulf region.' },
    { icon: Shield, title: 'Transaction Support', desc: 'End-to-end legal, financial, and documentation support for a seamless purchase or rental experience.' },
    { icon: Award, title: 'Property Management', desc: 'Comprehensive management services to protect and grow the value of your investment portfolio.' },
  ];

  const testimonials = [
    { name: 'Vikram Nair', role: 'Business Owner, Mumbai', text: 'Meridian found us our dream villa on the Palm in under three weeks. Their market knowledge and professionalism are unmatched in Dubai.', rating: 5 },
    { name: 'Aisha Al Mansoori', role: 'Investor, Abu Dhabi', text: 'I have worked with many agencies across the Gulf and Meridian stands in a class of their own. Every transaction has been smooth, transparent, and profitable.', rating: 5 },
    { name: 'James Thornton', role: 'Finance Director, London', text: 'The investment advisory team at Meridian helped me build a Dubai portfolio that has outperformed the market by 34% in two years.', rating: 5 },
  ];

  return (
    <>
      {/* HERO */}
      <section className="hero-section">
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1920&q=85"
            alt="Dubai Skyline"
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
        </div>
        <div className="hero-overlay" />
        <div className="container-main" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            style={{ maxWidth: '760px' }}
          >
            <motion.span variants={fadeUp} style={{ display: 'inline-block', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
              Premium Real Estate Advisory
            </motion.span>
            <motion.h1 variants={fadeUp} className="font-display" style={{ fontSize: 'clamp(42px, 6vw, 80px)', fontWeight: 600, color: '#FAF9F7', lineHeight: 1.08, marginBottom: '24px' }}>
              Where Vision<br />
              <em style={{ color: '#C9A84C', fontStyle: 'italic' }}>Meets Value</em>
            </motion.h1>
            <motion.p variants={fadeUp} style={{ fontSize: '18px', color: 'rgba(250,249,247,0.75)', lineHeight: 1.7, marginBottom: '48px', maxWidth: '540px' }}>
              Discover the Gulf's most exceptional properties with an agency built on fifteen years of trust, expertise, and results.
            </motion.p>

            {/* Search Bar */}
            <motion.div variants={fadeUp}>
              <div className="search-bar" style={{ flexWrap: 'wrap', gap: '0' }}>
                <CustomSelect
                  variant="light"
                  placeholder="Property Type"
                  options={typeOptions}
                  value={searchType}
                  onChange={setSearchType}
                />
                <div className="search-divider" />
                <CustomSelect
                  variant="light"
                  placeholder="Location"
                  options={locationOptions}
                  value={searchLocation}
                  onChange={setSearchLocation}
                />
                <div className="search-divider" />
                <CustomSelect
                  variant="light"
                  placeholder="Budget"
                  options={priceOptions}
                  value={searchPrice}
                  onChange={setSearchPrice}
                />
                <button onClick={handleSearch} className="btn-primary" style={{ margin: '4px', borderRadius: '4px', gap: '8px' }}>
                  <Search size={16} />
                  Search
                </button>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(250,249,247,0.45)', marginTop: '14px' }}>
                Over 1,200 active listings across the UAE
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 2, textAlign: 'center' }}>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <div style={{ width: '1px', height: '48px', background: 'linear-gradient(to bottom, transparent, rgba(201,168,76,0.8))', margin: '0 auto' }} />
          </motion.div>
        </div>
      </section>

      {/* STATS BAR */}
      <section style={{ background: '#1A1A2E' }}>
        <div className="container-main">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ padding: '40px 32px', textAlign: 'center', borderRight: i < 3 ? '1px solid rgba(250,249,247,0.08)' : 'none' }}
              >
                <p className="font-display" style={{ fontSize: '40px', fontWeight: 600, color: '#C9A84C', lineHeight: 1, marginBottom: '8px' }}>{stat.value}</p>
                <p style={{ fontSize: '13px', color: 'rgba(250,249,247,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="section-pad" style={{ background: '#FAF9F7' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '56px', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span className="section-eyebrow">Handpicked Listings</span>
              <h2 className="section-title">Featured Properties</h2>
            </div>
            <Link href="/properties" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: '#C9A84C', textDecoration: 'none', letterSpacing: '0.04em' }}>
              View All Properties <ArrowRight size={16} />
            </Link>
          </div>
          <div className="property-grid">
            {featuredProperties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section-pad" style={{ background: '#F0EDE8' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-eyebrow">What We Offer</span>
            <h2 className="section-title">A Complete Real Estate Service</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ background: '#FFFFFF', borderRadius: '8px', padding: '40px 32px', borderBottom: '3px solid transparent', transition: 'all 0.3s', cursor: 'default' }}
                whileHover={{ borderBottomColor: '#C9A84C', y: -4, boxShadow: '0 12px 40px rgba(26,26,46,0.1)' }}
              >
                <div style={{ width: '52px', height: '52px', background: 'rgba(201,168,76,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  <service.icon size={24} style={{ color: '#C9A84C' }} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A2E', marginBottom: '12px', fontFamily: 'var(--font-display)' }}>{service.title}</h3>
                <p style={{ fontSize: '14px', color: '#4A5568', lineHeight: 1.7 }}>{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '420px', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1920&q=80"
            alt="Luxury Property"
            fill
            style={{ objectFit: 'cover' }}
            sizes="100vw"
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,15,26,0.9) 0%, rgba(15,15,26,0.6) 100%)' }} />
        </div>
        <div className="container-main" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ maxWidth: '680px' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <span className="section-eyebrow">Ready to Begin?</span>
              <h2 className="section-title-light" style={{ marginBottom: '20px' }}>Find Your Perfect<br />Property Today</h2>
              <p style={{ fontSize: '17px', color: 'rgba(250,249,247,0.7)', lineHeight: 1.7, marginBottom: '40px' }}>
                Whether you are buying your first home, building an investment portfolio, or seeking the finest luxury residence in the Gulf — our team is ready to guide you.
              </p>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <Link href="/properties" className="btn-primary">Browse Properties</Link>
                <Link href="/contact" className="btn-secondary">Speak to an Advisor</Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad" style={{ background: '#FAF9F7' }}>
        <div className="container-main">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="section-eyebrow">Client Stories</span>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} style={{ color: '#C9A84C', fill: '#C9A84C' }} />
                  ))}
                </div>
                <p style={{ fontSize: '15px', color: '#4A5568', lineHeight: 1.75, marginBottom: '24px', fontStyle: 'italic' }}>"{t.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #E8D5A3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 600, color: '#FAF9F7', fontFamily: 'var(--font-display)' }}>{t.name[0]}</span>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E' }}>{t.name}</p>
                    <p style={{ fontSize: '12px', color: '#8A8FA8' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AREA GUIDES */}
      <section className="section-pad-sm" style={{ background: '#F0EDE8' }}>
        <div className="container-main">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="section-eyebrow">Prime Locations</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>Explore by Area</h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
            {[
              { label: 'Dubai Marina', value: 'Dubai Marina' },
              { label: 'Palm Jumeirah', value: 'Palm Jumeirah' },
              { label: 'Downtown Dubai', value: 'Downtown Dubai' },
              { label: 'Business Bay', value: 'Business Bay' },
              { label: 'DIFC', value: 'DIFC' },
              { label: 'Dubai Hills', value: 'Dubai Hills Estate' },
              { label: 'JVC', value: 'Jumeirah Village Circle' },
              { label: 'Abu Dhabi', value: 'Abu Dhabi' },
            ].map((area, i) => (
              <motion.div key={area.value} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link href={`/properties?location=${encodeURIComponent(area.value)}`} className="area-guide-link">
                  {area.label}
                  <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

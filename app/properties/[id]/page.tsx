'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Phone, Mail, Check, Share2, Heart, Calendar, Building2 } from 'lucide-react';
import { useProperties } from '@/lib/properties';
import PropertyCard from '@/components/PropertyCard';

const FORMSPREE_URL = `https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_ID ?? 'mlgzljgb'}`;

// Computed once, not on every render (P-3)
const minDate = new Date().toISOString().split('T')[0];

export default function PropertyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { properties, hydrated } = useProperties();
  const property = properties.find(p => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '', date: '' });
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  // Wait for localStorage to hydrate before deciding a property doesn't exist —
  // admin-created listings live only in storage and aren't in the seed fallback.
  if (!property) {
    if (!hydrated) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      );
    }
    return notFound();
  }

  const formattedPrice = new Intl.NumberFormat('en-AE').format(property.price);
  const priceLabel = property.status === 'rent' ? `AED ${formattedPrice} / year` : `AED ${formattedPrice}`;

  const related = properties
    .filter(p => p.id !== property.id && (p.type === property.type || p.location === property.location))
    .slice(0, 3);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: property.name, url: window.location.href });
      } catch {
        // user cancelled share dialog
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(false);
    const payload = { ...formData, property: property.name, propertyId: property.id };
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setFormError(true);
      }
    } catch {
      setFormError(true);
    }
  };

  // Build a precise map URL from per-property coordinates (F-4)
  const { lat, lng } = property;
  const bbox = `${(lng - 0.01).toFixed(4)},${(lat - 0.01).toFixed(4)},${(lng + 0.01).toFixed(4)},${(lat + 0.01).toFixed(4)}`;
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <>
      <div style={{ paddingTop: '72px' }}>
        {/* Breadcrumb */}
        <div style={{ background: '#FAF9F7', borderBottom: '1px solid #F0EDE8', padding: '16px 0' }}>
          <div className="container-main">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#8A8FA8' }}>
              <Link href="/" style={{ color: '#8A8FA8', textDecoration: 'none' }}>Home</Link>
              <span>/</span>
              <Link href="/properties" style={{ color: '#8A8FA8', textDecoration: 'none' }}>Properties</Link>
              <span>/</span>
              <span style={{ color: '#1A1A2E' }}>{property.name}</span>
            </div>
          </div>
        </div>

        <div className="container-main section-pad">
          {/* Two-column on desktop: main content + sticky sidebar (U-1) */}
          <div className="property-detail-grid">

            {/* LEFT: Main content */}
            <div>
              {/* Gallery — CSS handles responsive layout; no window checks needed (F-5) */}
              <div className="gallery-grid" style={{ marginBottom: '48px' }}>
                <div className="gallery-main">
                  <Image
                    src={property.images[activeImage]}
                    alt={property.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  {/* Photo count badge — shown on mobile where thumbs are hidden (U-2) */}
                  <div className="gallery-photo-count">
                    {activeImage + 1} / {property.images.length}
                  </div>
                </div>
                <div className="gallery-thumb">
                  <Image
                    src={property.images[1] || property.images[0]}
                    alt={property.name}
                    fill
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setActiveImage(1)}
                    sizes="33vw"
                  />
                </div>
                <div className="gallery-thumb" style={{ position: 'relative' }}>
                  <Image
                    src={property.images[2] || property.images[0]}
                    alt={property.name}
                    fill
                    style={{ objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setActiveImage(2)}
                    sizes="33vw"
                  />
                  {property.images.length > 3 && (
                    <div
                      style={{ position: 'absolute', inset: 0, background: 'rgba(15,15,26,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      onClick={() => setActiveImage(3)}
                    >
                      <span style={{ color: '#FAF9F7', fontSize: '18px', fontWeight: 600, fontFamily: 'var(--font-display)' }}>+{property.images.length - 3} more</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '48px', overflowX: 'auto' }}>
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{ flexShrink: 0, width: '80px', height: '60px', borderRadius: '6px', overflow: 'hidden', border: i === activeImage ? '2px solid #C9A84C' : '2px solid transparent', cursor: 'pointer', position: 'relative', background: 'none', padding: 0 }}
                  >
                    <Image src={img} alt="" fill style={{ objectFit: 'cover' }} sizes="80px" />
                  </button>
                ))}
              </div>

              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <span className={`property-badge ${property.status === 'sale' ? 'property-badge-sale' : 'property-badge-rent'}`}>
                      For {property.status === 'sale' ? 'Sale' : 'Rent'}
                    </span>
                    <span className="property-badge property-badge-rent" style={{ textTransform: 'capitalize' }}>{property.type}</span>
                  </div>
                  <h1 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 600, color: '#1A1A2E', lineHeight: 1.15, marginBottom: '8px' }}>{property.name}</h1>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#8A8FA8', fontSize: '15px' }}>
                    <MapPin size={14} style={{ color: '#C9A84C' }} />
                    {property.location}, {property.city}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p className="font-display" style={{ fontSize: '36px', fontWeight: 600, color: '#1A1A2E', lineHeight: 1 }}>{priceLabel}</p>
                  {property.status === 'rent' && <p style={{ fontSize: '12px', color: '#8A8FA8', marginTop: '4px' }}>per annum</p>}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                    {/* Share — uses Web Share API with clipboard fallback (F-3) */}
                    <button
                      onClick={handleShare}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #F0EDE8', background: 'none', cursor: 'pointer', fontSize: '13px', color: '#4A5568' }}
                    >
                      <Share2 size={14} /> Share
                    </button>
                    {/* Save — toggles saved state (F-3) */}
                    <button
                      onClick={() => setSaved(s => !s)}
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '6px', border: '1px solid #F0EDE8', background: 'none', cursor: 'pointer', fontSize: '13px', color: saved ? '#C9A84C' : '#4A5568' }}
                    >
                      <Heart size={14} style={{ fill: saved ? '#C9A84C' : 'none', color: saved ? '#C9A84C' : '#4A5568' }} />
                      {saved ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Specs */}
              <div style={{ display: 'flex', gap: '32px', padding: '24px 0', borderTop: '1px solid #F0EDE8', borderBottom: '1px solid #F0EDE8', marginBottom: '48px', flexWrap: 'wrap' }}>
                {property.type !== 'commercial' && (
                  <>
                    <div style={{ textAlign: 'center' }}>
                      <Bed size={20} style={{ color: '#C9A84C', margin: '0 auto 8px' }} />
                      <p style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{property.bedrooms}</p>
                      <p style={{ fontSize: '12px', color: '#8A8FA8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bedrooms</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Bath size={20} style={{ color: '#C9A84C', margin: '0 auto 8px' }} />
                      <p style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{property.bathrooms}</p>
                      <p style={{ fontSize: '12px', color: '#8A8FA8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bathrooms</p>
                    </div>
                  </>
                )}
                <div style={{ textAlign: 'center' }}>
                  <Square size={20} style={{ color: '#C9A84C', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{property.area.toLocaleString()}</p>
                  <p style={{ fontSize: '12px', color: '#8A8FA8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Sq Ft</p>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Building2 size={20} style={{ color: '#C9A84C', margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '22px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', lineHeight: 1 }}>{property.yearBuilt}</p>
                  <p style={{ fontSize: '12px', color: '#8A8FA8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Year Built</p>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>About This Property</h2>
                <p style={{ fontSize: '15px', color: '#4A5568', lineHeight: 1.85 }}>{property.description}</p>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '48px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Amenities & Features</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {property.amenities.map((amenity, i) => (
                    <span key={i} className="amenity-tag">
                      <Check size={12} style={{ color: '#C9A84C' }} />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Map — uses per-property coordinates (F-4) */}
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)', marginBottom: '24px' }}>Location</h2>
                <div style={{ borderRadius: '12px', overflow: 'hidden', height: '360px', border: '1px solid #F0EDE8' }}>
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapSrc}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT: Sticky sidebar (U-1) */}
            <div className="property-sidebar">
              {/* Agent Card */}
              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 24px rgba(26,26,46,0.08)', border: '1px solid #F0EDE8', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>Your Agent</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, #1A1A2E 0%, #3A5F8A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '22px', fontWeight: 600, color: '#C9A84C', fontFamily: 'var(--font-display)' }}>
                      {property.agent.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A2E', fontFamily: 'var(--font-display)' }}>{property.agent.name}</p>
                    <p style={{ fontSize: '12px', color: '#8A8FA8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Senior Property Advisor</p>
                  </div>
                </div>
                <a href={`tel:${property.agent.phone}`} className="btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '12px', display: 'flex' }}>
                  <Phone size={15} /> Call Now
                </a>
                <a href={`mailto:${property.agent.email}`} className="btn-dark" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                  <Mail size={15} /> Send Email
                </a>
              </div>

              {/* Inquiry Form */}
              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 4px 24px rgba(26,26,46,0.08)', border: '1px solid #F0EDE8' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '24px' }}>Request a Viewing</h3>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ width: '56px', height: '56px', background: 'rgba(44,110,73,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Check size={24} style={{ color: '#2C6E49' }} />
                    </div>
                    <p style={{ fontSize: '20px', fontFamily: 'var(--font-display)', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>Inquiry Received</p>
                    <p style={{ color: '#8A8FA8', fontSize: '14px' }}>Our team will be in touch within 2 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input className="form-input" placeholder="Your Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input className="form-input" type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="Phone Number"
                      pattern="[+]?[0-9\s\-\(\)]{7,20}"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                    <div style={{ position: 'relative' }}>
                      <input
                        className="form-input"
                        type="date"
                        min={minDate}
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        style={{ cursor: 'pointer', colorScheme: 'light', color: formData.date ? '#1A1A2E' : 'transparent' }}
                      />
                      {!formData.date && (
                        <span style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', fontSize: '15px', color: '#8A8FA8', pointerEvents: 'none' }}>
                          Preferred Viewing Date
                        </span>
                      )}
                    </div>
                    <textarea
                      className="form-input"
                      rows={3}
                      placeholder={`I am interested in ${property.name}...`}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      style={{ resize: 'vertical' }}
                    />
                    {formError && (
                      <p style={{ fontSize: '13px', color: '#C0392B', textAlign: 'center' }}>
                        Something went wrong. Please try again.
                      </p>
                    )}
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex' }}>
                      <Calendar size={15} />
                      Request Viewing
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Properties */}
      {related.length > 0 && (
        <section className="section-pad" style={{ background: '#F0EDE8' }}>
          <div className="container-main">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="section-eyebrow">You May Also Like</span>
                <h2 className="section-title">Similar Properties</h2>
              </div>
              <Link href="/properties" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 500, color: '#C9A84C', textDecoration: 'none' }}>
                View All
              </Link>
            </div>
            <div className="property-grid">
              {related.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <PropertyCard property={p} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

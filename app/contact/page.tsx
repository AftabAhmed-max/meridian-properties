'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('https://formspree.io/f/mlgzljgb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) setSubmitted(true);
  };

  const contactInfo = [
    {
      icon: MapPin,
      label: 'Office Address',
      lines: ['Unit 1402, Emaar Square Building 2', 'Downtown Dubai, Dubai, UAE'],
    },
    {
      icon: Phone,
      label: 'Phone',
      lines: ['+971 4 345 6789', '+971 50 234 5678 (WhatsApp)'],
    },
    {
      icon: Mail,
      label: 'Email',
      lines: ['hello@meridianproperties.ae', 'invest@meridianproperties.ae'],
    },
    {
      icon: Clock,
      label: 'Office Hours',
      lines: ['Monday – Saturday: 9:00 AM – 7:00 PM', 'Sunday: By Appointment Only'],
    },
  ];

  return (
    <>
      {/* Hero */}
      <div className="page-hero">
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
            alt="Contact Meridian"
            fill
            style={{ objectFit: 'cover' }}
            priority
            sizes="100vw"
          />
        </div>
        <div className="page-hero-overlay" />
        <div className="container-main" style={{ position: 'relative', zIndex: 2, paddingBottom: '56px', width: '100%' }}>
          <span className="section-eyebrow">Reach Out</span>
          <h1 className="section-title-light">Contact Us</h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="section-pad">
        <div className="container-main">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '64px' }}>

            {/* Contact Info */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-eyebrow">Get in Touch</span>
              <h2 className="section-title" style={{ marginBottom: '16px' }}>We'd Love to<br />Hear From You</h2>
              <p style={{ fontSize: '15px', color: '#4A5568', lineHeight: 1.8, marginBottom: '48px' }}>
                Whether you have a specific property in mind, need market advice, or simply want to explore your options — our team is here to help. Reach out via any channel below and we will respond within 2 hours during business hours.
              </p>

              <div>
                {contactInfo.map(({ icon: Icon, label, lines }, i) => (
                  <div key={i} className="contact-info-item">
                    <div className="contact-icon-wrap">
                      <Icon size={18} style={{ color: '#C9A84C' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8A8FA8', marginBottom: '6px' }}>{label}</p>
                      {lines.map((line, j) => (
                        <p key={j} style={{ fontSize: '14px', color: '#1A1A2E', lineHeight: 1.6 }}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <div style={{ marginTop: '40px', background: '#25D366', borderRadius: '8px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>Chat on WhatsApp</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>Typically replies within minutes</p>
                </div>
                <a href="https://wa.me/971502345678" target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', background: '#FFFFFF', color: '#25D366', fontSize: '13px', fontWeight: 600, padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Start Chat
                </a>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '48px', boxShadow: '0 4px 32px rgba(26,26,46,0.08)', border: '1px solid #F0EDE8' }}>
                <h3 className="font-display" style={{ fontSize: '28px', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>Send a Message</h3>
                <p style={{ fontSize: '14px', color: '#8A8FA8', marginBottom: '32px' }}>We respond to all enquiries within 2 business hours.</p>

                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '48px 0' }}>
                    <div style={{ width: '64px', height: '64px', background: 'rgba(44,110,73,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                      <Check size={28} style={{ color: '#2C6E49' }} />
                    </div>
                    <p className="font-display" style={{ fontSize: '28px', fontWeight: 600, color: '#1A1A2E', marginBottom: '12px' }}>Message Sent!</p>
                    <p style={{ color: '#8A8FA8', fontSize: '15px', lineHeight: 1.65 }}>
                      Thank you for reaching out. One of our advisors will be in touch within 2 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <input className="form-input" placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                      <input className="form-input" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                    </div>
                    <input className="form-input" type="tel" placeholder="Phone / WhatsApp" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    <select className="form-select" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required>
                      <option value="">Select a Subject</option>
                      <option value="buying">I want to Buy a Property</option>
                      <option value="renting">I want to Rent a Property</option>
                      <option value="selling">I want to Sell / List a Property</option>
                      <option value="investment">Investment Advisory</option>
                      <option value="management">Property Management</option>
                      <option value="other">General Enquiry</option>
                    </select>
                    <textarea className="form-input" rows={5} placeholder="Tell us more about what you're looking for..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ resize: 'vertical' }} />
                    <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', padding: '16px' }}>
                      Send Message
                    </button>
                    <p style={{ fontSize: '12px', color: '#8A8FA8', textAlign: 'center' }}>
                      Your details are safe with us. We never share your information.
                    </p>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section style={{ background: '#F0EDE8', padding: '0 0 96px' }}>
        <div className="container-main">
          <div style={{ borderRadius: '12px', overflow: 'hidden', height: '480px', boxShadow: '0 8px 40px rgba(26,26,46,0.1)' }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=55.2700,25.1950,55.2900,25.2050&layer=mapnik&marker=25.1972,55.2796"
            />
          </div>
        </div>
      </section>
    </>
  );
}

'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import allProperties from '@/data/properties.json';
import { Suspense } from 'react';
import CustomSelect from '@/components/CustomSelect';

// Add these option arrays inside PropertiesContent:
const typeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa / Townhouse' },
  { value: 'commercial', label: 'Commercial' },
];
const statusOptions = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];
const locationOptions = [
  { value: 'Dubai Marina', label: 'Dubai Marina' },
  { value: 'Palm Jumeirah', label: 'Palm Jumeirah' },
  { value: 'Downtown Dubai', label: 'Downtown Dubai' },
  { value: 'Business Bay', label: 'Business Bay' },
  { value: 'DIFC', label: 'DIFC' },
  { value: 'Dubai Hills Estate', label: 'Dubai Hills' },
  { value: 'Jumeirah Village Circle', label: 'JVC' },
  { value: 'Abu Dhabi', label: 'Abu Dhabi' },
  { value: 'DAMAC Hills', label: 'DAMAC Hills' },
  { value: 'TECOM', label: 'TECOM' },
];
const priceOptions = [
  { value: 'under-2m', label: 'Under AED 2M' },
  { value: '2m-5m', label: 'AED 2M – 5M' },
  { value: '5m-10m', label: 'AED 5M – 10M' },
  { value: '10m-plus', label: 'AED 10M+' },
];

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [type, setType] = useState(searchParams.get('type') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [price, setPrice] = useState(searchParams.get('price') || '');

  useEffect(() => {
    setType(searchParams.get('type') || '');
    setStatus(searchParams.get('status') || '');
    setLocation(searchParams.get('location') || '');
    setPrice(searchParams.get('price') || '');
  }, [searchParams]);

  const filtered = useMemo(() => {
    return allProperties.filter(p => {
      if (type && p.type !== type) return false;
      if (status && p.status !== status) return false;
      if (location && !p.location.toLowerCase().includes(location.toLowerCase()) && !p.city.toLowerCase().includes(location.toLowerCase())) return false;
      if (price) {
        if (price === 'under-2m' && p.price >= 2000000) return false;
        if (price === '2m-5m' && (p.price < 2000000 || p.price > 5000000)) return false;
        if (price === '5m-10m' && (p.price < 5000000 || p.price > 10000000)) return false;
        if (price === '10m-plus' && p.price < 10000000) return false;
      }
      return true;
    });
  }, [type, status, location, price]);

  const hasFilters = type || status || location || price;

  const clearFilters = () => {
    setType(''); setStatus(''); setLocation(''); setPrice('');
  };

  return (
    <>
      {/* Page Hero */}
      <div style={{ background: '#1A1A2E', paddingTop: '120px', paddingBottom: '64px' }}>
        <div className="container-main">
          <span className="section-eyebrow">All Listings</span>
          <h1 className="section-title-light" style={{ marginBottom: '16px' }}>Properties</h1>
          <p style={{ fontSize: '16px', color: 'rgba(250,249,247,0.6)', maxWidth: '480px' }}>
            Explore our curated portfolio of premium residential and commercial properties across the UAE.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: '#FAF9F7', position: 'sticky', top: '72px', zIndex: 50, borderBottom: '1px solid #F0EDE8', padding: '16px 0', boxShadow: '0 2px 12px rgba(26,26,46,0.04)' }}>
        <div className="container-main">
          <div className="filter-bar">
            <SlidersHorizontal size={18} style={{ color: '#C9A84C', flexShrink: 0 }} />
            <CustomSelect placeholder="All Types" options={typeOptions} value={type} onChange={setType} />
            <CustomSelect placeholder="Buy & Rent" options={statusOptions} value={status} onChange={setStatus} />
            <CustomSelect placeholder="All Locations" options={locationOptions} value={location} onChange={setLocation} />
            <CustomSelect placeholder="Any Price" options={priceOptions} value={price} onChange={setPrice} />
            {hasFilters && (
              <button onClick={clearFilters} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#8A8FA8', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', whiteSpace: 'nowrap' }}>
                <X size={14} /> Clear filters
              </button>
            )}
            <span style={{ marginLeft: 'auto', fontSize: '13px', color: '#8A8FA8', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {filtered.length} {filtered.length === 1 ? 'property' : 'properties'}
            </span>
          </div>
        </div>
      </div>

      {/* Listings */}
      <section className="section-pad">
        <div className="container-main">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: '#1A1A2E', marginBottom: '12px' }}>No properties found</p>
              <p style={{ color: '#8A8FA8', marginBottom: '32px' }}>Try adjusting your filters to see more results.</p>
              <button onClick={clearFilters} className="btn-dark">Clear All Filters</button>
            </div>
          ) : (
            <div className="property-grid">
              {filtered.map((property, i) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <PropertiesContent />
    </Suspense>
  );
}

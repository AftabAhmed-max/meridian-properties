'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Save, ArrowLeft, LayoutDashboard,
} from 'lucide-react';
import {
  type Property,
  loadProperties,
  saveProperties,
  seedProperties,
} from '@/lib/properties';

const typeOptions = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa / Townhouse' },
  { value: 'commercial', label: 'Commercial' },
];
const statusOptions = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
];

/** A blank property used when adding a new listing. */
function emptyProperty(): Property {
  return {
    id: '',
    name: '',
    type: 'apartment',
    status: 'sale',
    price: 0,
    currency: 'AED',
    location: '',
    city: 'Dubai',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    floor: '',
    developer: '',
    yearBuilt: new Date().getFullYear(),
    lat: 25.2048,
    lng: 55.2708,
    images: [''],
    description: '',
    amenities: [''],
    featured: false,
    hidden: false,
    agent: { name: '', phone: '', email: '', photo: '' },
  };
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

const fmtPrice = (p: Property) => {
  const n = new Intl.NumberFormat('en-AE').format(p.price);
  return p.status === 'rent' ? `AED ${n}/yr` : `AED ${n}`;
};

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);

  useEffect(() => {
    setProperties(loadProperties());
    setHydrated(true);
  }, []);

  const persist = (next: Property[]) => {
    setProperties(next);
    saveProperties(next);
  };

  const visibleCount = useMemo(() => properties.filter(p => !p.hidden).length, [properties]);

  const openAdd = () => {
    setEditing(emptyProperty());
    setIsNew(true);
  };

  const openEdit = (p: Property) => {
    // Deep clone so edits to nested arrays / agent don't mutate live state.
    setEditing(JSON.parse(JSON.stringify(p)) as Property);
    setIsNew(false);
  };

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
  };

  const toggleHidden = (p: Property) => {
    persist(properties.map(x => (x.id === p.id ? { ...x, hidden: !x.hidden } : x)));
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    persist(properties.filter(p => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleSave = (draft: Property) => {
    // Clean empty image / amenity rows before persisting.
    const cleaned: Property = {
      ...draft,
      images: draft.images.map(s => s.trim()).filter(Boolean),
      amenities: draft.amenities.map(s => s.trim()).filter(Boolean),
    };
    if (cleaned.images.length === 0) cleaned.images = [''];

    if (isNew) {
      const base = slugify(cleaned.name) || 'property';
      let id = base;
      let n = 2;
      const taken = new Set(properties.map(p => p.id));
      while (taken.has(id)) id = `${base}-${n++}`;
      cleaned.id = id;
      persist([{ ...cleaned }, ...properties]);
    } else {
      persist(properties.map(p => (p.id === cleaned.id ? cleaned : p)));
    }
    closeForm();
  };

  const resetToSeed = () => {
    persist(seedProperties.map(p => ({ ...p })));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FAF9F7', paddingTop: '72px' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '40px 0' }}>
        <div className="container-main" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '12px' }}>
              <LayoutDashboard size={14} /> Content Management
            </span>
            <h1 className="font-display" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 600, color: '#FAF9F7', lineHeight: 1.1 }}>
              Property Manager
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(250,249,247,0.55)', marginTop: '10px' }}>
              {properties.length} total &middot; {visibleCount} live &middot; {properties.length - visibleCount} hidden
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-secondary" style={{ padding: '13px 24px' }}>
              <ArrowLeft size={15} /> View Site
            </Link>
            <button onClick={openAdd} className="btn-primary" style={{ padding: '14px 24px' }}>
              <Plus size={16} /> Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="container-main" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        {!hydrated ? (
          <p style={{ color: '#8A8FA8', padding: '40px 0' }}>Loading…</p>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: '#1A1A2E', marginBottom: '12px' }}>No properties yet</p>
            <p style={{ color: '#8A8FA8', marginBottom: '24px' }}>Add your first listing or restore the original dataset.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={openAdd} className="btn-primary"><Plus size={16} /> Add Property</button>
              <button onClick={resetToSeed} className="btn-dark">Restore Sample Data</button>
            </div>
          </div>
        ) : (
          <div style={{ background: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 16px rgba(26,26,46,0.06)', border: '1px solid #F0EDE8' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
                <thead>
                  <tr style={{ background: '#F0EDE8', textAlign: 'left' }}>
                    {['Property', 'Price', 'Location', 'Type', 'Status', 'Actions'].map((h, i) => (
                      <th key={h} style={{ padding: '14px 20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8A8FA8', textAlign: i === 5 ? 'right' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {properties.map(p => (
                    <tr key={p.id} style={{ borderTop: '1px solid #F0EDE8', opacity: p.hidden ? 0.5 : 1 }}>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ position: 'relative', width: '64px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#F0EDE8' }}>
                            {p.images[0] ? (
                              <Image src={p.images[0]} alt="" fill style={{ objectFit: 'cover' }} sizes="64px" unoptimized />
                            ) : null}
                          </div>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 500, color: '#1A1A2E', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {p.name || <span style={{ color: '#8A8FA8' }}>Untitled</span>}
                              {p.featured && <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#C9A84C', border: '1px solid #C9A84C', padding: '1px 6px', borderRadius: '3px' }}>Featured</span>}
                            </p>
                            <p style={{ fontSize: '12px', color: '#8A8FA8' }}>{p.developer}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: '14px', color: '#1A1A2E', whiteSpace: 'nowrap' }}>{fmtPrice(p)}</td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: '#4A5568' }}>{p.location}<br /><span style={{ color: '#8A8FA8' }}>{p.city}</span></td>
                      <td style={{ padding: '12px 20px', fontSize: '13px', color: '#4A5568', textTransform: 'capitalize' }}>{p.type}</td>
                      <td style={{ padding: '12px 20px' }}>
                        {p.hidden ? (
                          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#8A8FA8', background: 'rgba(26,26,46,0.08)', padding: '4px 10px', borderRadius: '100px' }}>Hidden from public</span>
                        ) : (
                          <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#2C6E49', background: 'rgba(44,110,73,0.1)', padding: '4px 10px', borderRadius: '100px' }}>Active</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button onClick={() => toggleHidden(p)} title={p.hidden ? 'Show on site' : 'Hide from site'} style={iconBtn}>
                            {p.hidden ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <button onClick={() => openEdit(p)} title="Edit" style={iconBtn}>
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteTarget(p)} title="Delete" style={{ ...iconBtn, color: '#C0392B' }}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {editing && <PropertyForm initial={editing} isNew={isNew} onSave={handleSave} onCancel={closeForm} />}

      {deleteTarget && (
        <Overlay onClose={() => setDeleteTarget(null)}>
          <div style={{ background: '#FFFFFF', borderRadius: '12px', padding: '32px', maxWidth: '420px', width: '100%' }} onClick={e => e.stopPropagation()}>
            <h3 className="font-display" style={{ fontSize: '24px', fontWeight: 600, color: '#1A1A2E', marginBottom: '12px' }}>Delete property?</h3>
            <p style={{ fontSize: '14px', color: '#4A5568', lineHeight: 1.6, marginBottom: '28px' }}>
              &ldquo;{deleteTarget.name || 'Untitled'}&rdquo; will be permanently removed from your listings. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteTarget(null)} style={ghostBtn}>Cancel</button>
              <button onClick={confirmDelete} style={{ ...solidBtn, background: '#C0392B' }}>Delete</button>
            </div>
          </div>
        </Overlay>
      )}
    </div>
  );
}

/* ------------------------------- Form modal ------------------------------- */

function PropertyForm({ initial, isNew, onSave, onCancel }: {
  initial: Property;
  isNew: boolean;
  onSave: (p: Property) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Property>(initial);

  const set = <K extends keyof Property>(key: K, value: Property[K]) =>
    setDraft(d => ({ ...d, [key]: value }));

  const setNum = (key: keyof Property, value: string) =>
    setDraft(d => ({ ...d, [key]: value === '' ? 0 : Number(value) }));

  const setAgent = (key: keyof Property['agent'], value: string) =>
    setDraft(d => ({ ...d, agent: { ...d.agent, [key]: value } }));

  // Generic list helpers for the images & amenities string arrays.
  const updateList = (key: 'images' | 'amenities', i: number, value: string) =>
    setDraft(d => ({ ...d, [key]: d[key].map((v, idx) => (idx === i ? value : v)) }));
  const addRow = (key: 'images' | 'amenities') =>
    setDraft(d => ({ ...d, [key]: [...d[key], ''] }));
  const removeRow = (key: 'images' | 'amenities', i: number) =>
    setDraft(d => ({ ...d, [key]: d[key].filter((_, idx) => idx !== i) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <Overlay onClose={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: '#FAF9F7', borderRadius: '12px', width: '100%', maxWidth: '760px', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #F0EDE8', flexShrink: 0 }}>
          <h2 className="font-display" style={{ fontSize: '26px', fontWeight: 600, color: '#1A1A2E' }}>
            {isNew ? 'Add New Property' : 'Edit Property'}
          </h2>
          <button onClick={onCancel} style={iconBtn} title="Close"><X size={20} /></button>
        </div>

        <form onSubmit={submit} style={{ overflowY: 'auto', padding: '28px 32px' }}>
          <Section title="Overview">
            <Field label="Property Name" full>
              <input className="form-input" value={draft.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Azure Penthouse" />
            </Field>
            <Field label="Type">
              <select className="form-select" value={draft.type} onChange={e => set('type', e.target.value)}>
                {typeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Listing Status">
              <select className="form-select" value={draft.status} onChange={e => set('status', e.target.value)}>
                {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label={`Price (${draft.currency})`}>
              <input className="form-input" type="number" min="0" value={draft.price} onChange={e => setNum('price', e.target.value)} required />
            </Field>
            <Field label="Currency">
              <input className="form-input" value={draft.currency} onChange={e => set('currency', e.target.value)} />
            </Field>
          </Section>

          <Section title="Location">
            <Field label="Location / Community">
              <input className="form-input" value={draft.location} onChange={e => set('location', e.target.value)} required placeholder="e.g. Dubai Marina" />
            </Field>
            <Field label="City">
              <input className="form-input" value={draft.city} onChange={e => set('city', e.target.value)} required />
            </Field>
            <Field label="Latitude">
              <input className="form-input" type="number" step="any" value={draft.lat} onChange={e => setNum('lat', e.target.value)} />
            </Field>
            <Field label="Longitude">
              <input className="form-input" type="number" step="any" value={draft.lng} onChange={e => setNum('lng', e.target.value)} />
            </Field>
          </Section>

          <Section title="Details">
            <Field label="Bedrooms">
              <input className="form-input" type="number" min="0" value={draft.bedrooms} onChange={e => setNum('bedrooms', e.target.value)} />
            </Field>
            <Field label="Bathrooms">
              <input className="form-input" type="number" min="0" value={draft.bathrooms} onChange={e => setNum('bathrooms', e.target.value)} />
            </Field>
            <Field label="Area (sq ft)">
              <input className="form-input" type="number" min="0" value={draft.area} onChange={e => setNum('area', e.target.value)} />
            </Field>
            <Field label="Floor">
              <input className="form-input" value={draft.floor} onChange={e => set('floor', e.target.value)} placeholder="e.g. 42nd Floor" />
            </Field>
            <Field label="Developer">
              <input className="form-input" value={draft.developer} onChange={e => set('developer', e.target.value)} />
            </Field>
            <Field label="Year Built">
              <input className="form-input" type="number" value={draft.yearBuilt} onChange={e => setNum('yearBuilt', e.target.value)} />
            </Field>
            <Field label="Description" full>
              <textarea className="form-input" rows={4} value={draft.description} onChange={e => set('description', e.target.value)} style={{ resize: 'vertical' }} />
            </Field>
          </Section>

          {/* Images */}
          <Section title="Images">
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {draft.images.map((url, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" value={url} onChange={e => updateList('images', i, e.target.value)} placeholder="https://images.unsplash.com/..." />
                  <button type="button" onClick={() => removeRow('images', i)} style={{ ...iconBtn, flexShrink: 0 }} title="Remove image"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addRow('images')} style={addRowBtn}><Plus size={14} /> Add image URL</button>
            </div>
          </Section>

          {/* Amenities */}
          <Section title="Amenities">
            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {draft.amenities.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px' }}>
                  <input className="form-input" value={a} onChange={e => updateList('amenities', i, e.target.value)} placeholder="e.g. Private Pool" />
                  <button type="button" onClick={() => removeRow('amenities', i)} style={{ ...iconBtn, flexShrink: 0 }} title="Remove amenity"><X size={16} /></button>
                </div>
              ))}
              <button type="button" onClick={() => addRow('amenities')} style={addRowBtn}><Plus size={14} /> Add amenity</button>
            </div>
          </Section>

          <Section title="Agent">
            <Field label="Agent Name">
              <input className="form-input" value={draft.agent.name} onChange={e => setAgent('name', e.target.value)} />
            </Field>
            <Field label="Phone">
              <input className="form-input" value={draft.agent.phone} onChange={e => setAgent('phone', e.target.value)} />
            </Field>
            <Field label="Email">
              <input className="form-input" type="email" value={draft.agent.email} onChange={e => setAgent('email', e.target.value)} />
            </Field>
            <Field label="Photo URL">
              <input className="form-input" value={draft.agent.photo} onChange={e => setAgent('photo', e.target.value)} />
            </Field>
          </Section>

          {/* Visibility & featured */}
          <Section title="Visibility">
            <Field label="Public Status">
              <select className="form-select" value={draft.hidden ? 'hidden' : 'active'} onChange={e => set('hidden', e.target.value === 'hidden')}>
                <option value="active">Active — visible on site</option>
                <option value="hidden">Hidden — not shown publicly</option>
              </select>
            </Field>
            <Field label="Featured">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 0', fontSize: '14px', color: '#4A5568', cursor: 'pointer' }}>
                <input type="checkbox" checked={draft.featured} onChange={e => set('featured', e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#C9A84C' }} />
                Show in featured listings on the homepage
              </label>
            </Field>
          </Section>
        </form>

        {/* Modal footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', padding: '20px 32px', borderTop: '1px solid #F0EDE8', flexShrink: 0 }}>
          <button type="button" onClick={onCancel} style={ghostBtn}>Cancel</button>
          <button type="button" onClick={() => onSave(draft)} className="btn-primary" style={{ padding: '13px 28px' }}>
            <Save size={15} /> Save Property
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ------------------------------- Primitives ------------------------------- */

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(15,15,26,0.55)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
    >
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '28px' }}>
      <h3 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '16px' }}>{title}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4A5568', marginBottom: '6px' }}>{label}</label>
      {children}
    </div>
  );
}

const iconBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: '34px', height: '34px', borderRadius: '6px', border: '1px solid #F0EDE8',
  background: '#FFFFFF', color: '#4A5568', cursor: 'pointer',
};

const ghostBtn: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.04em',
  padding: '13px 24px', borderRadius: '4px', border: '1px solid #E8E4DC', background: 'transparent',
  color: '#4A5568', cursor: 'pointer',
};

const solidBtn: React.CSSProperties = {
  fontFamily: 'var(--font-body)', fontSize: '14px', fontWeight: 500, letterSpacing: '0.08em',
  textTransform: 'uppercase', padding: '13px 28px', borderRadius: '4px', border: 'none',
  color: '#FAF9F7', cursor: 'pointer',
};

const addRowBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: '6px', alignSelf: 'flex-start',
  fontSize: '13px', fontWeight: 500, color: '#C9A84C', background: 'transparent',
  border: '1px dashed #C9A84C', borderRadius: '6px', padding: '10px 16px', cursor: 'pointer',
};

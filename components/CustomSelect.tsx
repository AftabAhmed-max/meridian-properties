'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  variant?: 'light' | 'filter';
}

export default function CustomSelect({ options, value, onChange, placeholder, variant = 'filter' }: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isLight = variant === 'light';

  return (
    <div ref={ref} style={{ position: 'relative', minWidth: isLight ? '160px' : '160px', flexShrink: 0 }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: isLight ? '13px 16px' : '10px 16px',
          background: isLight ? 'transparent' : '#F0EDE8',
          border: isLight ? 'none' : `1px solid ${open ? '#C9A84C' : 'transparent'}`,
          borderRadius: isLight ? '0' : '6px',
          cursor: 'pointer',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: 400,
          color: selected ? '#1A1A2E' : '#8A8FA8',
          transition: 'border-color 0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={14}
          style={{
            color: '#4A5568',
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            minWidth: '100%',
            background: '#FFFFFF',
            border: '1px solid #E8E4DC',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(26,26,46,0.12)',
            zIndex: 999,
            overflow: 'hidden',
            padding: '4px',
          }}
        >
          {[{ value: '', label: placeholder }, ...options].map(option => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 14px',
                  background: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: isActive ? '#C9A84C' : '#1A1A2E',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: isActive ? 500 : 400,
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#F0EDE8';
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
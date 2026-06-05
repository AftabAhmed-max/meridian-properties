'use client';

import { useEffect, useState } from 'react';
import seedData from '@/data/properties.json';

export interface Agent {
  name: string;
  phone: string;
  email: string;
  photo: string;
}

export interface Property {
  id: string;
  name: string;
  type: string;
  status: string;
  price: number;
  currency: string;
  location: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  floor: string;
  developer: string;
  yearBuilt: number;
  lat: number;
  lng: number;
  images: string[];
  description: string;
  amenities: string[];
  featured: boolean;
  /** When true, the property is hidden from the public site (still editable in /admin). */
  hidden?: boolean;
  agent: Agent;
}

export const STORAGE_KEY = 'meridian_properties';

/** The original dataset, used to seed localStorage and as an SSR / first-render fallback. */
export const seedProperties = seedData as Property[];

/**
 * Read the property list from localStorage. On first ever load (empty key) the
 * seed data is written in as-is and returned. Falls back to the seed on the
 * server or if storage is unavailable / corrupt.
 */
export function loadProperties(): Property[] {
  if (typeof window === 'undefined') return seedProperties;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedProperties));
      return seedProperties;
    }
    return JSON.parse(raw) as Property[];
  } catch {
    return seedProperties;
  }
}

/** Persist the full property list to localStorage. */
export function saveProperties(properties: Property[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
}

/**
 * Client hook that hydrates the property list from localStorage after mount.
 * Starts with the seed data so SSR / first paint has content, then swaps to the
 * stored list (which reflects any /admin edits) once on the client.
 *
 * `hydrated` flips to true after the client read so callers can avoid acting on
 * the seed-only state (e.g. firing notFound() before storage has loaded).
 */
export function useProperties(): { properties: Property[]; hydrated: boolean } {
  const [properties, setProperties] = useState<Property[]>(seedProperties);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProperties(loadProperties());
    setHydrated(true);
  }, []);

  return { properties, hydrated };
}

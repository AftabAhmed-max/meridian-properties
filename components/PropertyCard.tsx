import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

interface Property {
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
  images: string[];
  featured?: boolean;
}

export default function PropertyCard({ property }: { property: Property }) {
  const formattedPrice = new Intl.NumberFormat('en-AE').format(property.price);
  const priceLabel = property.status === 'rent' ? `AED ${formattedPrice}/yr` : `AED ${formattedPrice}`;

  return (
    <Link href={`/properties/${property.id}`} className="property-card">
      <div className="property-card-image">
        <Image
          src={property.images[0]}
          alt={property.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', gap: '8px', zIndex: 1 }}>
          <span className={`property-badge ${property.status === 'sale' ? 'property-badge-sale' : 'property-badge-rent'}`}
            style={{ background: property.status === 'sale' ? 'rgba(201,168,76,0.9)' : 'rgba(26,26,46,0.75)', color: '#FAF9F7', backdropFilter: 'blur(4px)' }}>
            For {property.status === 'sale' ? 'Sale' : 'Rent'}
          </span>
          <span className="property-badge"
            style={{ background: 'rgba(26,26,46,0.65)', color: '#FAF9F7', backdropFilter: 'blur(4px)', textTransform: 'capitalize' }}>
            {property.type}
          </span>
        </div>
        {property.featured && (
          <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1 }}>
            <span style={{ background: '#C9A84C', color: '#FAF9F7', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '3px' }}>
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="property-card-body">
        <p className="property-price">{priceLabel}</p>
        <p className="property-name">{property.name}</p>
        <p className="property-location">
          <MapPin size={12} />
          {property.location}, {property.city}
        </p>
        <div className="property-specs">
          {property.type !== 'commercial' && (
            <>
              <span className="property-spec">
                <Bed size={14} style={{ color: '#C9A84C' }} />
                {property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}
              </span>
              <span className="property-spec">
                <Bath size={14} style={{ color: '#C9A84C' }} />
                {property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}
              </span>
            </>
          )}
          <span className="property-spec">
            <Square size={14} style={{ color: '#C9A84C' }} />
            {property.area.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </Link>
  );
}

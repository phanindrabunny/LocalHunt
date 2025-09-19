'use client';

import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import type { Vendor } from '@/lib/types';
import { useMemo } from 'react';

type MapViewProps = {
  vendors: Vendor[];
  userLocation: { lat: number; lng: number } | null;
};

export default function MapView({ vendors, userLocation }: MapViewProps) {
  const defaultCenter = useMemo(() => ({ lat: 37.7749, lng: -122.4194 }), []);
  
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-full w-full bg-muted flex flex-col items-center justify-center text-center p-4">
        <p className="text-lg font-semibold text-muted-foreground">Map Unavailable</p>
        <p className="text-sm text-muted-foreground mt-2">
          The Google Maps API key is missing. Please configure it to enable the map view.
        </p>
      </div>
    );
  }

  const mapCenter = userLocation || defaultCenter;

  return (
    <Map
      style={{ width: '100%', height: '100%' }}
      defaultCenter={defaultCenter}
      center={mapCenter}
      defaultZoom={12}
      gestureHandling={'greedy'}
      disableDefaultUI={true}
      mapId="local_finder_map"
    >
      {vendors.map((vendor) => (
        <AdvancedMarker key={vendor.id} position={vendor.location}>
          <Pin 
            background={'hsl(var(--primary))'} 
            borderColor={'hsl(var(--primary-foreground))'} 
            glyphColor={'hsl(var(--primary-foreground))'}
          />
        </AdvancedMarker>
      ))}
      {userLocation && (
        <AdvancedMarker position={userLocation} title="Your Location">
            <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-accent border-2 border-white"></span>
            </span>
        </AdvancedMarker>
      )}
    </Map>
  );
}

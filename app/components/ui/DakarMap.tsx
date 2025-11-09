'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { ZONES_SENEGAL } from '@/app/data/mockData';

interface Zone {
  zone: string;
  infractions: number;
  lat: number;
  lng: number;
  variation: string;
}

interface Props {
  zones?: Zone[];
}

export default function DakarMapbox({ zones = [] }: Props) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-17.4441, 14.6937], // Centre de Dakar [lng, lat]
      zoom: 11, // Zoom sur Dakar
      interactive: false, // pas de zoom ni déplacement
    });

    // Utiliser les zones centralisées (uniquement Dakar)
    const dakarZones = ZONES_SENEGAL.filter(z => z.region === 'Dakar');

    // Fusionner les zones passées en props avec les zones centralisées
    const mergedZones = [...dakarZones];

    // Remplacer les zones qui sont dans props
    zones.forEach(propsZone => {
      const index = mergedZones.findIndex(z => z.zone === propsZone.zone);
      if (index !== -1) {
        mergedZones[index] = propsZone;
      } else {
        mergedZones.push(propsZone);
      }
    });

    // Créer des marqueurs circulaires pour chaque zone
    mergedZones.forEach((zone) => {
      // Créer un élément HTML pour le marqueur circulaire
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = '#3d5a5c';
      el.style.border = '2px solid #ffffff';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      // Créer le marqueur avec l'élément personnalisé
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([zone.lng, zone.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 15, closeButton: false }).setHTML(
            `<div style="padding: 8px; font-family: system-ui, -apple-system, sans-serif;">
               <div style="font-weight: 600; color: #3d5a5c; margin-bottom: 4px; font-size: 14px;">${zone.zone}</div>
               <div style="color: #64748b; font-size: 12px; margin-bottom: 2px;">
                 <span style="font-weight: 500;">Infractions:</span> ${zone.infractions}
               </div>
               <div style="color: ${zone.variation.includes('+') ? '#10b981' : '#ef4444'}; font-size: 12px; font-weight: 500;">
                 ${zone.variation}
               </div>
             </div>`
          )
        )
        .addTo(mapInstance);
    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, [zones]);

  return <div ref={mapContainer} className="w-full h-120 sm:h-120 rounded-xl border border-gray-200" />;
}

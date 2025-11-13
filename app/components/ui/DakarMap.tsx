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
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);

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

    // Attendre que la carte soit chargée pour ajouter la heatmap
    mapInstance.on('load', () => {
      // Créer des points de densité basés sur les infractions
      const heatmapFeatures: any[] = [];

      mergedZones.forEach(zone => {
        // Générer des points proportionnellement aux infractions
        // Densité minimale pour zone rouge très petite
        const basePoints = Math.floor(zone.infractions * 1.5); // Multiplier par 1.5 seulement
        const pointsCount = Math.max(15, basePoints); // Minimum 15 points par zone

        for (let i = 0; i < pointsCount; i++) {
          // Distribution gaussienne pour concentration au centre avec dispersion naturelle
          const randomAngle = Math.random() * 2 * Math.PI;

          // Distribution gaussienne pour un effet plus naturel
          const u1 = Math.random();
          const u2 = Math.random();
          const gaussianRandom = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);

          // Distance avec distribution gaussienne (70% des points dans un rayon de 0.01°)
          const randomDistance = Math.abs(gaussianRandom) * 0.003; // ~300m concentration ultra-compacte

          const offsetLng = Math.cos(randomAngle) * randomDistance;
          const offsetLat = Math.sin(randomAngle) * randomDistance;

          // Ajouter un poids proportionnel au nombre d'infractions
          heatmapFeatures.push({
            type: 'Feature',
            properties: {
              infractions: zone.infractions,
              zone: zone.zone,
              weight: Math.min(zone.infractions / 100, 1) // Poids normalisé
            },
            geometry: {
              type: 'Point',
              coordinates: [zone.lng + offsetLng, zone.lat + offsetLat]
            }
          });
        }
      });

      const heatmapData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: heatmapFeatures
      };

      // Ajouter la source de données
      mapInstance.addSource('infractions-heat', {
        type: 'geojson',
        data: heatmapData
      });

      // Ajouter la couche heatmap avec configuration professionnelle optimisée
      mapInstance.addLayer({
        id: 'infractions-heatmap',
        type: 'heatmap',
        source: 'infractions-heat',
        maxzoom: 18,
        paint: {
          // Poids dynamique basé sur les propriétés des points
          'heatmap-weight': [
            'interpolate',
            ['exponential', 2],
            ['get', 'infractions'],
            0, 0,
            10, 0.2,
            30, 0.5,
            50, 0.8,
            85, 1
          ],

          // Intensité très faible pour zone rouge minimale
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.5,
            9, 0.8,
            12, 1.0,
            15, 1.2
          ],

          // Gradient thermique optimisé : Bleu → Orange → Rouge
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',              // Transparent (pas de données)
            0.05, 'rgba(0, 100, 255, 0.3)',     // Bleu profond (très faible)
            0.15, 'rgba(0, 150, 255, 0.5)',     // Bleu vif (faible densité - zone bien)
            0.25, 'rgba(50, 180, 255, 0.6)',    // Bleu clair
            0.35, 'rgba(100, 200, 255, 0.65)',  // Bleu très clair
            0.45, 'rgba(255, 200, 0, 0.7)',     // Jaune-orange (transition)
            0.55, 'rgba(255, 170, 0, 0.75)',    // Orange clair (densité moyenne)
            0.65, 'rgba(255, 140, 0, 0.8)',     // Orange moyen
            0.75, 'rgba(255, 100, 0, 0.85)',    // Orange foncé
            0.82, 'rgba(255, 60, 0, 0.9)',      // Rouge-orange (haute densité)
            0.9, 'rgba(255, 30, 0, 0.95)',      // Rouge vif
            1.0, 'rgba(200, 0, 0, 1)'           // Rouge intense (zone critique)
          ],

          // Rayon très petit pour zone rouge ultra-compacte
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 12,
            9, 20,
            11, 28,
            13, 38,
            15, 50,
            17, 60
          ],

          // Opacité faible pour zone rouge très discrète
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.55,
            11, 0.5,
            15, 0.45
          ]
        }
      });

    });

    setMap(mapInstance);

    return () => mapInstance.remove();
  }, [zones]);

  // Fonction pour générer un numéro de caméra basé sur le nom de la zone
  const getCameraNumber = (zoneName: string) => {
    const hash = zoneName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return String(hash % 20 + 1).padStart(2, '0');
  };

  return (
    <>
      <div ref={mapContainer} className="w-full h-120 sm:h-120 rounded-xl border border-gray-200" />

      {/* Modal Vidéo */}
      {showVideoModal && selectedZone && (
        <div
          className="fixed inset-0 bg-[#00000095] z-50 flex items-center justify-center p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00124c] to-[#2d4a4c] px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Vue en Direct - {selectedZone.zone}
                </h3>
                <p className="text-sm text-gray-200 mt-1">
                  Caméra VisionIA-{getCameraNumber(selectedZone.zone)} | {selectedZone.infractions} infractions détectées
                </p>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video Container */}
            <div className="bg-black aspect-video relative">
              {/* Vidéo réelle */}
              <video
                className="w-full h-full object-cover"
                autoPlay
                controls
                loop
                muted
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                src="/video_video.mp4"
              >
                Votre navigateur ne supporte pas la vidéo.
              </video>

              {/* Overlay d'informations par-dessus la vidéo */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-500/50 pointer-events-none">
                <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  EN DIRECT
                </div>
                <div className="text-white text-xs mt-1 font-mono">
                  {new Date().toLocaleTimeString('fr-FR')}
                </div>
              </div>

              {/* Informations de la zone */}
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-500/50 pointer-events-none">
                <div className="text-green-400 text-xs font-mono">CAM-{getCameraNumber(selectedZone.zone)}</div>
                <div className="text-white text-xs font-mono">{selectedZone.zone}</div>
              </div>

              {/* Détections récentes (simulation) */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm px-4 py-3 rounded-lg border border-yellow-500/50 pointer-events-none">
                <div className="text-yellow-400 text-xs font-semibold mb-2">DÉTECTIONS RÉCENTES</div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-red-500/20 border border-red-500/50 rounded px-2 py-1">
                    <div className="text-red-400 font-mono">Excès vitesse</div>
                    <div className="text-gray-300">Il y a 2 min</div>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded px-2 py-1">
                    <div className="text-orange-400 font-mono">Stationnement</div>
                    <div className="text-gray-300">Il y a 8 min</div>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded px-2 py-1">
                    <div className="text-yellow-400 font-mono">Feu rouge</div>
                    <div className="text-gray-300">Il y a 15 min</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer avec statistiques */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#00124c]">{selectedZone.infractions}</div>
                  <div className="text-xs text-gray-600">Infractions</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${selectedZone.variation.includes('+') ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedZone.variation}
                  </div>
                  <div className="text-xs text-gray-600">Variation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Actif
                    </div>
                  </div>
                  <div className="text-xs text-gray-600">Statut</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

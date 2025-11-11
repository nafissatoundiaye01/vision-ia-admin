'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CustomSelect from '@/app/components/ui/CustomSelect';
import DateRangePicker from '@/app/components/ui/DateRangePicker';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '';

// Custom CSS for popup and markers
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    .zone-popup .mapboxgl-popup-content {
      padding: 0;
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      border: none;
    }
    .zone-popup .mapboxgl-popup-tip {
      border-top-color: white;
    }
    .zone-popup .mapboxgl-popup-close-button {
      font-size: 20px;
      padding: 8px;
      color: #9ca3af;
    }
    .zone-popup .mapboxgl-popup-close-button:hover {
      background-color: #f3f4f6;
      color: #3d5a5c;
    }
    .mapboxgl-marker {
      z-index: 10;
      will-change: transform;
    }
    .zone-marker, .camera-marker {
      pointer-events: auto;
    }
  `;
  document.head.appendChild(style);
}

interface ZoneData {
  name: string;
  lat: number;
  lng: number;
  totalInfractions: number;
  severity: 'critique' | 'moyen' | 'faible';
  infractions: {
    type: string;
    count: number;
  }[];
  history: {
    date: string;
    total: number;
  }[];
}

interface CameraData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zone: string;
  status: 'active' | 'inactive' | 'maintenance';
  infractions: number;
  variation: string;
  severity: 'critique' | 'moyen' | 'faible';
}

export default function MapPage() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'critique' | 'moyen' | 'faible'>('all');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [popupInfo, setPopupInfo] = useState<ZoneData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [mapView, setMapView] = useState<'infractions' | 'cameras'>('infractions');
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Données brutes avec historique journalier
  const rawZonesData: ZoneData[] = [
    {
      name: 'Dakar Plateau',
      lat: 14.6737,
      lng: -17.4479,
      totalInfractions: 0,
      severity: 'critique',
      infractions: [
        { type: 'Excès de vitesse', count: 35 },
        { type: 'Feu rouge grillé', count: 28 },
        { type: 'Stationnement interdit', count: 26 },
      ],
      history: [
        { date: '2025-11-01', total: 15 },
        { date: '2025-11-02', total: 18 },
        { date: '2025-11-03', total: 12 },
        { date: '2025-11-04', total: 20 },
        { date: '2025-11-05', total: 14 },
        { date: '2025-11-06', total: 22 },
        { date: '2025-11-07', total: 25 },
        { date: '2025-11-08', total: 23 },
      ]
    },
    {
      name: 'Almadies',
      lat: 14.7297,
      lng: -17.4896,
      totalInfractions: 0,
      severity: 'moyen',
      infractions: [
        { type: 'Stationnement interdit', count: 25 },
        { type: 'Excès de vitesse', count: 18 },
        { type: 'Téléphone au volant', count: 9 },
      ],
      history: [
        { date: '2025-11-01', total: 8 },
        { date: '2025-11-02', total: 12 },
        { date: '2025-11-03', total: 10 },
        { date: '2025-11-04', total: 14 },
        { date: '2025-11-05', total: 9 },
        { date: '2025-11-06', total: 15 },
        { date: '2025-11-07', total: 11 },
        { date: '2025-11-08', total: 13 },
      ]
    },
    {
      name: 'Point E',
      lat: 14.7040,
      lng: -17.4655,
      totalInfractions: 0,
      severity: 'critique',
      infractions: [
        { type: 'Feu rouge grillé', count: 32 },
        { type: 'Excès de vitesse', count: 24 },
        { type: 'Téléphone au volant', count: 17 },
      ],
      history: [
        { date: '2025-11-01', total: 14 },
        { date: '2025-11-02', total: 17 },
        { date: '2025-11-03', total: 13 },
        { date: '2025-11-04', total: 19 },
        { date: '2025-11-05', total: 15 },
        { date: '2025-11-06', total: 21 },
        { date: '2025-11-07', total: 18 },
        { date: '2025-11-08', total: 16 },
      ]
    },
    {
      name: 'Ouest Foire',
      lat: 14.7348,
      lng: -17.4765,
      totalInfractions: 0,
      severity: 'moyen',
      infractions: [
        { type: 'Stationnement interdit', count: 22 },
        { type: 'Absence ceinture', count: 13 },
        { type: 'Téléphone au volant', count: 10 },
      ],
      history: [
        { date: '2025-11-01', total: 7 },
        { date: '2025-11-02', total: 11 },
        { date: '2025-11-03', total: 9 },
        { date: '2025-11-04', total: 13 },
        { date: '2025-11-05', total: 8 },
        { date: '2025-11-06', total: 14 },
        { date: '2025-11-07', total: 10 },
        { date: '2025-11-08', total: 12 },
      ]
    },
    {
      name: 'Parcelles Assainies',
      lat: 14.7697,
      lng: -17.4150,
      totalInfractions: 0,
      severity: 'faible',
      infractions: [
        { type: 'Stationnement interdit', count: 12 },
        { type: 'Absence ceinture', count: 10 },
        { type: 'Document périmé', count: 6 },
      ],
      history: [
        { date: '2025-11-01', total: 5 },
        { date: '2025-11-02', total: 7 },
        { date: '2025-11-03', total: 6 },
        { date: '2025-11-04', total: 8 },
        { date: '2025-11-05', total: 4 },
        { date: '2025-11-06', total: 9 },
        { date: '2025-11-07', total: 7 },
        { date: '2025-11-08', total: 6 },
      ]
    },
    {
      name: 'Pikine',
      lat: 14.7564,
      lng: -17.3900,
      totalInfractions: 0,
      severity: 'critique',
      infractions: [
        { type: 'Excès de vitesse', count: 28 },
        { type: 'Feu rouge grillé', count: 20 },
        { type: 'Téléphone au volant', count: 16 },
      ],
      history: [
        { date: '2025-11-01', total: 12 },
        { date: '2025-11-02', total: 15 },
        { date: '2025-11-03', total: 11 },
        { date: '2025-11-04', total: 17 },
        { date: '2025-11-05', total: 13 },
        { date: '2025-11-06', total: 19 },
        { date: '2025-11-07', total: 16 },
        { date: '2025-11-08', total: 14 },
      ]
    },
    {
      name: 'Guédiawaye',
      lat: 14.7689,
      lng: -17.4070,
      totalInfractions: 0,
      severity: 'moyen',
      infractions: [
        { type: 'Stationnement interdit', count: 18 },
        { type: 'Absence ceinture', count: 12 },
        { type: 'Excès de vitesse', count: 8 },
      ],
      history: [
        { date: '2025-11-01', total: 6 },
        { date: '2025-11-02', total: 9 },
        { date: '2025-11-03', total: 7 },
        { date: '2025-11-04', total: 11 },
        { date: '2025-11-05', total: 8 },
        { date: '2025-11-06', total: 12 },
        { date: '2025-11-07', total: 9 },
        { date: '2025-11-08', total: 10 },
      ]
    },
    {
      name: 'Rufisque',
      lat: 14.7167,
      lng: -17.2674,
      totalInfractions: 0,
      severity: 'faible',
      infractions: [
        { type: 'Document périmé', count: 15 },
        { type: 'Stationnement interdit', count: 10 },
        { type: 'Absence ceinture', count: 6 },
      ],
      history: [
        { date: '2025-11-01', total: 4 },
        { date: '2025-11-02', total: 6 },
        { date: '2025-11-03', total: 5 },
        { date: '2025-11-04', total: 7 },
        { date: '2025-11-05', total: 3 },
        { date: '2025-11-06', total: 8 },
        { date: '2025-11-07', total: 6 },
        { date: '2025-11-08', total: 5 },
      ]
    },
  ];

  const [filteredZonesData, setFilteredZonesData] = useState<ZoneData[]>(rawZonesData);

  // Données des caméras de surveillance (criticité basée sur infractions: >60=critique, 30-60=moyen, <30=faible)
  // Coordonnées corrigées pour rester sur terre à Dakar (lng doit être entre -17.50 et -17.40 pour Dakar)
  const camerasData: CameraData[] = [
    // Dakar Plateau - 6 caméras
    { id: 'CAM-001', name: 'Caméra Plateau Central', lat: 14.6737, lng: -17.4479, zone: 'Dakar Plateau', status: 'active', infractions: 89, variation: '+12%', severity: 'critique' },
    { id: 'CAM-002', name: 'Caméra Plateau Nord', lat: 14.6850, lng: -17.4480, zone: 'Dakar Plateau', status: 'active', infractions: 67, variation: '+8%', severity: 'critique' },
    { id: 'CAM-003', name: 'Caméra Place Indépendance', lat: 14.6778, lng: -17.4467, zone: 'Dakar Plateau', status: 'active', infractions: 78, variation: '+11%', severity: 'critique' },
    { id: 'CAM-004', name: 'Caméra Avenue Pompidou', lat: 14.6690, lng: -17.4420, zone: 'Dakar Plateau', status: 'active', infractions: 56, variation: '+7%', severity: 'moyen' },
    { id: 'CAM-005', name: 'Caméra Port de Dakar', lat: 14.6650, lng: -17.4380, zone: 'Dakar Plateau', status: 'maintenance', infractions: 0, variation: '0%', severity: 'faible' },
    { id: 'CAM-006', name: 'Caméra Plateau Sud', lat: 14.6700, lng: -17.4450, zone: 'Dakar Plateau', status: 'active', infractions: 62, variation: '+9%', severity: 'critique' },

    // Almadies - 5 caméras (corrigées pour rester sur la côte)
    { id: 'CAM-007', name: 'Caméra Almadies Plage', lat: 14.7297, lng: -17.4896, zone: 'Almadies', status: 'active', infractions: 52, variation: '+5%', severity: 'moyen' },
    { id: 'CAM-008', name: 'Caméra Almadies Centre', lat: 14.7350, lng: -17.4820, zone: 'Almadies', status: 'active', infractions: 45, variation: '+3%', severity: 'moyen' },
    { id: 'CAM-009', name: 'Caméra Ngor', lat: 14.7450, lng: -17.4900, zone: 'Almadies', status: 'active', infractions: 38, variation: '+2%', severity: 'moyen' },
    { id: 'CAM-010', name: 'Caméra Ouakam', lat: 14.7200, lng: -17.4850, zone: 'Almadies', status: 'active', infractions: 41, variation: '+4%', severity: 'moyen' },
    { id: 'CAM-011', name: 'Caméra Mamelles', lat: 14.7100, lng: -17.4750, zone: 'Almadies', status: 'active', infractions: 35, variation: '+1%', severity: 'moyen' },

    // Point E - 5 caméras
    { id: 'CAM-012', name: 'Caméra Point E Principal', lat: 14.7040, lng: -17.4655, zone: 'Point E', status: 'active', infractions: 73, variation: '+15%', severity: 'critique' },
    { id: 'CAM-013', name: 'Caméra Point E Sud', lat: 14.6990, lng: -17.4600, zone: 'Point E', status: 'active', infractions: 61, variation: '+10%', severity: 'critique' },
    { id: 'CAM-014', name: 'Caméra Fann Résidence', lat: 14.7080, lng: -17.4700, zone: 'Point E', status: 'active', infractions: 55, variation: '+8%', severity: 'moyen' },
    { id: 'CAM-015', name: 'Caméra Amitié', lat: 14.7020, lng: -17.4580, zone: 'Point E', status: 'active', infractions: 68, variation: '+13%', severity: 'critique' },
    { id: 'CAM-016', name: 'Caméra Mermoz', lat: 14.7150, lng: -17.4520, zone: 'Point E', status: 'maintenance', infractions: 0, variation: '0%', severity: 'faible' },

    // Ouest Foire - 4 caméras
    { id: 'CAM-017', name: 'Caméra Ouest Foire', lat: 14.7348, lng: -17.4765, zone: 'Ouest Foire', status: 'active', infractions: 45, variation: '+7%', severity: 'moyen' },
    { id: 'CAM-018', name: 'Caméra Yoff', lat: 14.7450, lng: -17.4650, zone: 'Ouest Foire', status: 'active', infractions: 39, variation: '+5%', severity: 'moyen' },
    { id: 'CAM-019', name: 'Caméra HLM Grand Yoff', lat: 14.7520, lng: -17.4620, zone: 'Ouest Foire', status: 'active', infractions: 42, variation: '+6%', severity: 'moyen' },
    { id: 'CAM-020', name: 'Caméra Cité Millionnaire', lat: 14.7280, lng: -17.4700, zone: 'Ouest Foire', status: 'active', infractions: 37, variation: '+4%', severity: 'moyen' },

    // Parcelles Assainies - 4 caméras (coordonnées corrigées - zone est de Dakar)
    { id: 'CAM-021', name: 'Caméra Parcelles U10', lat: 14.7697, lng: -17.4150, zone: 'Parcelles Assainies', status: 'active', infractions: 28, variation: '+2%', severity: 'faible' },
    { id: 'CAM-022', name: 'Caméra Parcelles U20', lat: 14.7750, lng: -17.4100, zone: 'Parcelles Assainies', status: 'maintenance', infractions: 0, variation: '0%', severity: 'faible' },
    { id: 'CAM-023', name: 'Caméra Parcelles U15', lat: 14.7720, lng: -17.4125, zone: 'Parcelles Assainies', status: 'active', infractions: 24, variation: '+1%', severity: 'faible' },
    { id: 'CAM-024', name: 'Caméra Cambérène', lat: 14.7800, lng: -17.4050, zone: 'Parcelles Assainies', status: 'active', infractions: 21, variation: '0%', severity: 'faible' },

    // Pikine - 5 caméras
    { id: 'CAM-025', name: 'Caméra Pikine Centre', lat: 14.7564, lng: -17.3950, zone: 'Pikine', status: 'active', infractions: 64, variation: '+9%', severity: 'critique' },
    { id: 'CAM-026', name: 'Caméra Pikine Est', lat: 14.7600, lng: -17.3850, zone: 'Pikine', status: 'active', infractions: 58, variation: '+6%', severity: 'moyen' },
    { id: 'CAM-027', name: 'Caméra Thiaroye', lat: 14.7700, lng: -17.3600, zone: 'Pikine', status: 'active', infractions: 52, variation: '+8%', severity: 'moyen' },
    { id: 'CAM-028', name: 'Caméra Guinaw Rails', lat: 14.7500, lng: -17.3900, zone: 'Pikine', status: 'active', infractions: 47, variation: '+5%', severity: 'moyen' },
    { id: 'CAM-029', name: 'Caméra Dalifort', lat: 14.7650, lng: -17.3750, zone: 'Pikine', status: 'maintenance', infractions: 0, variation: '0%', severity: 'faible' },

    // Guédiawaye - 3 caméras
    { id: 'CAM-030', name: 'Caméra Guédiawaye Centre', lat: 14.7689, lng: -17.4070, zone: 'Guédiawaye', status: 'active', infractions: 38, variation: '+4%', severity: 'moyen' },
    { id: 'CAM-031', name: 'Caméra Sam Notaire', lat: 14.7750, lng: -17.4100, zone: 'Guédiawaye', status: 'active', infractions: 33, variation: '+3%', severity: 'moyen' },
    { id: 'CAM-032', name: 'Caméra Golf Sud', lat: 14.7620, lng: -17.4050, zone: 'Guédiawaye', status: 'active', infractions: 29, variation: '+2%', severity: 'faible' },

    // Rufisque - 3 caméras
    { id: 'CAM-033', name: 'Caméra Rufisque Centre', lat: 14.7167, lng: -17.2674, zone: 'Rufisque', status: 'active', infractions: 31, variation: '+1%', severity: 'moyen' },
    { id: 'CAM-034', name: 'Caméra Rufisque Est', lat: 14.7200, lng: -17.2550, zone: 'Rufisque', status: 'active', infractions: 26, variation: '0%', severity: 'faible' },
    { id: 'CAM-035', name: 'Caméra Bargny', lat: 14.6950, lng: -17.2300, zone: 'Rufisque', status: 'active', infractions: 23, variation: '-1%', severity: 'faible' },
  ];

  useEffect(() => {
    if (!startDate || !endDate) {
      const zonesWithTotals = rawZonesData.map(zone => ({
        ...zone,
        totalInfractions: zone.history.reduce((acc, h) => acc + h.total, 0)
      }));
      setFilteredZonesData(zonesWithTotals);
      return;
    }

    const filtered = rawZonesData.map(zone => {
      const totalInPeriod = zone.history
        .filter(h => {
          const d = new Date(h.date);
          return d >= startDate && d <= endDate;
        })
        .reduce((acc, h) => acc + h.total, 0);

      return { ...zone, totalInfractions: totalInPeriod };
    });

    setFilteredZonesData(filtered);
  }, [startDate, endDate]);

  const zones = filteredZonesData.map(z => z.name);

  const getSeverityColor = (severity: ZoneData['severity']) => {
    switch (severity) {
      case 'critique': return '#ef4444';
      case 'moyen': return '#f97316';
      case 'faible': return '#22c55e';
      default: return '#6b7280';
    }
  };

  // Fonction d'export PDF
  const handleExportPDF = async () => {
    if (!mapInstance.current) return;
    
    setIsExporting(true);
    
    try {
      // Charger jsPDF dynamiquement
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // En-tête
      pdf.setFillColor(61, 90, 92);
      pdf.rect(0, 0, pageWidth, 40, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Rapport d\'Infractions Routières', pageWidth / 2, 20, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const dateStr = new Date().toLocaleDateString('fr-FR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
      });
      pdf.text(`Généré le ${dateStr}`, pageWidth / 2, 30, { align: 'center' });

      yPosition = 50;

      // Informations sur les filtres appliqués
      pdf.setTextColor(61, 90, 92);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Filtres appliqués', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);
      
      const filterText = [];
      if (selectedFilter !== 'all') {
        filterText.push(`Criticité: ${selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}`);
      }
      if (selectedZone !== 'all') {
        filterText.push(`Zone: ${selectedZone}`);
      }
      if (startDate && endDate) {
        const start = startDate.toLocaleDateString('fr-FR');
        const end = endDate.toLocaleDateString('fr-FR');
        filterText.push(`Période: ${start} - ${end}`);
      }
      
      if (filterText.length > 0) {
        pdf.text(filterText.join(' | '), margin, yPosition);
        yPosition += 8;
      } else {
        pdf.text('Aucun filtre appliqué - Vue d\'ensemble complète', margin, yPosition);
        yPosition += 8;
      }

      // Statistiques globales
      yPosition += 5;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(61, 90, 92);
      pdf.text('Statistiques globales', margin, yPosition);
      yPosition += 10;

      const displayedZones = filteredZonesData.filter(zone =>
        (selectedFilter === 'all' || zone.severity === selectedFilter) &&
        (selectedZone === 'all' || zone.name === selectedZone) &&
        zone.totalInfractions > 0
      );

      const totalInfractions = displayedZones.reduce((acc, zone) => acc + zone.totalInfractions, 0);
      const criticalZones = filteredZonesData.filter(z => z.severity === 'critique' && z.totalInfractions > 0).length;
      const mediumZones = filteredZonesData.filter(z => z.severity === 'moyen' && z.totalInfractions > 0).length;
      const lowZones = filteredZonesData.filter(z => z.severity === 'faible' && z.totalInfractions > 0).length;

      const boxWidth = (pageWidth - 3 * margin) / 4;
      const boxHeight = 20;
      
      const stats = [
        { label: 'Total', value: totalInfractions, color: [61, 90, 92] },
        { label: 'Critiques', value: criticalZones, color: [239, 68, 68] },
        { label: 'Moyennes', value: mediumZones, color: [249, 115, 22] },
        { label: 'Faibles', value: lowZones, color: [34, 197, 94] }
      ];

      stats.forEach((stat, i) => {
        const x = margin + i * (boxWidth + 5);
        pdf.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
        pdf.rect(x, yPosition, boxWidth, boxHeight, 'F');
        
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text(stat.value.toString(), x + boxWidth / 2, yPosition + 10, { align: 'center' });
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(stat.label, x + boxWidth / 2, yPosition + 16, { align: 'center' });
      });

      yPosition += boxHeight + 15;

      // Capture de la carte
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(61, 90, 92);
      pdf.text('Cartographie des zones', margin, yPosition);
      yPosition += 8;

      if (mapContainer.current && mapInstance.current) {
        try {
          // Forcer le rendu de la carte
          mapInstance.current.resize();
          
          // Attendre que la carte soit complètement rendue
          await new Promise<void>((resolve) => {
            const checkAndResolve = () => {
              if (mapInstance.current?.loaded() && 
                  !mapInstance.current?.isMoving() && 
                  mapInstance.current?.areTilesLoaded()) {
                resolve();
              } else {
                setTimeout(checkAndResolve, 100);
              }
            };
            checkAndResolve();
          });

          // Délai supplémentaire pour garantir le rendu complet
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Capturer le canvas Mapbox
          const mapCanvas = mapInstance.current.getCanvas();
          
          // Créer un nouveau canvas pour combiner la carte et les marqueurs
          const combinedCanvas = document.createElement('canvas');
          combinedCanvas.width = mapCanvas.width;
          combinedCanvas.height = mapCanvas.height;
          const ctx = combinedCanvas.getContext('2d');
          
          if (ctx) {
            // Dessiner la carte
            ctx.drawImage(mapCanvas, 0, 0);
            
            // Dessiner les marqueurs par-dessus
            const markers = mapContainer.current.querySelectorAll('.zone-marker');
            markers.forEach((marker) => {
              const markerEl = marker as HTMLElement;
              const rect = markerEl.getBoundingClientRect();
              const containerRect = mapContainer.current!.getBoundingClientRect();
              
              // Position relative dans le conteneur
              const x = rect.left - containerRect.left;
              const y = rect.top - containerRect.top;
              const size = parseFloat(markerEl.style.width);
              
              // Dessiner le cercle du marqueur
              const bgColor = markerEl.style.backgroundColor;
              ctx.fillStyle = bgColor;
              ctx.beginPath();
              ctx.arc(x + size/2, y + size/2, size/2, 0, 2 * Math.PI);
              ctx.fill();
              
              // Bordure blanche
              ctx.strokeStyle = 'white';
              ctx.lineWidth = 4;
              ctx.stroke();
              
              // Texte du marqueur
              const text = markerEl.textContent || '';
              ctx.fillStyle = 'white';
              ctx.font = 'bold 14px Arial';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(text, x + size/2, y + size/2);
            });
          }
          
          const imgData = combinedCanvas.toDataURL('image/png', 1.0);
          
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (combinedCanvas.height * imgWidth) / combinedCanvas.width;
          
          // Limiter la hauteur
          const maxHeight = pageHeight - yPosition - margin - 10;
          let finalHeight = imgHeight;
          let finalWidth = imgWidth;
          
          if (imgHeight > maxHeight) {
            finalHeight = maxHeight;
            finalWidth = (combinedCanvas.width * finalHeight) / combinedCanvas.height;
          }
          
          if (yPosition + finalHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          
          pdf.addImage(imgData, 'PNG', margin, yPosition, finalWidth, finalHeight);
          yPosition += finalHeight + 10;
        } catch (err) {
          console.error('Erreur capture carte:', err);
          // Si la capture échoue, on continue sans la carte
          pdf.setFontSize(10);
          pdf.setTextColor(150, 150, 150);
          pdf.text('(Carte non disponible dans ce rapport)', margin, yPosition);
          yPosition += 10;
        }
      }

      // Détails par zone
      pdf.addPage();
      yPosition = margin;
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(61, 90, 92);
      pdf.text('Détails par zone', margin, yPosition);
      yPosition += 10;

      displayedZones.sort((a, b) => b.totalInfractions - a.totalInfractions).forEach((zone, index) => {
        if (yPosition > pageHeight - 60) {
          pdf.addPage();
          yPosition = margin;
        }

        // Nom de la zone et badge de criticité
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 12, 'F');
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(61, 90, 92);
        pdf.text(`${index + 1}. ${zone.name}`, margin + 3, yPosition + 8);
        
        // Badge de criticité
        const severityColors = {
          critique: [239, 68, 68],
          moyen: [249, 115, 22],
          faible: [34, 197, 94]
        };
        const badgeColor = severityColors[zone.severity];
        const badgeX = pageWidth - margin - 25;
        pdf.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
        pdf.roundedRect(badgeX, yPosition + 2, 22, 8, 2, 2, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(zone.severity.toUpperCase(), badgeX + 11, yPosition + 7, { align: 'center' });
        
        yPosition += 15;

        // Total d'infractions
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(80, 80, 80);
        pdf.text(`Total d'infractions: `, margin + 3, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(239, 68, 68);
        pdf.text(`${zone.totalInfractions}`, margin + 45, yPosition);
        yPosition += 8;

        // Types d'infractions
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(61, 90, 92);
        pdf.text('Types d\'infractions:', margin + 3, yPosition);
        yPosition += 6;

        zone.infractions.forEach((inf) => {
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(80, 80, 80);
          pdf.text(`• ${inf.type}`, margin + 6, yPosition);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`${inf.count}`, pageWidth - margin - 15, yPosition, { align: 'right' });
          yPosition += 5;
        });

        yPosition += 5;
      });

      // Pied de page sur chaque page
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.setFont('helvetica', 'normal');
        pdf.text(
          `Page ${i} sur ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.text(
          'Rapport généré par le Système de Gestion des Infractions Routières',
          pageWidth / 2,
          pageHeight - 6,
          { align: 'center' }
        );
      }

      // Télécharger le PDF
      const fileName = `rapport-infractions-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF. Veuillez réessayer.');
    } finally {
      setIsExporting(false);
    }
  };

  // Init map
  useEffect(() => {
    if (mapContainer.current && !mapInstance.current) {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-17.4677, 14.7167],
        zoom: 13,
        attributionControl: false,
        preserveDrawingBuffer: true, // CRUCIAL pour la capture du canvas
      });

      map.on('load', () => {
        console.log('Map loaded successfully');
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const markerElementsRef = useRef<HTMLDivElement[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!mapInstance.current) return;

    const checkMapLoaded = () => {
      if (mapInstance.current?.loaded()) {
        setMapLoaded(true);
      } else {
        mapInstance.current?.on('load', () => {
          setMapLoaded(true);
        });
      }
    };

    checkMapLoaded();
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !mapLoaded) return;

    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
    markerElementsRef.current = [];

    if (mapView === 'infractions') {
      // Vue des infractions par zones avec heatmap intégrée
      const displayedZones = filteredZonesData.filter(zone =>
        (selectedFilter === 'all' || zone.severity === selectedFilter) &&
        (selectedZone === 'all' || zone.name === selectedZone) &&
        zone.totalInfractions > 0
      );

      console.log('Adding markers for zones:', displayedZones.length);

      // Ajouter la couche de chaleur dans le mode infractions
      if (mapInstance.current) {
        // Supprimer l'ancienne heatmap si elle existe
        if (mapInstance.current.getLayer('infractions-heatmap')) {
          mapInstance.current.removeLayer('infractions-heatmap');
        }
        if (mapInstance.current.getSource('infractions-heat')) {
          mapInstance.current.removeSource('infractions-heat');
        }

        // Créer des points de densité basés sur les infractions
        const heatmapFeatures: any[] = [];

        displayedZones.forEach(zone => {
          const basePoints = Math.floor(zone.totalInfractions * 1.5);
          const pointsCount = Math.max(15, basePoints);

          for (let i = 0; i < pointsCount; i++) {
            const randomAngle = Math.random() * 2 * Math.PI;
            const u1 = Math.random();
            const u2 = Math.random();
            const gaussianRandom = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
            const randomDistance = Math.abs(gaussianRandom) * 0.003;

            const offsetLng = Math.cos(randomAngle) * randomDistance;
            const offsetLat = Math.sin(randomAngle) * randomDistance;

            heatmapFeatures.push({
              type: 'Feature',
              properties: {
                infractions: zone.totalInfractions,
                zone: zone.name
              },
              geometry: {
                type: 'Point',
                coordinates: [zone.lng + offsetLng, zone.lat + offsetLat]
              }
            });
          }
        });

        const heatmapData: any = {
          type: 'FeatureCollection',
          features: heatmapFeatures
        };

        // Ajouter la source de données
        mapInstance.current.addSource('infractions-heat', {
          type: 'geojson',
          data: heatmapData
        });

        // Ajouter la couche heatmap
        mapInstance.current.addLayer({
          id: 'infractions-heatmap',
          type: 'heatmap',
          source: 'infractions-heat',
          maxzoom: 18,
          paint: {
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
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 0.5,
              9, 0.8,
              12, 1.0,
              15, 1.2
            ],
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 0, 0)',
              0.05, 'rgba(0, 100, 255, 0.3)',
              0.15, 'rgba(0, 150, 255, 0.5)',
              0.25, 'rgba(50, 180, 255, 0.6)',
              0.35, 'rgba(100, 200, 255, 0.65)',
              0.45, 'rgba(255, 200, 0, 0.7)',
              0.55, 'rgba(255, 170, 0, 0.75)',
              0.65, 'rgba(255, 140, 0, 0.8)',
              0.75, 'rgba(255, 100, 0, 0.85)',
              0.82, 'rgba(255, 60, 0, 0.9)',
              0.9, 'rgba(255, 30, 0, 0.95)',
              1.0, 'rgba(200, 0, 0, 1)'
            ],
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
      }

      displayedZones.forEach((zone, index) => {
        const el = document.createElement('div');
        el.className = 'zone-marker';

        // Marqueurs beaucoup plus petits pour le mode heatmap
        const size = 16; // Taille fixe très petite

        el.style.cssText = `
          background-color: ${getSeverityColor(zone.severity)};
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          opacity: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0px;
        `;

        el.innerHTML = `<span style="display: none;">${zone.totalInfractions}</span>`;

        el.addEventListener('mouseenter', () => {
          el.style.opacity = '1';
          el.style.boxShadow = `0 3px 8px rgba(0, 0, 0, 0.4)`;
          el.style.borderWidth = '2px';
        });

        el.addEventListener('mouseleave', () => {
          el.style.opacity = '0.9';
          el.style.boxShadow = `0 2px 6px rgba(0, 0, 0, 0.3)`;
          el.style.borderWidth = '2px';
        });

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setActiveMarkerIndex(index);
          setPopupInfo(zone);
          setSelectedZone(zone.name);

          markerElementsRef.current.forEach((markerEl) => {
            markerEl.style.opacity = '0.3';
            markerEl.style.pointerEvents = 'none';
          });
        });

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat([zone.lng, zone.lat])
          .addTo(mapInstance.current!);

        markersRef.current.push(marker);
        markerElementsRef.current.push(el);
      });
    } else {
      // Vue des caméras de surveillance avec filtres
      // Supprimer la heatmap si elle existe
      if (mapInstance.current) {
        if (mapInstance.current.getLayer('infractions-heatmap')) {
          mapInstance.current.removeLayer('infractions-heatmap');
        }
        if (mapInstance.current.getSource('infractions-heat')) {
          mapInstance.current.removeSource('infractions-heat');
        }
      }

      const displayedCameras = camerasData.filter(camera =>
        (selectedFilter === 'all' || camera.severity === selectedFilter) &&
        (selectedZone === 'all' || camera.zone === selectedZone) &&
        (camera.status === 'active' || camera.status === 'maintenance')
      );

      console.log('Adding markers for cameras:', displayedCameras.length);

      displayedCameras.forEach((camera, index) => {
        const el = document.createElement('div');
        el.className = 'camera-marker';

        const statusColor = camera.status === 'active' ? '#22c55e' : '#f97316';
        const size = 45;

        el.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          border-radius: 12px;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px ${statusColor}88;
          opacity: 0.9;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 16px;
          transition: opacity 0.3s, box-shadow 0.3s, border-width 0.3s;
          background: linear-gradient(135deg, ${statusColor} 0%, ${statusColor}dd 100%);
        `;

        el.innerHTML = `
          <svg style="width: 24px; height: 24px;" fill="white" stroke="white" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        `;

        el.addEventListener('mouseenter', () => {
          el.style.opacity = '1';
          el.style.boxShadow = `0 6px 16px rgba(0, 0, 0, 0.4), 0 0 30px ${statusColor}`;
          el.style.borderWidth = '4px';
        });

        el.addEventListener('mouseleave', () => {
          el.style.opacity = '0.9';
          el.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.3), 0 0 20px ${statusColor}88`;
          el.style.borderWidth = '3px';
        });

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          setSelectedCamera(camera);
          setShowVideoModal(true);
        });

        const marker = new mapboxgl.Marker({
          element: el,
          anchor: 'center'
        })
          .setLngLat([camera.lng, camera.lat])
          .addTo(mapInstance.current!);

        markersRef.current.push(marker);
        markerElementsRef.current.push(el);
      });
    }
  }, [selectedFilter, selectedZone, mapLoaded, filteredZonesData, mapView, camerasData]);

  useEffect(() => {
    if (!mapInstance.current) return;
    if (!popupInfo) {
      markerElementsRef.current.forEach((markerEl) => {
        markerEl.style.opacity = '0.85';
        markerEl.style.pointerEvents = 'auto';
        markerEl.style.boxShadow = `0 4px 12px rgba(0, 0, 0, 0.3)`;
      });
      setActiveMarkerIndex(null);

      setSelectedZone('all');
      setSelectedFilter('all');
      setStartDate(null);
      setEndDate(null);

      return;
    }

    const popupContent = `
      <div style="padding: 12px; min-width: 250px;">
        <div style="font-size: 16px; font-weight: bold; color: #3d5a5c; margin-bottom: 8px;">
          ${popupInfo.name}
        </div>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background-color: ${getSeverityColor(popupInfo.severity)};"></div>
          <span style="font-size: 12px; color: #6b7280; text-transform: capitalize;">
            Zone ${popupInfo.severity}
          </span>
        </div>
        <div style="background-color: #f9fafb; padding: 8px; border-radius: 8px; margin-bottom: 12px;">
          <div style="font-size: 24px; font-weight: bold; color: #111827;">
            ${popupInfo.totalInfractions}
          </div>
          <div style="font-size: 11px; color: #6b7280;">
            Total d'infractions
          </div>
        </div>
        <div style="border-top: 1px solid #e5e7eb; padding-top: 8px;">
          <div style="font-size: 11px; font-weight: 600; color: #3d5a5c; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
            Types fréquents
          </div>
          ${popupInfo.infractions.map((inf, index) => `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; font-size: 12px;">
              <span style="color: #4b5563;">
                ${index + 1}. ${inf.type}
              </span>
              <span style="font-weight: 600; color: #111827;">
                ${inf.count}
              </span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const popup = new mapboxgl.Popup({
      closeOnClick: true,
      maxWidth: '300px',
      className: 'zone-popup'
    })
      .setLngLat([popupInfo.lng, popupInfo.lat])
      .setHTML(popupContent)
      .addTo(mapInstance.current);

    popup.on('close', () => {
      setPopupInfo(null);
    });

    return () => {
      popup.remove();
    };
  }, [popupInfo]);

  const hasNoData = filteredZonesData.every(z => z.totalInfractions === 0);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-white overflow-hidden">
      <div className={`${sidebarCollapsed ? 'hidden' : 'w-full lg:w-80 flex-shrink-0'} bg-white border-b lg:border-b-0 lg:border-r border-gray-200 p-3 sm:p-4 lg:p-6 overflow-y-auto max-h-[40vh] lg:max-h-full transition-all duration-300`}>
        <div className="space-y-4 lg:space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#3d5a5c] mb-1 sm:mb-2">
              Filtres
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">Affinez la visualisation</p>
          </div>

          <div className="space-y-2 lg:space-y-3">
            <label className="text-xs sm:text-sm font-semibold text-[#3d5a5c] block">Niveau de criticité</label>
            <div className="flex lg:flex-col lg:space-y-2 gap-2 lg:gap-0 overflow-x-auto lg:overflow-visible">
              {['all', 'critique', 'moyen', 'faible'].map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedFilter(level as any)}
                  className={`flex-shrink-0 lg:w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-left font-medium transition-all text-xs sm:text-sm ${
                    selectedFilter === level
                      ? 'bg-[#3d5a5c] text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {level === 'all' ? 'Toutes' : level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 lg:space-y-3">
            <label className="text-xs sm:text-sm font-semibold text-[#3d5a5c] block">Zone géographique</label>
            <CustomSelect
              value={selectedZone}
              onChange={setSelectedZone}
              options={[
                { value: 'all', label: 'Toutes les zones' },
                ...zones.map(z => ({ value: z, label: z }))
              ]}
              placeholder="Sélectionner une zone"
            />
          </div>

          <div className="space-y-2 lg:space-y-3">
            <label className="text-xs sm:text-sm font-semibold text-[#3d5a5c] block">Période temporelle</label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          {hasNoData && startDate && endDate && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800 text-center">
                Aucune infraction enregistrée sur cette période
              </p>
            </div>
          )}

          <div className="pt-3 lg:pt-4 space-y-2 lg:space-y-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-[#3d5a5c] tracking-wider">RÉSULTATS</h3>
              {startDate && endDate && mapView === 'infractions' && (
                <span className="text-xs bg-[#3d5a5c] text-white px-2 py-1 rounded-full font-medium">
                  {startDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} - {endDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
                </span>
              )}
            </div>
            {mapView === 'infractions' ? (
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-[#3d5a5c]">
                    {filteredZonesData.filter(zone =>
                      (selectedFilter === 'all' || zone.severity === selectedFilter) &&
                      (selectedZone === 'all' || zone.name === selectedZone)
                    ).reduce((acc, zone) => acc + zone.totalInfractions, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Total infractions</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {filteredZonesData.filter(z => z.severity === 'critique' && z.totalInfractions > 0).length}
                  </div>
                  <div className="text-xs text-gray-600">Zones critiques</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    {filteredZonesData.filter(z => z.severity === 'moyen' && z.totalInfractions > 0).length}
                  </div>
                  <div className="text-xs text-gray-600">Zones moyennes</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {filteredZonesData.filter(z => z.severity === 'faible' && z.totalInfractions > 0).length}
                  </div>
                  <div className="text-xs text-gray-600">Zones faibles</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-3">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-[#3d5a5c]">
                    {camerasData.filter(camera =>
                      (selectedFilter === 'all' || camera.severity === selectedFilter) &&
                      (selectedZone === 'all' || camera.zone === selectedZone) &&
                      camera.status === 'active'
                    ).length}
                  </div>
                  <div className="text-xs text-gray-600">Caméras actives</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">
                    {camerasData.filter(c =>
                      c.severity === 'critique' &&
                      c.status === 'active' &&
                      (selectedFilter === 'all' || c.severity === selectedFilter) &&
                      (selectedZone === 'all' || c.zone === selectedZone)
                    ).length}
                  </div>
                  <div className="text-xs text-gray-600">Caméras critiques</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">
                    {camerasData.filter(c =>
                      c.severity === 'moyen' &&
                      c.status === 'active' &&
                      (selectedFilter === 'all' || c.severity === selectedFilter) &&
                      (selectedZone === 'all' || c.zone === selectedZone)
                    ).length}
                  </div>
                  <div className="text-xs text-gray-600">Caméras moyennes</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 lg:p-3">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {camerasData.filter(c =>
                      c.severity === 'faible' &&
                      (selectedFilter === 'all' || c.severity === selectedFilter) &&
                      (selectedZone === 'all' || c.zone === selectedZone)
                    ).length}
                  </div>
                  <div className="text-xs text-gray-600">Caméras faibles</div>
                </div>
              </div>
            )}
          </div>

          <div className="flex lg:flex-col gap-2 lg:space-y-0 pt-3 lg:pt-4">
            <button 
              onClick={handleExportPDF}
              disabled={isExporting}
              className={`flex-1 lg:w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#3d5a5c] hover:bg-[#2d4a4c] text-white rounded-xl font-medium transition-all shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 ${
                isExporting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Génération...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Exporter PDF
                </>
              )}
            </button>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSelectedZone('all');
                setStartDate(null);
                setEndDate(null);
              }}
              className="flex-1 lg:w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all border border-gray-300 text-xs sm:text-sm"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      <div ref={mapContainer} className="flex-1 min-w-0 min-h-0 relative">
        {/* Bouton pour toggler le sidebar */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-3 sm:top-6 right-3 sm:right-6 bg-white border border-gray-200 rounded-xl shadow-lg z-10 p-2 sm:p-3 hover:bg-gray-50 transition-all"
          title={sidebarCollapsed ? 'Afficher les filtres' : 'Masquer les filtres'}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#3d5a5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            )}
          </svg>
        </button>

        {/* Toggle pour changer de vue */}
        <div className="absolute top-3 sm:top-6 left-3 sm:left-6 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden flex">
          <button
            onClick={() => setMapView('infractions')}
            className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all ${
              mapView === 'infractions'
                ? 'bg-[#3d5a5c] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Zones d'Infractions
          </button>
          <button
            onClick={() => setMapView('cameras')}
            className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-all ${
              mapView === 'cameras'
                ? 'bg-[#3d5a5c] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Caméras de Surveillance
          </button>
        </div>

        {/* Légende conditionnelle */}
        {mapView === 'infractions' ? (
          <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-lg z-10">
            <div className="text-xs font-semibold text-[#3d5a5c] mb-2 sm:mb-3 tracking-wider">LÉGENDE</div>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full shadow-sm shadow-red-500/50"></div>
                <span className="text-xs text-gray-700">Critique</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full shadow-sm shadow-orange-500/50"></div>
                <span className="text-xs text-gray-700">Moyen</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full shadow-sm shadow-green-500/50"></div>
                <span className="text-xs text-gray-700">Faible</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="absolute bottom-3 sm:bottom-6 left-3 sm:left-6 bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-lg z-10">
            <div className="text-xs font-semibold text-[#3d5a5c] mb-2 sm:mb-3 tracking-wider">CAMÉRAS</div>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full shadow-sm shadow-green-500/50"></div>
                <span className="text-xs text-gray-700">Active</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-orange-500 rounded-full shadow-sm shadow-orange-500/50"></div>
                <span className="text-xs text-gray-700">Maintenance</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Vidéo pour les caméras */}
      {showVideoModal && selectedCamera && (
        <div
          className="fixed inset-0 bg-[#00000095] z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowVideoModal(false)}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl max-h-[95vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#3d5a5c] to-[#2d4a4c] px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-xl font-bold text-white flex items-center gap-1 sm:gap-2">
                  <svg className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">{selectedCamera.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 mt-1 truncate">
                  {selectedCamera.id} | Zone: {selectedCamera.zone} | {selectedCamera.infractions} infractions
                </p>
              </div>
              <button
                onClick={() => setShowVideoModal(false)}
                className="text-white hover:text-gray-300 transition-colors flex-shrink-0 ml-2"
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-green-500/50 pointer-events-none">
                <div className="flex items-center gap-1 sm:gap-2 text-green-400 text-xs sm:text-sm font-mono">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></div>
                  EN DIRECT
                </div>
                <div className="text-white text-[10px] sm:text-xs mt-0.5 sm:mt-1 font-mono">
                  {new Date().toLocaleTimeString('fr-FR')}
                </div>
              </div>

              {/* Informations de la caméra */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-black/70 backdrop-blur-sm px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-green-500/50 pointer-events-none">
                <div className="text-green-400 text-[10px] sm:text-xs font-mono">{selectedCamera.id}</div>
                <div className="text-white text-[10px] sm:text-xs font-mono">{selectedCamera.zone}</div>
              </div>

              {/* Détections récentes (simulation) */}
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4 bg-black/70 backdrop-blur-sm px-2 sm:px-4 py-2 sm:py-3 rounded-lg border border-yellow-500/50 pointer-events-none">
                <div className="text-yellow-400 text-[10px] sm:text-xs font-semibold mb-1 sm:mb-2">DÉTECTIONS RÉCENTES</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-3 text-[10px] sm:text-xs">
                  <div className="bg-red-500/20 border border-red-500/50 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                    <div className="text-red-400 font-mono">Excès vitesse</div>
                    <div className="text-gray-300">Il y a 2 min</div>
                  </div>
                  <div className="bg-orange-500/20 border border-orange-500/50 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                    <div className="text-orange-400 font-mono">Stationnement</div>
                    <div className="text-gray-300">Il y a 8 min</div>
                  </div>
                  <div className="bg-yellow-500/20 border border-yellow-500/50 rounded px-1.5 sm:px-2 py-0.5 sm:py-1">
                    <div className="text-yellow-400 font-mono">Feu rouge</div>
                    <div className="text-gray-300">Il y a 15 min</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer avec statistiques */}
            <div className="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-[#3d5a5c]">{selectedCamera.infractions}</div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Infractions</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg sm:text-2xl font-bold ${selectedCamera.variation.includes('+') ? 'text-red-600' : 'text-green-600'}`}>
                    {selectedCamera.variation}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Variation</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    <div className="flex items-center justify-center gap-1">
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${selectedCamera.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-orange-500'}`}></div>
                      <span className="text-xs sm:text-2xl">{selectedCamera.status === 'active' ? 'Actif' : 'Maintenance'}</span>
                    </div>
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600">Statut</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';

// Custom Select Component
interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
  description?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  className?: string;
  isExport?: boolean;
}

const CustomSelect = ({ value, onChange, options, placeholder = 'Sélectionner', className = '', isExport = false }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-transparent flex items-center justify-between transition-all ${
          isExport
            ? 'bg-[#00124c] hover:bg-[#2d4a4c] text-white border-[#00124c] shadow-md hover:shadow-lg'
            : 'bg-white border border-gray-300 text-gray-700 hover:border-gray-400'
        }`}
      >
        <span className={`flex items-center gap-2 ${selectedOption ? 'font-medium' : ''}`}>
          {selectedOption?.icon && <span>{selectedOption.icon}</span>}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isExport ? 'text-white' : 'text-gray-500'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className={`absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden ${
          isExport ? 'w-72 sm:w-80 right-0' : 'w-full'
        } max-h-96 overflow-y-auto`}>
          {options.map((option, index) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              disabled={!option.value && isExport}
              className={`w-full px-4 py-3 text-left transition-colors flex items-start gap-3 ${
                option.value === value
                  ? 'bg-[#00124c] text-white'
                  : option.value && isExport
                  ? 'hover:bg-gray-50'
                  : !option.value && isExport
                  ? 'cursor-default bg-gray-50 border-b-2 border-gray-200'
                  : 'hover:bg-gray-50'
              } ${index === 0 && isExport ? 'font-bold text-gray-700' : ''}`}
            >
              {option.icon && (
                <span className={`flex-shrink-0 ${option.color || ''}`}>
                  {option.icon}
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className={`text-xs sm:text-sm font-semibold ${
                  option.value === value ? 'text-white' : option.value && !isExport ? 'text-gray-900' : index === 0 && isExport ? 'text-gray-700' : 'text-gray-900'
                }`}>
                  {option.label}
                </div>
                {option.description && (
                  <div className={`text-xs mt-0.5 ${
                    option.value === value ? 'text-gray-200' : 'text-gray-500'
                  }`}>
                    {option.description}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '2025-01-01', end: '2025-11-08' });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Trigger animation on any filter change
  useEffect(() => {
    setIsLoaded(false);
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, [selectedPeriod, selectedZone, selectedType, selectedAgent, selectedStatus, dateRange]);

  // Base mock data
  const baseEvolutionData = [
    { day: 'Lun', infractions: 42, paid: 32, pending: 8, relance: 2 },
    { day: 'Mar', infractions: 38, paid: 29, pending: 7, relance: 2 },
    { day: 'Mer', infractions: 45, paid: 34, pending: 9, relance: 2 },
    { day: 'Jeu', infractions: 52, paid: 40, pending: 10, relance: 2 },
    { day: 'Ven', infractions: 48, paid: 37, pending: 9, relance: 2 },
    { day: 'Sam', infractions: 35, paid: 27, pending: 7, relance: 1 },
    { day: 'Dim', infractions: 28, paid: 21, pending: 6, relance: 1 },
  ];

  const baseTypesData = [
    { type: 'Excès de vitesse', count: 89, amount: 4450000, color: 'bg-red-500' },
    { type: 'Stationnement', count: 72, amount: 3600000, color: 'bg-orange-500' },
    { type: 'Feu rouge', count: 45, amount: 2250000, color: 'bg-yellow-500' },
    { type: 'Téléphone', count: 28, amount: 1400000, color: 'bg-blue-500' },
    { type: 'Ceinture', count: 13, amount: 650000, color: 'bg-green-500' },
  ];

  const baseZonesData = [
    { zone: 'Dakar Plateau', count: 45, percentage: 18, revenue: 2250000 },
    { zone: 'Almadies', count: 38, percentage: 15, revenue: 1900000 },
    { zone: 'Point E', count: 32, percentage: 13, revenue: 1600000 },
    { zone: 'Ouest Foire', count: 28, percentage: 11, revenue: 1400000 },
    { zone: 'Parcelles', count: 24, percentage: 10, revenue: 1200000 },
  ];

  const baseAgentsData = [
    { agent: 'Agent Diop', infractions: 52, validated: 48, rejected: 4, efficiency: 92 },
    { agent: 'Agent Ndiaye', infractions: 48, validated: 45, rejected: 3, efficiency: 94 },
    { agent: 'Agent Fall', infractions: 42, validated: 40, rejected: 2, efficiency: 95 },
    { agent: 'Agent Seck', infractions: 38, validated: 36, rejected: 2, efficiency: 95 },
    { agent: 'Agent Ba', infractions: 35, validated: 33, rejected: 2, efficiency: 94 },
  ];

  const baseHourlyData = [
    { hour: '06h', count: 5 }, { hour: '07h', count: 12 }, { hour: '08h', count: 24 },
    { hour: '09h', count: 18 }, { hour: '10h', count: 15 }, { hour: '11h', count: 19 },
    { hour: '12h', count: 22 }, { hour: '13h', count: 16 }, { hour: '14h', count: 20 },
    { hour: '15h', count: 25 }, { hour: '16h', count: 28 }, { hour: '17h', count: 32 },
    { hour: '18h', count: 30 }, { hour: '19h', count: 15 }, { hour: '20h', count: 6 },
  ];

  const baseVehicleTypes = [
    { type: 'Voiture', count: 145, percentage: 59 },
    { type: 'Moto', count: 58, percentage: 23 },
    { type: 'Camion', count: 28, percentage: 11 },
    { type: 'Bus', count: 16, percentage: 7 },
  ];

  const basePaymentMethods = [
    { method: 'Wave', count: 98, percentage: 52 },
    { method: 'Orange Money', count: 62, percentage: 33 },
    { method: 'Espèces', count: 21, percentage: 11 },
    { method: 'Chèque', count: 8, percentage: 4 },
  ];

  // Apply filters to data with comprehensive multipliers
  const applyFilters = (data: any[], type = 'all') => {
    let multiplier = 1;
    let filteredData = [...data];
    
    // Zone filter - affects all data
    if (selectedZone !== 'all') {
      multiplier *= 0.6;
    }
    
    // Type filter - affects all data
    if (selectedType !== 'all') {
      if (type === 'types') {
        const typeMap: Record<string, string> = {
          'speed': 'Excès de vitesse',
          'parking': 'Stationnement',
          'red-light': 'Feu rouge',
          'phone': 'Téléphone'
        };
        filteredData = filteredData.filter(item => item.type === typeMap[selectedType]);
      }
      multiplier *= 0.4;
    }
    
    // Agent filter - affects all data
    if (selectedAgent !== 'all') {
      if (type === 'agents') {
        const agentMap: Record<string, string> = {
          'diop': 'Agent Diop',
          'ndiaye': 'Agent Ndiaye',
          'fall': 'Agent Fall'
        };
        filteredData = filteredData.filter(item => item.agent === agentMap[selectedAgent]);
      }
      multiplier *= 0.7;
    }
    
    // Status filter - affects all data
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'paid') {
        multiplier *= 0.76;
      } else if (selectedStatus === 'pending') {
        multiplier *= 0.18;
      } else if (selectedStatus === 'relance') {
        multiplier *= 0.06;
      }
    }
    
    // Period filter - affects all data
    if (selectedPeriod === 'today') {
      multiplier *= 0.15;
    } else if (selectedPeriod === 'week') {
      multiplier *= 0.3;
    } else if (selectedPeriod === 'quarter') {
      multiplier *= 2.5;
    } else if (selectedPeriod === 'year') {
      multiplier *= 12;
    }
    
    return filteredData.map(item => {
      const newItem = { ...item };
      Object.keys(item).forEach(key => {
        if (typeof item[key] === 'number' && key !== 'percentage' && key !== 'efficiency') {
          newItem[key] = Math.max(1, Math.round(item[key] * multiplier));
        }
      });
      return newItem;
    });
  };

  const evolutionData = applyFilters(baseEvolutionData);
  const typesData = applyFilters(baseTypesData, 'types');
  const zonesData = applyFilters(baseZonesData);
  const agentsData = applyFilters(baseAgentsData, 'agents');
  const hourlyData = applyFilters(baseHourlyData);
  const vehicleTypes = applyFilters(baseVehicleTypes, 'vehicle');
  const paymentMethods = applyFilters(basePaymentMethods, 'payment');

  // Calculate KPIs from filtered data
  const totalInfractions = evolutionData.reduce((sum, item) => sum + item.infractions, 0);
  const totalPaid = evolutionData.reduce((sum, item) => sum + item.paid, 0);
  const totalPending = evolutionData.reduce((sum, item) => sum + item.pending, 0);
  const totalRelance = evolutionData.reduce((sum, item) => sum + item.relance, 0);
  const totalRevenue = typesData.reduce((sum, item) => sum + item.amount, 0);
  const avgPerDay = Math.round(totalInfractions / evolutionData.length);

  const handleApplyFilters = () => {
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    setSelectedZone('all');
    setSelectedType('all');
    setSelectedAgent('all');
    setSelectedStatus('all');
  };

  const exportData = (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filterLabels = {
      period: {
        'today': "Aujourd'hui",
        'week': 'Semaine',
        'month': 'Mois',
        'quarter': 'Trimestre',
        'year': 'Année',
        'custom': 'Personnalisé'
      },
      zone: {
        'all': 'Toutes les zones',
        'plateau': 'Dakar Plateau',
        'almadies': 'Almadies',
        'point-e': 'Point E',
        'ouest-foire': 'Ouest Foire'
      },
      type: {
        'all': 'Tous les types',
        'speed': 'Excès de vitesse',
        'parking': 'Stationnement',
        'red-light': 'Feu rouge',
        'phone': 'Téléphone'
      },
      agent: {
        'all': 'Tous les agents',
        'diop': 'Agent Diop',
        'ndiaye': 'Agent Ndiaye',
        'fall': 'Agent Fall'
      },
      status: {
        'all': 'Tous les statuts',
        'paid': 'Payée',
        'pending': 'En attente',
        'relance': 'Relance'
      }
    };

    const data = {
      exportDate: new Date().toLocaleString('fr-FR'),
      period: (filterLabels.period as any)[selectedPeriod] || selectedPeriod,
      dateRange: selectedPeriod === 'custom' ? dateRange : null,
      filtersApplied: {
        zone: (filterLabels.zone as any)[selectedZone] || selectedZone,
        type: (filterLabels.type as any)[selectedType] || selectedType,
        agent: (filterLabels.agent as any)[selectedAgent] || selectedAgent,
        status: (filterLabels.status as any)[selectedStatus] || selectedStatus
      },
      kpis: {
        totalInfractions: totalInfractions,
        infractionsPayees: totalPaid,
        tauxPaiement: totalInfractions > 0 ? ((totalPaid / totalInfractions) * 100).toFixed(1) + '%' : '0%',
        infractionsEnAttente: totalPending,
        infractionsRelance: totalRelance,
        revenuTotal: totalRevenue + ' FCFA',
        moyenneParJour: avgPerDay,
        montantMoyen: totalInfractions > 0 ? Math.round(totalRevenue / totalInfractions) + ' FCFA' : '0 FCFA'
      },
      typesInfractions: typesData,
      topZones: zonesData,
      performanceAgents: agentsData,
      evolutionTemporelle: evolutionData,
      distributionHoraire: hourlyData,
      typesVehicules: vehicleTypes,
      modesPaiement: paymentMethods,
      comparaisonPeriode: {
        infractions: '+12%',
        recouvrement: '+8.5%',
        tempsMoyen: '-15%',
        efficaciteAgents: '+3.2%'
      }
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statistiques-completes-${timestamp}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      let csv = '=== RAPPORT STATISTIQUES INFRACTIONS ===\n';
      csv += `Date d'export:,${data.exportDate}\n`;
      csv += `Période:,${data.period}\n\n`;
      
      csv += '=== FILTRES APPLIQUÉS ===\n';
      csv += `Zone:,${data.filtersApplied.zone}\n`;
      csv += `Type:,${data.filtersApplied.type}\n`;
      csv += `Agent:,${data.filtersApplied.agent}\n`;
      csv += `Statut:,${data.filtersApplied.status}\n\n`;
      
      csv += '=== INDICATEURS CLÉS ===\n';
      csv += `Total Infractions:,${data.kpis.totalInfractions}\n`;
      csv += `Infractions Payées:,${data.kpis.infractionsPayees}\n`;
      csv += `Taux de Paiement:,${data.kpis.tauxPaiement}\n`;
      csv += `En Attente:,${data.kpis.infractionsEnAttente}\n`;
      csv += `Relances:,${data.kpis.infractionsRelance}\n`;
      csv += `Revenu Total:,${data.kpis.revenuTotal}\n`;
      csv += `Moyenne par Jour:,${data.kpis.moyenneParJour}\n`;
      csv += `Montant Moyen:,${data.kpis.montantMoyen}\n\n`;
      
      csv += '=== TYPES D\'INFRACTIONS ===\n';
      csv += 'Type,Nombre,Montant (FCFA),Payées,En Attente,Taux Paiement\n';
      typesData.forEach(item => {
        const paid = Math.floor(item.count * 0.75);
        const pending = item.count - paid;
        csv += `${item.type},${item.count},${item.amount},${paid},${pending},75%\n`;
      });
      csv += '\n';
      
      csv += '=== TOP ZONES ===\n';
      csv += 'Zone,Nombre,Pourcentage,Revenu (FCFA)\n';
      zonesData.forEach(item => {
        csv += `${item.zone},${item.count},${item.percentage}%,${item.revenue}\n`;
      });
      csv += '\n';
      
      csv += '=== PERFORMANCE AGENTS ===\n';
      csv += 'Agent,Infractions,Validées,Rejetées,Efficacité\n';
      agentsData.forEach(item => {
        csv += `${item.agent},${item.infractions},${item.validated},${item.rejected},${item.efficiency}%\n`;
      });
      csv += '\n';
      
      csv += '=== DISTRIBUTION HORAIRE ===\n';
      csv += 'Heure,Nombre\n';
      hourlyData.forEach(item => {
        csv += `${item.hour},${item.count}\n`;
      });
      csv += '\n';
      
      csv += '=== TYPES DE VÉHICULES ===\n';
      csv += 'Type,Nombre,Pourcentage\n';
      vehicleTypes.forEach(item => {
        csv += `${item.type},${item.count},${item.percentage}%\n`;
      });
      csv += '\n';
      
      csv += '=== MODES DE PAIEMENT ===\n';
      csv += 'Mode,Nombre,Pourcentage\n';
      paymentMethods.forEach(item => {
        csv += `${item.method},${item.count},${item.percentage}%\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `statistiques-completes-${timestamp}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'pdf') {
      const reportWindow = window.open('', '_blank');
      if (!reportWindow) return;

      // Générer les diagrammes en SVG pour l'impression
      const createEvolutionChart = () => {
        const width = 700;
        const height = 200;
        const barWidth = (width - 40) / evolutionData.length - 10;
        const bars = evolutionData.map((item, index) => {
          const barHeight = maxEvolution > 0 ? (item.infractions / maxEvolution) * 150 : 0;
          const x = 20 + index * (barWidth + 10);
          const y = 170 - barHeight;
          return `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#gradient1)" rx="3"/>
            <text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-size="12" font-weight="bold" fill="#111">${item.infractions}</text>
            <text x="${x + barWidth/2}" y="190" text-anchor="middle" font-size="11" fill="#6b7280" font-weight="600">${item.day}</text>
          `;
        }).join('');
        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#00124c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#5a7a7c;stop-opacity:1" />
              </linearGradient>
            </defs>
            ${bars}
          </svg>
        `;
      };

      const createTypesChart = () => {
        const width = 700;
        const itemHeight = 40;
        const height = typesData.length * itemHeight + 20;
        const colors = ['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'];

        const bars = typesData.map((item, index) => {
          const percentage = maxTypes > 0 ? (item.count / maxTypes) * 500 : 0;
          const y = index * itemHeight + 10;
          return `
            <text x="10" y="${y + 15}" font-size="13" fill="#374151" font-weight="500">${item.type}</text>
            <text x="680" y="${y + 15}" text-anchor="end" font-size="13" font-weight="700" fill="#111">${item.count}</text>
            <text x="650" y="${y + 15}" text-anchor="end" font-size="12" fill="#6b7280">${(item.amount / 1000).toFixed(0)}K</text>
            <rect x="10" y="${y + 20}" width="670" height="8" fill="#e5e7eb" rx="4"/>
            <rect x="10" y="${y + 20}" width="${percentage}" height="8" fill="${colors[index]}" rx="4"/>
          `;
        }).join('');

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            ${bars}
          </svg>
        `;
      };

      const createHourlyChart = () => {
        const width = 700;
        const height = 180;
        const maxHourly = Math.max(...hourlyData.map(d => d.count));
        const barWidth = (width - 40) / hourlyData.length - 5;

        const bars = hourlyData.map((item, index) => {
          const barHeight = maxHourly > 0 ? (item.count / maxHourly) * 120 : 0;
          const x = 20 + index * (barWidth + 5);
          const y = 140 - barHeight;
          return `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" fill="url(#gradientHourly)" rx="3"/>
            <text x="${x + barWidth/2}" y="${y - 5}" text-anchor="middle" font-size="11" font-weight="bold" fill="#111">${item.count}</text>
            <text x="${x + barWidth/2}" y="165" text-anchor="middle" font-size="10" fill="#6b7280">${item.hour}</text>
          `;
        }).join('');

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradientHourly" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style="stop-color:#D7AF84FF;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#d4a574;stop-opacity:1" />
              </linearGradient>
            </defs>
            ${bars}
          </svg>
        `;
      };

      const createVehiclesChart = () => {
        const width = 700;
        const itemHeight = 45;
        const height = vehicleTypes.length * itemHeight + 20;

        const bars = vehicleTypes.map((item, index) => {
          const barWidth = (item.percentage / 100) * 550;
          const y = index * itemHeight + 10;
          return `
            <text x="10" y="${y + 18}" font-size="24" font-weight="800" fill="#00124c" text-anchor="start">${item.percentage}%</text>
            <text x="90" y="${y + 18}" font-size="13" font-weight="500" fill="#374151">${item.type}</text>
            <text x="690" y="${y + 18}" text-anchor="end" font-size="13" font-weight="700" fill="#111">${item.count}</text>
            <rect x="90" y="${y + 23}" width="550" height="8" fill="#e5e7eb" rx="4"/>
            <rect x="90" y="${y + 23}" width="${barWidth}" height="8" fill="url(#gradientVehicle)" rx="4"/>
          `;
        }).join('');

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradientVehicle" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#00124c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#5a7a7c;stop-opacity:1" />
              </linearGradient>
            </defs>
            ${bars}
          </svg>
        `;
      };

      const createZonesChart = () => {
        const width = 700;
        const itemHeight = 55;
        const topZones = zonesData.slice(0, 5);
        const height = topZones.length * itemHeight + 20;

        const bars = topZones.map((item, index) => {
          const barWidth = (item.percentage * 5);
          const y = index * itemHeight + 10;
          return `
            <rect x="10" y="${y}" width="32" height="32" fill="url(#gradientZoneBadge)" rx="8"/>
            <text x="26" y="${y + 21}" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">${index + 1}</text>
            <text x="55" y="${y + 18}" font-size="13" font-weight="600" fill="#111">${item.zone}</text>
            <text x="690" y="${y + 18}" text-anchor="end" font-size="13" font-weight="700" fill="#111">${item.count}</text>
            <text x="650" y="${y + 18}" text-anchor="end" font-size="12" fill="#6b7280">${(item.revenue / 1000).toFixed(0)}K</text>
            <rect x="55" y="${y + 25}" width="635" height="8" fill="#e5e7eb" rx="4"/>
            <rect x="55" y="${y + 25}" width="${barWidth * 6.35}" height="8" fill="url(#gradientZone)" rx="4"/>
          `;
        }).join('');

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradientZoneBadge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#00124c;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2d4a4c;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="gradientZone" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#ef4444;stop-opacity:1" />
              </linearGradient>
            </defs>
            ${bars}
          </svg>
        `;
      };

      const createAgentsChart = () => {
        const width = 700;
        const itemHeight = 60;
        const topAgents = agentsData.slice(0, 5);
        const height = topAgents.length * itemHeight + 20;
        const maxAgent = Math.max(...agentsData.map(a => a.infractions));

        const bars = topAgents.map((item, index) => {
          const infraPercentage = maxAgent > 0 ? (item.infractions / maxAgent) * 100 : 0;
          const validPercentage = maxAgent > 0 ? (item.validated / maxAgent) * 100 : 0;
          const infraWidth = (infraPercentage / 100) * 310;
          const validWidth = (validPercentage / 100) * 310;
          const y = index * itemHeight + 10;
          return `
            <circle cx="30" cy="${y + 20}" r="20" fill="url(#gradientAgentBadge)" stroke="#d1d5db" stroke-width="2"/>
            <path d="M30 ${y + 15}c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#6b7280" transform="translate(10 ${y + 5})"/>
            <text x="60" y="${y + 20}" font-size="13" font-weight="600" fill="#111">${item.agent}</text>
            <text x="690" y="${y + 20}" text-anchor="end" font-size="11" fill="#6b7280">
              <tspan font-weight="600" fill="#111">${item.validated}</tspan>/${item.infractions}
            </text>
            <text x="650" y="${y + 20}" text-anchor="end" font-size="11" font-weight="600" fill="#10b981">${item.efficiency}%</text>
            <rect x="60" y="${y + 28}" width="310" height="6" fill="#e5e7eb" rx="3"/>
            <rect x="60" y="${y + 28}" width="${infraWidth}" height="6" fill="#00124c" rx="3"/>
            <rect x="380" y="${y + 28}" width="310" height="6" fill="#e5e7eb" rx="3"/>
            <rect x="380" y="${y + 28}" width="${validWidth}" height="6" fill="url(#gradientAgentValid)" rx="3"/>
          `;
        }).join('');

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gradientAgentBadge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="gradientAgentValid" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
              </linearGradient>
            </defs>
            ${bars}
          </svg>
        `;
      };

      const createPaymentsChart = () => {
        const width = 700;
        const itemHeight = 30;
        const height = paymentMethods.length * itemHeight + 20;
        const colors = ['#eab308', '#f97316', '#10b981', '#3b82f6'];

        const items = paymentMethods.map((item, index) => {
          const y = index * itemHeight + 10;
          return `
            <circle cx="10" cy="${y + 15}" r="4" fill="${colors[index]}"/>
            <text x="25" y="${y + 19}" font-size="13" fill="#374151">${item.method}</text>
            <text x="690" y="${y + 19}" text-anchor="end" font-size="13" font-weight="700" fill="#111">${item.count}</text>
            <text x="650" y="${y + 19}" text-anchor="end" font-size="12" fill="#6b7280">${item.percentage}%</text>
          `;
        }).join('');

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            ${items}
          </svg>
        `;
      };

      const createRecoverageCircle = () => {
        const percentage = totalInfractions > 0 ? ((totalPaid / totalInfractions) * 100).toFixed(1) : 0;
        const circumference = 2 * Math.PI * 56;
        const progress = totalInfractions > 0 ? (totalPaid / totalInfractions) * circumference : 0;
        const width = 200;
        const height = 180;

        return `
          <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(100, 90)">
              <g transform="rotate(-90)">
                <circle cx="0" cy="0" r="56" stroke="#e5e7eb" stroke-width="12" fill="none" />
                <circle cx="0" cy="0" r="56" stroke="#00124c" stroke-width="12" fill="none"
                  stroke-dasharray="${progress} ${circumference}" stroke-linecap="round" />
              </g>
              <text x="0" y="5" text-anchor="middle" font-size="24" font-weight="800" fill="#00124c">${percentage}%</text>
              <text x="0" y="20" text-anchor="middle" font-size="11" fill="#6b7280">Payées</text>
            </g>
          </svg>
        `;
      };

      reportWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Rapport Statistiques - ${timestamp}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 30px;
              background: white;
              color: #1f2937;
              line-height: 1.6;
            }
            .page {
              max-width: 1000px;
              margin: 0 auto;
              background: white;
            }
            h1 {
              color: #00124c;
              border-bottom: 4px solid #00124c;
              padding-bottom: 15px;
              margin-bottom: 10px;
              font-size: 32px;
              display: flex;
              align-items: center;
              gap: 15px;
            }
            h2 {
              color: #00124c;
              margin-top: 40px;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 2px solid #e5e7eb;
              font-size: 22px;
            }
            h3 {
              color: #00124c;
              margin: 20px 0 15px 0;
              font-size: 16px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }
            .header-info p {
              margin: 5px 0;
              color: #6b7280;
            }
            .filters {
              background: #f9fafb;
              padding: 20px;
              border-radius: 10px;
              margin-bottom: 30px;
              border-left: 4px solid #00124c;
            }
            .filters p {
              margin: 8px 0;
              color: #374151;
            }
            .kpis {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 20px;
              margin: 30px 0;
            }
            .kpi {
              background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
              padding: 20px;
              border-radius: 10px;
              text-align: center;
              border: 2px solid #e5e7eb;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .kpi-label {
              font-size: 11px;
              color: #6b7280;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            .kpi-value {
              font-size: 28px;
              font-weight: 800;
              color: #00124c;
              margin: 8px 0;
            }
            .kpi-sub {
              font-size: 13px;
              color: #6b7280;
              font-weight: 600;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 25px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
              border-radius: 8px;
              overflow: hidden;
            }
            th {
              background: #00124c;
              color: white;
              padding: 14px 12px;
              text-align: left;
              font-weight: 600;
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
              font-size: 13px;
            }
            tr:last-child td {
              border-bottom: none;
            }
            tr:nth-child(even) {
              background: #f9fafb;
            }
            .chart {
              margin: 30px 0;
              padding: 25px;
              background: #f9fafb;
              border-radius: 10px;
              border: 1px solid #e5e7eb;
              page-break-inside: avoid;
            }
            .chart svg {
              display: block;
              margin: 20px auto;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
              margin: 20px 0;
            }
            .stat-item {
              background: white;
              padding: 15px;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .stat-label {
              color: #6b7280;
              font-size: 13px;
              font-weight: 600;
            }
            .stat-value {
              color: #00124c;
              font-size: 16px;
              font-weight: 700;
            }
            .footer {
              margin-top: 50px;
              padding-top: 25px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            .footer p {
              margin: 5px 0;
            }
            .print-button {
              padding: 12px 24px;
              background: #00124c;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: 600;
              margin: 20px 0;
              transition: background 0.3s;
            }
            .print-button:hover {
              background: #2d4a4c;
            }
            .comparison-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin: 25px 0;
            }
            .comparison-item {
              text-align: center;
              padding: 20px;
              border-radius: 10px;
              background: white;
              border: 2px solid #e5e7eb;
            }
            .comparison-item.positive {
              background: #f0fdf4;
              border-color: #86efac;
            }
            .comparison-item.negative {
              background: #fef2f2;
              border-color: #fca5a5;
            }
            .comparison-label {
              font-size: 11px;
              color: #6b7280;
              text-transform: uppercase;
              font-weight: 600;
              margin-bottom: 8px;
            }
            .comparison-value {
              font-size: 28px;
              font-weight: 800;
              margin: 8px 0;
            }
            .comparison-value.positive {
              color: #059669;
            }
            .comparison-value.negative {
              color: #dc2626;
            }
            .comparison-sub {
              font-size: 11px;
              color: #6b7280;
            }
            .bg-red-500 { background-color: #ef4444; }
            .bg-orange-500 { background-color: #f97316; }
            .bg-yellow-500 { background-color: #eab308; }
            .bg-blue-500 { background-color: #3b82f6; }
            .bg-green-500 { background-color: #10b981; }
            @media print {
              .no-print { display: none !important; }
              body { padding: 15px; }
              .page { max-width: 100%; }
              h1 { font-size: 28px; }
              h2 {
                margin-top: 30px;
                page-break-after: avoid;
              }
              .chart {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              table {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              .kpis {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div>
                <h1>
                  <span style="font-size: 40px;">📊</span>
                  <span>Rapport Statistiques Infractions</span>
                </h1>
                <p style="font-size: 16px; color: #6b7280; margin-top: 10px;">
                  <strong>Période:</strong> ${data.period}
                </p>
              </div>
              <div class="header-info" style="text-align: right;">
                <p><strong>Date d'export:</strong></p>
                <p>${data.exportDate}</p>
                <button class="no-print print-button" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
              </div>
            </div>

            <div class="filters">
              <h3 style="margin-top: 0;">📋 Filtres Appliqués</h3>
              <p><strong>Zone:</strong> ${data.filtersApplied.zone}</p>
              <p><strong>Type d'infraction:</strong> ${data.filtersApplied.type}</p>
              <p><strong>Agent:</strong> ${data.filtersApplied.agent}</p>
              <p><strong>Statut:</strong> ${data.filtersApplied.status}</p>
            </div>

            <h2>📈 Indicateurs Clés de Performance</h2>
            <div class="kpis">
              <div class="kpi">
                <div class="kpi-label">Total Infractions</div>
                <div class="kpi-value">${data.kpis.totalInfractions}</div>
                <div class="kpi-sub" style="color: #10b981;">+12% ↑</div>
              </div>
              <div class="kpi">
                <div class="kpi-label">Infractions Payées</div>
                <div class="kpi-value" style="color: #059669;">${data.kpis.infractionsPayees}</div>
                <div class="kpi-sub" style="color: #059669;">${data.kpis.tauxPaiement}</div>
              </div>
              <div class="kpi">
                <div class="kpi-label">En Attente</div>
                <div class="kpi-value" style="color: #ea580c;">${data.kpis.infractionsEnAttente}</div>
                <div class="kpi-sub">${totalInfractions > 0 ? ((totalPending / totalInfractions) * 100).toFixed(1) : 0}%</div>
              </div>
              <div class="kpi">
                <div class="kpi-label">Revenu Total</div>
                <div class="kpi-value">${(totalRevenue / 1000000).toFixed(2)}M</div>
                <div class="kpi-sub">FCFA</div>
              </div>
            </div>

            <h2>📊 Types d'Infractions</h2>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th style="text-align: center;">Nombre</th>
                  <th style="text-align: center;">Montant</th>
                  <th style="text-align: center;">Payées</th>
                  <th style="text-align: center;">En Attente</th>
                  <th style="text-align: center;">Taux</th>
                </tr>
              </thead>
              <tbody>
                ${typesData.map(item => `
                  <tr>
                    <td><strong>${item.type}</strong></td>
                    <td style="text-align: center;"><strong>${item.count}</strong></td>
                    <td style="text-align: center;">${(item.amount / 1000).toFixed(0)}K FCFA</td>
                    <td style="text-align: center; color: #059669;"><strong>${Math.floor(item.count * 0.75)}</strong></td>
                    <td style="text-align: center; color: #ea580c;"><strong>${Math.floor(item.count * 0.25)}</strong></td>
                    <td style="text-align: center; color: #10b981;"><strong>75%</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="chart">
              <h3>📊 Répartition par Type</h3>
              <div style="margin-top: 20px;">
                ${createTypesChart()}
              </div>
            </div>

            <h2>📍 Top Zones à Risque</h2>
            <table>
              <thead>
                <tr>
                  <th>Zone</th>
                  <th style="text-align: center;">Nombre</th>
                  <th style="text-align: center;">Pourcentage</th>
                  <th style="text-align: center;">Revenu</th>
                </tr>
              </thead>
              <tbody>
                ${zonesData.map(item => `
                  <tr>
                    <td><strong>${item.zone}</strong></td>
                    <td style="text-align: center;"><strong>${item.count}</strong></td>
                    <td style="text-align: center;">${item.percentage}%</td>
                    <td style="text-align: center;">${(item.revenue / 1000).toFixed(0)}K FCFA</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="chart">
              <h3>📍 Top Zones à Risque</h3>
              <div style="margin-top: 20px;">
                ${createZonesChart()}
              </div>
            </div>

            <h2>👥 Performance des Agents</h2>
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th style="text-align: center;">Infractions</th>
                  <th style="text-align: center;">Validées</th>
                  <th style="text-align: center;">Rejetées</th>
                  <th style="text-align: center;">Efficacité</th>
                </tr>
              </thead>
              <tbody>
                ${agentsData.map(item => `
                  <tr>
                    <td><strong>${item.agent}</strong></td>
                    <td style="text-align: center;">${item.infractions}</td>
                    <td style="text-align: center; color: #10b981;"><strong>${item.validated}</strong></td>
                    <td style="text-align: center; color: #dc2626;">${item.rejected}</td>
                    <td style="text-align: center; color: #00124c;"><strong>${item.efficiency}%</strong></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="chart">
              <h3>👥 Performance des Agents</h3>
              <div style="margin-top: 20px;">
                ${createAgentsChart()}
              </div>
            </div>

            <h2>🚗 Types de Véhicules</h2>
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th style="text-align: center;">Nombre</th>
                  <th style="text-align: center;">Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                ${vehicleTypes.map(item => `
                  <tr>
                    <td><strong>${item.type}</strong></td>
                    <td style="text-align: center;"><strong>${item.count}</strong></td>
                    <td style="text-align: center;">${item.percentage}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="chart">
              <h3>🚗 Types de Véhicules</h3>
              <div style="margin-top: 20px;">
                ${createVehiclesChart()}
              </div>
            </div>

            <h2>💳 Modes de Paiement</h2>
            <table>
              <thead>
                <tr>
                  <th>Mode</th>
                  <th style="text-align: center;">Nombre</th>
                  <th style="text-align: center;">Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                ${paymentMethods.map(item => `
                  <tr>
                    <td><strong>${item.method}</strong></td>
                    <td style="text-align: center;"><strong>${item.count}</strong></td>
                    <td style="text-align: center;">${item.percentage}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="chart">
              <h3>💳 Modes de Paiement</h3>
              <div style="margin-top: 20px;">
                ${createPaymentsChart()}
              </div>
            </div>

            <h2>📊 Évolution Temporelle</h2>
            <table>
              <thead>
                <tr>
                  <th>Jour</th>
                  <th style="text-align: center;">Infractions</th>
                  <th style="text-align: center;">Payées</th>
                  <th style="text-align: center;">En Attente</th>
                  <th style="text-align: center;">Relances</th>
                </tr>
              </thead>
              <tbody>
                ${evolutionData.map(item => `
                  <tr>
                    <td><strong>${item.day}</strong></td>
                    <td style="text-align: center;"><strong>${item.infractions}</strong></td>
                    <td style="text-align: center; color: #10b981;"><strong>${item.paid}</strong></td>
                    <td style="text-align: center; color: #ea580c;">${item.pending}</td>
                    <td style="text-align: center; color: #dc2626;">${item.relance}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="chart">
              <h3>📊 Graphique d'Évolution</h3>
              <div style="margin-top: 20px; text-align: center;">
                ${createEvolutionChart()}
              </div>
            </div>

            <h2>⏰ Distribution Horaire</h2>
            <table>
              <thead>
                <tr>
                  <th>Heure</th>
                  <th style="text-align: center;">Nombre</th>
                  <th style="text-align: center;">Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                ${hourlyData.map(item => {
                  const maxHourly = Math.max(...hourlyData.map(d => d.count));
                  const total = hourlyData.reduce((sum, d) => sum + d.count, 0);
                  const percentage = total > 0 ? ((item.count / total) * 100).toFixed(1) : 0;
                  return `
                    <tr>
                      <td><strong>${item.hour}</strong></td>
                      <td style="text-align: center;"><strong>${item.count}</strong></td>
                      <td style="text-align: center;">${percentage}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
            <div class="chart">
              <h3>⏰ Graphique Horaire</h3>
              <div style="margin-top: 20px; text-align: center;">
                ${createHourlyChart()}
              </div>
            </div>

            <h2>📈 Taux de Recouvrement</h2>
            <table>
              <thead>
                <tr>
                  <th>Statut</th>
                  <th style="text-align: center;">Nombre</th>
                  <th style="text-align: center;">Pourcentage</th>
                  <th style="text-align: center;">Montant Estimé</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong style="color: #10b981;">✓ Infractions Payées</strong></td>
                  <td style="text-align: center;"><strong style="color: #10b981;">${totalPaid}</strong></td>
                  <td style="text-align: center;"><strong style="color: #10b981;">${totalInfractions > 0 ? ((totalPaid / totalInfractions) * 100).toFixed(1) : 0}%</strong></td>
                  <td style="text-align: center;">${((totalRevenue * totalPaid) / totalInfractions / 1000).toFixed(0)}K FCFA</td>
                </tr>
                <tr>
                  <td><strong style="color: #ea580c;">⏳ En Attente</strong></td>
                  <td style="text-align: center;"><strong style="color: #ea580c;">${totalPending}</strong></td>
                  <td style="text-align: center;"><strong style="color: #ea580c;">${totalInfractions > 0 ? ((totalPending / totalInfractions) * 100).toFixed(1) : 0}%</strong></td>
                  <td style="text-align: center;">${((totalRevenue * totalPending) / totalInfractions / 1000).toFixed(0)}K FCFA</td>
                </tr>
                <tr>
                  <td><strong style="color: #dc2626;">⚠ Relances</strong></td>
                  <td style="text-align: center;"><strong style="color: #dc2626;">${totalRelance}</strong></td>
                  <td style="text-align: center;"><strong style="color: #dc2626;">${totalInfractions > 0 ? ((totalRelance / totalInfractions) * 100).toFixed(1) : 0}%</strong></td>
                  <td style="text-align: center;">${((totalRevenue * totalRelance) / totalInfractions / 1000).toFixed(0)}K FCFA</td>
                </tr>
                <tr style="background: #f9fafb; font-weight: bold;">
                  <td><strong>TOTAL</strong></td>
                  <td style="text-align: center;"><strong>${totalInfractions}</strong></td>
                  <td style="text-align: center;"><strong>100%</strong></td>
                  <td style="text-align: center;"><strong>${(totalRevenue / 1000).toFixed(0)}K FCFA</strong></td>
                </tr>
              </tbody>
            </table>
            <div class="chart">
              <h3>📈 Visualisation du Recouvrement</h3>
              ${createRecoverageCircle()}
              <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; text-align: center;">
                <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; border: 2px solid #86efac;">
                  <div style="font-size: 11px; color: #059669; font-weight: 600;">Payées</div>
                  <div style="font-size: 24px; font-weight: 800; color: #10b981;">${totalPaid}</div>
                  <div style="font-size: 12px; color: #059669; margin-top: 4px;">${totalInfractions > 0 ? ((totalPaid / totalInfractions) * 100).toFixed(1) : 0}%</div>
                </div>
                <div style="background: #fff7ed; padding: 15px; border-radius: 8px; border: 2px solid #fdba74;">
                  <div style="font-size: 11px; color: #c2410c; font-weight: 600;">Attente</div>
                  <div style="font-size: 24px; font-weight: 800; color: #ea580c;">${totalPending}</div>
                  <div style="font-size: 12px; color: #c2410c; margin-top: 4px;">${totalInfractions > 0 ? ((totalPending / totalInfractions) * 100).toFixed(1) : 0}%</div>
                </div>
                <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border: 2px solid #fca5a5;">
                  <div style="font-size: 11px; color: #991b1b; font-weight: 600;">Relances</div>
                  <div style="font-size: 24px; font-weight: 800; color: #dc2626;">${totalRelance}</div>
                  <div style="font-size: 12px; color: #991b1b; margin-top: 4px;">${totalInfractions > 0 ? ((totalRelance / totalInfractions) * 100).toFixed(1) : 0}%</div>
                </div>
              </div>
            </div>

            <h2>📊 Comparaison avec Période Précédente</h2>
            <div class="comparison-grid">
              <div class="comparison-item positive">
                <div class="comparison-label">Infractions</div>
                <div class="comparison-value positive">+12%</div>
                <div class="comparison-sub">vs période précédente</div>
              </div>
              <div class="comparison-item positive">
                <div class="comparison-label">Recouvrement</div>
                <div class="comparison-value positive">+8.5%</div>
                <div class="comparison-sub">vs période précédente</div>
              </div>
              <div class="comparison-item negative">
                <div class="comparison-label">Temps Moyen</div>
                <div class="comparison-value positive">-15%</div>
                <div class="comparison-sub">plus rapide</div>
              </div>
              <div class="comparison-item positive">
                <div class="comparison-label">Efficacité Agents</div>
                <div class="comparison-value positive">+3.2%</div>
                <div class="comparison-sub">vs période précédente</div>
              </div>
            </div>

            <h2>📋 Statistiques Complémentaires</h2>
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">Délai moyen de paiement</span>
                <span class="stat-value">3.2 jours</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Montant moyen par infraction</span>
                <span class="stat-value">${totalInfractions > 0 ? (totalRevenue / totalInfractions).toFixed(0) : 0} FCFA</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Taux de contestation</span>
                <span class="stat-value" style="color: #dc2626;">2.8%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Moyenne infractions/agent</span>
                <span class="stat-value">${agentsData.length > 0 ? Math.round(totalInfractions / agentsData.length) : 0}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Pic d'activité journalier</span>
                <span class="stat-value">17h-18h</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Moyenne par jour</span>
                <span class="stat-value">${avgPerDay}</span>
              </div>
            </div>

            <div class="footer">
              <p><strong>Rapport généré automatiquement par le système de gestion des infractions</strong></p>
              <p>${data.exportDate}</p>
              <p style="margin-top: 10px; color: #00124c; font-weight: 600;">Vision IA - Système de Gestion des Infractions Routières</p>
            </div>
          </div>
        </body>
        </html>
      `);
      reportWindow.document.close();
    }
  };

  const maxEvolution = Math.max(...evolutionData.map(d => d.infractions));
  const maxTypes = Math.max(...typesData.map(d => d.count));

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#00124c]">
              Statistiques & Analyses
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Vue analytique complète des données d'infractions
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CustomSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={[
                { value: 'today', label: "Aujourd'hui" },
                { value: 'week', label: 'Semaine' },
                { value: 'month', label: 'Mois' },
                { value: 'quarter', label: 'Trimestre' },
                { value: 'year', label: 'Année' },
                { value: 'custom', label: 'Personnalisé' }
              ]}
              className="w-40"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 sm:px-4 py-2 bg-white border border-gray-300 hover:border-[#00124c] text-gray-700 rounded-lg font-medium transition-all flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtres</span>
              {(selectedZone !== 'all' || selectedType !== 'all' || selectedAgent !== 'all' || selectedStatus !== 'all') && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                  {[selectedZone, selectedType, selectedAgent, selectedStatus].filter(f => f !== 'all').length}
                </span>
              )}
            </button>
            <div className="relative">
              <CustomSelect
                value=""
                onChange={(format) => {
                  if (format) exportData(format);
                }}
                options={[
                  {
                    value: '',
                    label: 'Exporter',
                    icon: (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M16,11V18.5L13,15.5L10,18.5V11H16Z"/>
                      </svg>
                    ),
                    color: 'text-gray-600',
                    description: 'Choisir un format d\'exportation'
                  },
                  {
                    value: 'pdf',
                    label: 'PDF',
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10.5,11.5C10.5,11.5 11.5,11.5 12,11.5C13,11.5 13.5,12 13.5,13C13.5,14 13,14.5 12,14.5H11V16.5H10.5V11.5M11,12V14H12C12.5,14 13,13.75 13,13C13,12.25 12.5,12 12,12H11M14.5,11.5H16.5C17.5,11.5 18,12 18,13V14C18,15 17.5,15.5 16.5,15.5H15V16.5H14.5V11.5M15,12V15H16.5C17,15 17.5,14.75 17.5,14V13C17.5,12.25 17,12 16.5,12H15M6,11.5H8.5C9.5,11.5 10,12 10,13V16.5H9.5V15H6.5V16.5H6V11.5M6.5,12V14.5H9.5V13C9.5,12.25 9,12 8.5,12H6.5Z"/>
                      </svg>
                    ),
                    color: 'text-red-600',
                    description: 'Rapport complet avec graphiques'
                  },
                  {
                    value: 'csv',
                    label: 'CSV',
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,19L12,15H9V10H15V15L13,19H10Z"/>
                      </svg>
                    ),
                    color: 'text-green-600',
                    description: 'Données tabulaires exportables'
                  },
                  {
                    value: 'json',
                    label: 'JSON',
                    icon: (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5,3H7V5H5V10A2,2 0 0,1 3,12A2,2 0 0,1 5,14V19H7V21H5C3.93,20.73 3,20.1 3,19V15A2,2 0 0,0 1,13H0V11H1A2,2 0 0,0 3,9V5A2,2 0 0,1 5,3M19,3A2,2 0 0,1 21,5V9A2,2 0 0,0 23,11H24V13H23A2,2 0 0,0 21,15V19A2,2 0 0,1 19,21H17V19H19V14A2,2 0 0,1 21,12A2,2 0 0,1 19,10V5H17V3H19M12,15A1,1 0 0,1 13,16A1,1 0 0,1 12,17A1,1 0 0,1 11,16A1,1 0 0,1 12,15M8,15A1,1 0 0,1 9,16A1,1 0 0,1 8,17A1,1 0 0,1 7,16A1,1 0 0,1 8,15M16,15A1,1 0 0,1 17,16A1,1 0 0,1 16,17A1,1 0 0,1 15,16A1,1 0 0,1 16,15Z"/>
                      </svg>
                    ),
                    color: 'text-blue-600',
                    description: 'Format API pour développeurs'
                  }
                ]}
                placeholder="Exporter"
                className="w-44"
                isExport={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 sm:mb-6 animate-slideDown">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Zone</label>
              <CustomSelect
                value={selectedZone}
                onChange={setSelectedZone}
                options={[
                  { value: 'all', label: 'Toutes les zones' },
                  { value: 'plateau', label: 'Dakar Plateau' },
                  { value: 'almadies', label: 'Almadies' },
                  { value: 'point-e', label: 'Point E' },
                  { value: 'ouest-foire', label: 'Ouest Foire' }
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type d'infraction</label>
              <CustomSelect
                value={selectedType}
                onChange={setSelectedType}
                options={[
                  { value: 'all', label: 'Tous les types' },
                  { value: 'speed', label: 'Excès de vitesse' },
                  { value: 'parking', label: 'Stationnement' },
                  { value: 'red-light', label: 'Feu rouge' },
                  { value: 'phone', label: 'Téléphone' }
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Agent</label>
              <CustomSelect
                value={selectedAgent}
                onChange={setSelectedAgent}
                options={[
                  { value: 'all', label: 'Tous les agents' },
                  { value: 'diop', label: 'Agent Diop' },
                  { value: 'ndiaye', label: 'Agent Ndiaye' },
                  { value: 'fall', label: 'Agent Fall' }
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Statut</label>
              <CustomSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: 'all', label: 'Tous les statuts' },
                  { value: 'paid', label: 'Payée' },
                  { value: 'pending', label: 'En attente' },
                  { value: 'relance', label: 'Relance' }
                ]}
              />
            </div>
          </div>
          {selectedPeriod === 'custom' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date début</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00124c]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Date fin</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00124c]"
                />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Réinitialiser
            </button>
            <button 
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-lg text-sm transition-colors"
            >
              Appliquer
            </button>
          </div>
        </div>
      )}

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className={`bg-white rounded-xl border-2 border-[#00124c] p-3 sm:p-4 hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '100ms' }}>
          <div className="text-xs font-semibold text-[#00124c] tracking-wider">TOTAL</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#00124c] mt-1 sm:mt-2">{totalInfractions}</div>
          <div className="text-xs text-green-600 mt-1 flex items-center">
            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            +12%
          </div>
        </div>
        <div className={`bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-green-500 hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '200ms' }}>
          <div className="text-xs font-semibold text-gray-600 tracking-wider">PAYÉES</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600 mt-1 sm:mt-2">{totalPaid}</div>
          <div className="text-xs text-green-600 mt-1">{totalInfractions > 0 ? ((totalPaid / totalInfractions) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className={`bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-orange-500 hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '300ms' }}>
          <div className="text-xs font-semibold text-gray-600 tracking-wider">ATTENTE</div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1 sm:mt-2">{totalPending}</div>
          <div className="text-xs text-orange-600 mt-1">{totalInfractions > 0 ? ((totalPending / totalInfractions) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className={`bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-red-500 hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '400ms' }}>
          <div className="text-xs font-semibold text-gray-600 tracking-wider">RELANCES</div>
          <div className="text-2xl sm:text-3xl font-bold text-red-600 mt-1 sm:mt-2">{totalRelance}</div>
          <div className="text-xs text-red-600 mt-1">{totalInfractions > 0 ? ((totalRelance / totalInfractions) * 100).toFixed(1) : 0}%</div>
        </div>
        <div className={`bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '500ms' }}>
          <div className="text-xs font-semibold text-gray-600 tracking-wider">RECOUVR.</div>
          <div className="text-xl sm:text-2xl font-bold text-[#00124c] mt-1 sm:mt-2">{(totalRevenue / 1000000).toFixed(1)}M</div>
          <div className="text-xs text-gray-600 mt-1">FCFA</div>
        </div>
        <div className={`bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '600ms' }}>
          <div className="text-xs font-semibold text-gray-600 tracking-wider">MOY/JOUR</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#00124c] mt-1 sm:mt-2">{avgPerDay}</div>
          <div className="text-xs text-green-600 mt-1">+5%</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Evolution Chart */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDuration: '800ms', transitionDelay: '700ms' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#00124c]">Évolution Temporelle</h3>
            <div className="flex space-x-2">
              <button className="px-2 py-1 text-xs bg-[#00124c] text-white rounded">Tout</button>
              <button className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200">Payées</button>
            </div>
          </div>
          <div className="h-48 sm:h-64 flex items-end justify-between space-x-2">
            {evolutionData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1 sm:space-y-2">
                <div className="w-full relative" style={{ height: '150px' }}>
                  <div
                    className={`absolute bottom-0 w-full bg-gradient-to-t from-[#00124c] to-[#5a7a7c] rounded-t-lg transition-all hover:from-[#2d4a4c] hover:to-[#4a6a6c] cursor-pointer group ${isLoaded ? 'scale-y-100' : 'scale-y-0'}`}
                    style={{ 
                      height: `${maxEvolution > 0 ? (item.infractions / maxEvolution) * 100 : 0}%`,
                      transitionDuration: '1000ms',
                      transitionDelay: `${800 + index * 100}ms`,
                      transformOrigin: 'bottom'
                    }}
                  >
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap z-10">
                      Total: {item.infractions}<br/>
                      Payées: {item.paid}
                    </div>
                  </div>
                  <div className={`absolute -top-5 sm:-top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-900 transition-all ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: `${1300 + index * 100}ms` }}>
                    {item.infractions}
                  </div>
                </div>
                <div className="text-xs text-gray-600 font-medium">{item.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Types Distribution */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDuration: '800ms', transitionDelay: '800ms' }}>
          <h3 className="text-lg sm:text-xl font-bold text-[#00124c] mb-4 sm:mb-5">Répartition par Type</h3>
          <div className="space-y-3 sm:space-y-4">
            {typesData.map((item, index) => (
              <div key={index} className="space-y-1.5 sm:space-y-2 group">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">{item.type}</span>
                  <div className="text-right">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{item.count}</span>
                    <span className="text-xs text-gray-500 ml-2">{(item.amount / 1000).toFixed(0)}K FCFA</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all shadow-sm group-hover:shadow-md ${isLoaded ? 'w-full' : 'w-0'}`}
                    style={{ 
                      width: isLoaded ? `${maxTypes > 0 ? (item.count / maxTypes) * 100 : 0}%` : '0%',
                      transitionDuration: '1200ms',
                      transitionDelay: `${1200 + index * 150}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Distribution & Vehicle Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Hourly Distribution */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`} style={{ transitionDuration: '800ms', transitionDelay: '1800ms' }}>
          <h3 className="text-lg sm:text-xl font-bold text-[#00124c] mb-4">Distribution Horaire</h3>
          <div className="h-48 flex items-end justify-between space-x-1">
            {hourlyData.map((item, index) => {
              const maxHourly = Math.max(...hourlyData.map(d => d.count));
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="w-full relative h-32">
                    <div
                      className={`absolute bottom-0 w-full bg-gradient-to-t from-[#D7AF84FF] to-[#d4a574] rounded-t transition-all group-hover:from-[#D69856FF] group-hover:to-[#d4a574] cursor-pointer ${isLoaded ? 'scale-y-100' : 'scale-y-0'}`}
                      style={{ 
                        height: `${maxHourly > 0 ? (item.count / maxHourly) * 100 : 0}%`,
                        transitionDuration: '1000ms',
                        transitionDelay: `${2000 + index * 80}ms`,
                        transformOrigin: 'bottom'
                      }}
                    >
                      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 text-xs font-semibold bg-gray-900 text-white px-1.5 py-0.5 rounded z-10">
                        {item.count}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{item.hour}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vehicle Types */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`} style={{ transitionDuration: '800ms', transitionDelay: '1900ms' }}>
          <h3 className="text-lg sm:text-xl font-bold text-[#00124c] mb-4">Types de Véhicules</h3>
          <div className="space-y-4">
            {vehicleTypes.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="text-2xl font-bold text-[#00124c]">{item.percentage}%</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.type}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-[#00124c] to-[#5a7a7c] h-2 rounded-full transition-all ${isLoaded ? 'w-full' : 'w-0'}`}
                      style={{ 
                        width: isLoaded ? `${item.percentage}%` : '0%',
                        transitionDuration: '1200ms',
                        transitionDelay: `${2200 + index * 150}ms`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Zones & Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Top Zones */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '2800ms' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#00124c]">Top Zones à Risque</h3>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-semibold">HOT</span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {zonesData.slice(0, 5).map((item, index) => (
              <div key={index} className="flex items-center space-x-3 sm:space-x-4 group">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-[#00124c] to-[#2d4a4c] rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-medium text-gray-900 truncate">{item.zone}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900">{item.count}</span>
                      <span className="text-xs text-gray-500 ml-2">{(item.revenue / 1000).toFixed(0)}K</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all shadow-sm group-hover:shadow-md ${isLoaded ? 'w-full' : 'w-0'}`}
                      style={{ 
                        width: isLoaded ? `${item.percentage * 5}%` : '0%',
                        transitionDuration: '1000ms',
                        transitionDelay: `${3000 + index * 150}ms`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Agents */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '2900ms' }}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#00124c]">Performance Agents</h3>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">ACTIF</span>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {agentsData.slice(0, 5).map((item, index) => {
              const maxAgent = Math.max(...agentsData.map(a => a.infractions));
              return (
                <div key={index} className="flex items-center space-x-3 sm:space-x-4 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300 group-hover:border-[#00124c] transition-all">
                    <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-sm font-medium text-gray-900 truncate">{item.agent}</span>
                      <div className="text-xs text-gray-600">
                        <span className="text-gray-900 font-semibold">{item.validated}</span>/{item.infractions}
                        <span className="ml-2 text-green-600 font-semibold">{item.efficiency}%</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`bg-[#00124c] h-1.5 rounded-full transition-all shadow-sm ${isLoaded ? 'w-full' : 'w-0'}`}
                          style={{ 
                            width: isLoaded ? `${maxAgent > 0 ? (item.infractions / maxAgent) * 100 : 0}%` : '0%',
                            transitionDuration: '1000ms',
                            transitionDelay: `${3100 + index * 150}ms`
                          }}
                        ></div>
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full transition-all shadow-sm ${isLoaded ? 'w-full' : 'w-0'}`}
                          style={{ 
                            width: isLoaded ? `${maxAgent > 0 ? (item.validated / maxAgent) * 100 : 0}%` : '0%',
                            transitionDuration: '1000ms',
                            transitionDelay: `${3100 + index * 150}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Methods & Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Payment Methods */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '3600ms' }}>
          <h3 className="text-lg font-bold text-[#00124c] mb-4">Modes de Paiement</h3>
          <div className="space-y-3">
            {paymentMethods.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    index === 0 ? 'bg-yellow-500' : 
                    index === 1 ? 'bg-orange-500' : 
                    index === 2 ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm text-gray-700">{item.method}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">{item.count}</span>
                  <span className="text-xs text-gray-500 ml-2">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Taux de Recouvrement */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '3700ms' }}>
          <h3 className="text-lg font-bold text-[#00124c] mb-4">Taux de Recouvrement</h3>
          <div className="flex items-center justify-center h-32">
            <div className="relative w-32 h-32">
              <svg className="transform -rotate-90 w-32 h-32">
                <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle 
                  cx="64" cy="64" r="56" 
                  stroke="#00124c" 
                  strokeWidth="12" 
                  fill="none"
                  strokeDasharray={isLoaded ? `${totalInfractions > 0 ? ((totalPaid / totalInfractions) * 352) : 0} 352` : '0 352'}
                  strokeLinecap="round"
                  style={{ 
                    transition: 'stroke-dasharray 1500ms ease-out',
                    transitionDelay: '3900ms'
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-[#00124c]">
                  {totalInfractions > 0 ? ((totalPaid / totalInfractions) * 100).toFixed(1) : 0}%
                </span>
                <span className="text-xs text-gray-600">Payées</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div>
              <div className="text-xs text-gray-600">Payées</div>
              <div className="text-lg font-bold text-green-600">{totalPaid}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Attente</div>
              <div className="text-lg font-bold text-orange-600">{totalPending}</div>
            </div>
            <div>
              <div className="text-xs text-gray-600">Relances</div>
              <div className="text-lg font-bold text-red-600">{totalRelance}</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '3800ms' }}>
          <h3 className="text-lg font-bold text-[#00124c] mb-4">Statistiques Rapides</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Délai moyen de paiement</span>
              <span className="text-sm font-bold text-[#00124c]">3.2 jours</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Montant moyen</span>
              <span className="text-sm font-bold text-[#00124c]">
                {totalInfractions > 0 ? (totalRevenue / totalInfractions).toFixed(0) : 0} FCFA
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Taux de contestation</span>
              <span className="text-sm font-bold text-red-600">2.8%</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Infractions/Agent</span>
              <span className="text-sm font-bold text-[#00124c]">
                {agentsData.length > 0 ? Math.round(totalInfractions / agentsData.length) : 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">Pic d'activité</span>
              <span className="text-sm font-bold text-[#00124c]">17h-18h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparaison Périodes */}
      <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all mb-4 sm:mb-6 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '4200ms' }}>
        <h3 className="text-lg sm:text-xl font-bold text-[#00124c] mb-4">Comparaison avec Période Précédente</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Infractions</div>
            <div className="text-2xl font-bold text-green-600">+12%</div>
            <div className="text-xs text-gray-500 mt-1">vs période précédente</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Recouvrement</div>
            <div className="text-2xl font-bold text-green-600">+8.5%</div>
            <div className="text-xs text-gray-500 mt-1">vs période précédente</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Temps moyen</div>
            <div className="text-2xl font-bold text-red-600">-15%</div>
            <div className="text-xs text-gray-500 mt-1">plus rapide</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-xs text-gray-600 mb-1">Efficacité agents</div>
            <div className="text-2xl font-bold text-green-600">+3.2%</div>
            <div className="text-xs text-gray-500 mt-1">vs période précédente</div>
          </div>
        </div>
      </div>

      {/* Top Infractions Details */}
      <div className={`bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 hover:border-[#00124c] hover:shadow-lg transition-all mb-4 sm:mb-6 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '4300ms' }}>
        <h3 className="text-lg sm:text-xl font-bold text-[#00124c] mb-4">Détails des Infractions les Plus Fréquentes</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Nombre</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Montant Total</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Payées</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">En Attente</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Taux</th>
              </tr>
            </thead>
            <tbody>
              {typesData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900 font-medium">{item.type}</td>
                  <td className="py-3 px-4 text-sm text-center font-semibold text-gray-900">{item.count}</td>
                  <td className="py-3 px-4 text-sm text-center text-gray-700">{(item.amount / 1000).toFixed(0)}K FCFA</td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {Math.floor(item.count * 0.75)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-semibold">
                      {Math.floor(item.count * 0.25)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    <span className="text-green-600 font-semibold">75%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend & Footer */}
      <div className={`bg-white rounded-2xl border border-gray-200 p-3 sm:p-4 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{ transitionDuration: '600ms', transitionDelay: '4400ms' }}>
        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-[#00124c] rounded-full"></div>
            <span className="text-xs text-gray-600">Infractions totales</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Infractions validées</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <span className="text-xs text-gray-600">Zones à risque</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"></div>
            <span className="text-xs text-gray-600">Distribution horaire</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { 
              day: '2-digit', 
              month: 'long', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
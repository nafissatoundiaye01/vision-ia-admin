'use client';

import { useState, useMemo } from 'react';
import DakarMap from '../components/ui/DakarMap';
import DakarMapbox from '../components/ui/DakarMap';
import CustomSelect from '../components/ui/CustomSelect';

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('today');

  // Données complètes par période
  const dataByPeriod = {
    today: {
      infractions: 247,
      tauxPaiement: 76.5,
      recouvrements: '12.4M',
      zonesCritiques: 8,
      variationInfractions: '+12%',
      variationTaux: '+3.2%',
      variationRecouv: '+8.1%',
      variationZones: '+2',
    },
    week: {
      infractions: 1843,
      tauxPaiement: 78.2,
      recouvrements: '89.7M',
      zonesCritiques: 8,
      variationInfractions: '+18%',
      variationTaux: '+5.1%',
      variationRecouv: '+12.4%',
      variationZones: '+1',
    },
    month: {
      infractions: 7256,
      tauxPaiement: 80.1,
      recouvrements: '342.5M',
      zonesCritiques: 8,
      variationInfractions: '+22%',
      variationTaux: '+7.8%',
      variationRecouv: '+15.2%',
      variationZones: '0',
    },
    year: {
      infractions: 89453,
      tauxPaiement: 82.3,
      recouvrements: '4.2B',
      zonesCritiques: 8,
      variationInfractions: '+28%',
      variationTaux: '+9.5%',
      variationRecouv: '+18.7%',
      variationZones: '-1',
    },
  };

  // Données filtrées selon la période
  const filteredData = useMemo(() => {
    return dataByPeriod[selectedPeriod as keyof typeof dataByPeriod];
  }, [selectedPeriod]);

  // KPIs Data avec données filtrées
  const kpis = [
    {
      label: selectedPeriod === 'today' ? 'Infractions Aujourd\'hui' :
             selectedPeriod === 'week' ? 'Infractions Cette Semaine' :
             selectedPeriod === 'month' ? 'Infractions Ce Mois' :
             'Infractions Cette Année',
      value: filteredData.infractions.toLocaleString('fr-FR'),
      change: filteredData.variationInfractions,
      trend: filteredData.variationInfractions.includes('+') ? 'up' : 'down',
      icon: 'clipboard'
    },
    {
      label: 'Taux de Paiement',
      value: `${filteredData.tauxPaiement}%`,
      change: filteredData.variationTaux,
      trend: filteredData.variationTaux.includes('+') ? 'up' : 'down',
      icon: 'chart'
    },
    {
      label: 'Recouvrements',
      value: `${filteredData.recouvrements} FCFA`,
      change: filteredData.variationRecouv,
      trend: filteredData.variationRecouv.includes('+') ? 'up' : 'down',
      icon: 'wallet'
    },
    {
      label: 'Zones Critiques',
      value: filteredData.zonesCritiques.toString(),
      change: filteredData.variationZones,
      trend: filteredData.variationZones.includes('+') ? 'up' : filteredData.variationZones === '0' ? 'neutral' : 'down',
      icon: 'alert'
    },
  ];

  // Recent Infractions
  const recentInfractions = [
    {
      id: '2024-001247',
      type: 'Excès de vitesse',
      plaque: 'DK-1234-AB',
      zone: 'Dakar Plateau',
      montant: '25,000',
      statut: 'En attente',
      time: 'Il y a 5 min'
    },
    {
      id: '2024-001246',
      type: 'Stationnement interdit',
      plaque: 'TH-5678-CD',
      zone: 'Almadies',
      montant: '15,000',
      statut: 'Payé',
      time: 'Il y a 12 min'
    },
    {
      id: '2024-001245',
      type: 'Feu rouge grillé',
      plaque: 'DK-9012-EF',
      zone: 'Point E',
      montant: '50,000',
      statut: 'En attente',
      time: 'Il y a 18 min'
    },
    {
      id: '2024-001244',
      type: 'Téléphone au volant',
      plaque: 'RU-3456-GH',
      zone: 'Ouest Foire',
      montant: '20,000',
      statut: 'Payé',
      time: 'Il y a 25 min'
    },
  ];

  // Zones à risque
  const zonesRisque = [
    { zone: 'Dakar Plateau', infractions: 45, variation: '+15%' },
    { zone: 'Almadies', infractions: 38, variation: '+8%' },
    { zone: 'Point E', infractions: 32, variation: '+12%' },
    { zone: 'Ouest Foire', infractions: 28, variation: '+5%' },
  ];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Payé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'Relance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIcon = (iconName: string) => {
    const iconClass = "w-6 h-6";
    switch (iconName) {
      case 'clipboard':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case 'chart':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'wallet':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'alert':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Obtenir le label de la période
  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case 'today': return 'aujourd\'hui';
      case 'week': return 'cette semaine';
      case 'month': return 'ce mois';
      case 'year': return 'cette année';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3d5a5c]">Tableau de Bord</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Vue d'ensemble du système de gestion des infractions - <span className="font-semibold text-[#3d5a5c]">{getPeriodLabel()}</span>
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <CustomSelect
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              options={[
                { value: 'today', label: 'Aujourd\'hui' },
                { value: 'week', label: 'Cette semaine' },
                { value: 'month', label: 'Ce mois' },
                { value: 'year', label: 'Cette année' }
              ]}
              placeholder="Sélectionner une période"
            />
           
          </div>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-6">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:border-[#3d5a5c] hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#3d5a5c] rounded-lg flex items-center justify-center text-white shadow-sm">
                {getIcon(kpi.icon)}
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${
                kpi.trend === 'up' ? 'text-green-600' :
                kpi.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {kpi.change}
              </span>
            </div>
            <h3 className="text-xs sm:text-sm text-gray-600 mb-1">{kpi.label}</h3>
            <p className="text-xl sm:text-xl md:text-2xl font-bold text-[#3d5a5c]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Carte Interactive Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3  md:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#3d5a5c]">Carte des Infractions</h2>
            <button  className="text-sm text-[#3d5a5c] hover:text-[#3d5a5c] font-medium transition-colors text-left sm:text-right">
              Voir carte complète →
            </button>
          </div>

          {/* Carte Google Maps */}
          <div className="bg-gray-100 rounded-xl h-120 sm:h-120 overflow-hidden border border-gray-200">
            <DakarMapbox
              zones={[
                { zone: 'Dakar Plateau', infractions: 45, lat: 14.715, lng: -17.467, variation: '+15%' },
                { zone: 'Almadies', infractions: 38, lat: 14.735, lng: -17.5, variation: '+8%' },
                { zone: 'Point E', infractions: 32, lat: 14.72, lng: -17.45, variation: '+12%' },
                { zone: 'Ouest Foire', infractions: 28, lat: 14.7, lng: -17.48, variation: '+5%' },
              ]}
            />
          </div>
        </div>

        {/* Zones à Risque */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all">
          <h2 className="text-lg sm:text-xl font-bold text-[#3d5a5c] mb-4 md:mb-5">Zones à Risque</h2>
          <div className="space-y-3 sm:space-y-4">
            {zonesRisque.map((zone, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200 hover:border-red-300 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{zone.zone}</h3>
                    <p className="text-sm text-gray-600 mt-1">{zone.infractions} infractions</p>
                  </div>
                  <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full">
                    {zone.variation}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${(zone.infractions / 50) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Infractions Récentes */}
      <div className="mt-4 md:mt-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 md:mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-[#3d5a5c]">Infractions Récentes</h2>
          <button className="text-sm text-[#3d5a5c] hover:text-[#3d5a5c] font-medium transition-colors text-left sm:text-right">
            Voir toutes →
          </button>
        </div>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#3d5a5c] whitespace-nowrap">ID</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#3d5a5c] whitespace-nowrap">Type</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#3d5a5c] whitespace-nowrap">Plaque</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#3d5a5c] whitespace-nowrap hidden md:table-cell">Zone</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#3d5a5c] whitespace-nowrap">Montant</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#3d5a5c] whitespace-nowrap">Statut</th>
                  <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#3d5a5c] whitespace-nowrap hidden lg:table-cell">Heure</th>
                </tr>
              </thead>
              <tbody>
                {recentInfractions.map((infraction) => (
                  <tr key={infraction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm font-medium text-gray-900">{infraction.id}</span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm text-gray-700">{infraction.type}</span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm font-medium text-[#3d5a5c]">{infraction.plaque}</span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
                      <span className="text-xs sm:text-sm text-gray-600">{infraction.zone}</span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span className="text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">{infraction.montant} FCFA</span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(infraction.statut)}`}>
                        {infraction.statut}
                      </span>
                    </td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{infraction.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

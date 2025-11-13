'use client';

import { useState, useMemo } from 'react';
import DakarMap from '../components/ui/DakarMap';
import DakarMapbox from '../components/ui/DakarMap';
import CustomSelect from '../components/ui/CustomSelect';
import { SenegalFlagMini } from '../components/ui/SenegalFlag';

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

  // KPIs originaux et pertinents
  const totalInfractionsData = filteredData;

  // 1. Score de Conformité (pourcentage d'infractions non répétées)
  const scoreConformite = selectedPeriod === 'today' ? 87.3 :
                          selectedPeriod === 'week' ? 85.8 :
                          selectedPeriod === 'month' ? 84.2 :
                          82.5;

  // 2. Temps Moyen de Traitement (de la détection au paiement)
  const tempsMoyenTraitement = selectedPeriod === 'today' ? '4.2h' :
                               selectedPeriod === 'week' ? '6.8h' :
                               selectedPeriod === 'month' ? '12.5h' :
                               '18.3h';

  // 3. Taux de Détection IA (% d'infractions détectées automatiquement)
  const tauxDetectionIA = selectedPeriod === 'today' ? 68 :
                          selectedPeriod === 'week' ? 65 :
                          selectedPeriod === 'month' ? 62 :
                          58;

  // 4. Efficacité Agents (ratio infractions validées/détectées)
  const efficaciteAgents = selectedPeriod === 'today' ? 94.2 :
                           selectedPeriod === 'week' ? 92.8 :
                           selectedPeriod === 'month' ? 91.5 :
                           89.7;

  // 5. Impact Préventif (réduction dans zones critiques)
  const impactPreventif = selectedPeriod === 'today' ? -8 :
                          selectedPeriod === 'week' ? -12 :
                          selectedPeriod === 'month' ? -18 :
                          -25;

  // 6. Véhicules Récidivistes
  const vehiculesRecidivistes = selectedPeriod === 'today' ? 12 :
                                selectedPeriod === 'week' ? 38 :
                                selectedPeriod === 'month' ? 142 :
                                567;

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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#00124c]">Tableau de Bord</h1>
              <SenegalFlagMini className="shadow-md rounded" />
            </div>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Vue d'ensemble du système de gestion des infractions - <span className="font-semibold text-[#00124c]">{getPeriodLabel()}</span>
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
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:border-[#00124c] hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#00124c] rounded-lg flex items-center justify-center text-white shadow-sm">
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
            <p className="text-xl sm:text-xl md:text-2xl font-bold text-[#00124c]">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Carte Interactive Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3  md:mb-5">
            <h2 className="text-lg sm:text-xl font-bold text-[#00124c]">Carte des Infractions</h2>
            <button  className="text-sm text-[#00124c] hover:text-[#00124c] font-medium transition-colors text-left sm:text-right">
              Voir carte complète →
            </button>
          </div>

          {/* Carte Google Maps */}
          <div className="bg-gray-100 rounded-xl h-120 sm:h-120 overflow-hidden border border-gray-200">
            <DakarMapbox
              zones={[
                // ========== ZONE ROUGE (CRITIQUE) - 1 seule zone ==========
                // Une seule zone critique très réduite
                { zone: 'Pikine', infractions: 55, lat: 14.7500, lng: -17.3833, variation: '+12%' },

                // ========== ZONES ORANGES (MOYENNES) - 32-52 infractions ==========
                // Zones résidentielles et commerciales moyennes
                { zone: 'Plateau', infractions: 52, lat: 14.6937, lng: -17.4441, variation: '+11%' },
                { zone: 'Médina', infractions: 50, lat: 14.6850, lng: -17.4550, variation: '+10%' },
                { zone: 'Guédiawaye', infractions: 48, lat: 14.7833, lng: -17.4000, variation: '+9%' },
                { zone: 'Parcelles Assainies', infractions: 46, lat: 14.7833, lng: -17.4333, variation: '+9%' },
                { zone: 'Grand Dakar', infractions: 44, lat: 14.7167, lng: -17.4500, variation: '+8%' },
                { zone: 'Liberté 6', infractions: 42, lat: 14.7000, lng: -17.4600, variation: '+8%' },
                { zone: 'Ouest Foire', infractions: 40, lat: 14.7300, lng: -17.4750, variation: '+7%' },
                { zone: 'Thiaroye', infractions: 38, lat: 14.7833, lng: -17.3500, variation: '+7%' },
                { zone: 'Point E', infractions: 36, lat: 14.7050, lng: -17.4550, variation: '+6%' },
                { zone: 'Gueule Tapée', infractions: 34, lat: 14.6900, lng: -17.4600, variation: '+6%' },
                { zone: 'Ouakam', infractions: 32, lat: 14.7194, lng: -17.4897, variation: '+5%' },

                // ========== ZONES BLEUES (BIEN) - 5-30 infractions ==========
                // Zones résidentielles calmes et quartiers huppés
                { zone: 'Almadies', infractions: 28, lat: 14.7392, lng: -17.5094, variation: '+5%' },
                { zone: 'Mermoz', infractions: 24, lat: 14.7157, lng: -17.4677, variation: '+4%' },
                { zone: 'Fann', infractions: 20, lat: 14.7050, lng: -17.4650, variation: '+4%' },
                { zone: 'Yoff', infractions: 18, lat: 14.7500, lng: -17.4833, variation: '+3%' },
                { zone: 'Ngor', infractions: 15, lat: 14.7450, lng: -17.5150, variation: '+3%' },
                { zone: 'Amitié', infractions: 12, lat: 14.7200, lng: -17.4400, variation: '+2%' },
                { zone: 'Bargny', infractions: 8, lat: 14.6833, lng: -17.2333, variation: '+1%' },
              ]}
            />
          </div>
        </div>

        {/* Zones à Risque */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all">
          <h2 className="text-lg sm:text-xl font-bold text-[#00124c] mb-4 md:mb-5">Zones à Risque</h2>
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

      {/* KPIs Originaux et Intelligents */}
      <div className="mt-4 md:mt-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all">
        <h2 className="text-lg sm:text-xl font-bold text-[#00124c] mb-4 md:mb-6">Indicateurs de Performance</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Score de Conformité */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#00124c] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#00124c] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{scoreConformite}%</div>
            <div className="text-sm font-semibold text-[#00124c] mb-1">Score de Conformité</div>
            <div className="text-xs text-gray-500">Conducteurs sans récidive</div>
          </div>

          {/* Temps Moyen de Traitement */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#00124c] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#00124c] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{tempsMoyenTraitement}</div>
            <div className="text-sm font-semibold text-[#00124c] mb-1">Temps de Traitement</div>
            <div className="text-xs text-gray-500">Détection → Paiement</div>
          </div>

          {/* Taux de Détection IA */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#00124c] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#00124c] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{tauxDetectionIA}%</div>
            <div className="text-sm font-semibold text-[#00124c] mb-1">Détection Automatique</div>
            <div className="text-xs text-gray-500">VisionIA en action</div>
          </div>

          {/* Efficacité des Agents */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#00124c] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#00124c] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{efficaciteAgents}%</div>
            <div className="text-sm font-semibold text-[#00124c] mb-1">Efficacité Agents</div>
            <div className="text-xs text-gray-500">Taux de validation</div>
          </div>

          {/* Impact Préventif */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#00124c] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#00124c] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{impactPreventif}%</div>
            <div className="text-sm font-semibold text-[#00124c] mb-1">Impact Préventif</div>
            <div className="text-xs text-gray-500">Baisse zones critiques</div>
          </div>

          {/* Véhicules Récidivistes */}
          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-[#00124c] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#00124c] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{vehiculesRecidivistes}</div>
            <div className="text-sm font-semibold text-[#00124c] mb-1">Véhicules Récidivistes</div>
            <div className="text-xs text-gray-500">≥2 infractions détectées</div>
          </div>
        </div>
      </div>
    </div>
  );
}

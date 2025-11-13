'use client';

import { useState } from 'react';
import CustomSelect from '@/app/components/ui/CustomSelect';
import { VEHICLES, INFRACTIONS } from '@/app/data/mockData';

export default function VehiclesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterMarque, setFilterMarque] = useState('Toutes');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  // Convertir les données centralisées au format attendu par la page
  const vehicles = VEHICLES.map(v => ({
    id: v.id,
    plaque: v.plaque,
    marque: v.marque,
    modele: v.modele,
    annee: v.annee.toString(),
    proprietaire: v.proprietaire,
    telephone: v.telephone,
    adresse: v.adresse,
    infractions: v.infractions,
    montantDu: v.montantDu,
    carteGrise: {
      numero: `CG-${v.annee}-${Math.floor(Math.random() * 90000 + 10000)}`,
      dateExpiration: '15/03/2025',
      statut: v.carteGrise
    },
    assurance: {
      compagnie: v.compagnieAssurance,
      numero: `ASS-2024-${Math.floor(Math.random() * 90000 + 10000)}`,
      dateExpiration: '20/12/2024',
      statut: v.assurance
    },
    visiteTechnique: {
      numero: `VT-2024-${Math.floor(Math.random() * 90000 + 10000)}`,
      dateExpiration: '10/06/2025',
      statut: v.visiteTechnique
    }
  }));


  const marques = ['Toutes', ...new Set(vehicles.map(v => v.marque))];

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.plaque.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.proprietaire.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.modele.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMarque = filterMarque === 'Toutes' || vehicle.marque === filterMarque;
    
    const matchesStatut = 
      filterStatut === 'Tous' ||
      (filterStatut === 'En règle' && vehicle.montantDu === 0 && 
        vehicle.carteGrise.statut === 'Valide' && 
        vehicle.assurance.statut === 'Valide' && 
        vehicle.visiteTechnique.statut === 'Valide') ||
      (filterStatut === 'Documents expirés' &&
        (vehicle.carteGrise.statut === 'Expirée' ||
         vehicle.assurance.statut === 'Expirée' ||
         vehicle.visiteTechnique.statut === 'Expirée')) ||
      (filterStatut === 'Amendes impayées' && vehicle.montantDu > 0);

    return matchesSearch && matchesMarque && matchesStatut;
  });

  const getDocumentStatusColor = (statut: string) => {
    return statut === 'Valide'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (selectedVehicle) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button 
            onClick={() => setSelectedVehicle(null)}
            className="flex items-center text-[#00124c] hover:text-[#2d4a4c] mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Retour à la liste</span>
          </button>
          <h1 className="text-3xl font-bold text-[#00124c]">Détails du Véhicule</h1>
        </div>

        {/* Vehicle Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-[#00124c] mb-2">{selectedVehicle.plaque}</h2>
              <p className="text-xl text-gray-600">{selectedVehicle.marque} {selectedVehicle.modele} - {selectedVehicle.annee}</p>
            </div>
            <button className="px-4 py-2 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-lg font-medium transition-all flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Exporter PDF
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Total Infractions</div>
              <div className="text-2xl font-bold text-gray-900">{selectedVehicle.infractions}</div>
            </div>
            <div className={`rounded-lg p-4 ${selectedVehicle.montantDu > 0 ? 'bg-orange-50' : 'bg-green-50'}`}>
              <div className="text-sm text-gray-600 mb-1">Montant Dû</div>
              <div className={`text-2xl font-bold ${selectedVehicle.montantDu > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                {selectedVehicle.montantDu.toLocaleString()} FCFA
              </div>
            </div>
            <div className={`rounded-lg p-4 ${
              selectedVehicle.carteGrise.statut === 'Valide' && 
              selectedVehicle.assurance.statut === 'Valide' && 
              selectedVehicle.visiteTechnique.statut === 'Valide' 
                ? 'bg-green-50' 
                : 'bg-red-50'
            }`}>
              <div className="text-sm text-gray-600 mb-1">Statut Documents</div>
              <div className={`text-lg font-bold ${
                selectedVehicle.carteGrise.statut === 'Valide' && 
                selectedVehicle.assurance.statut === 'Valide' && 
                selectedVehicle.visiteTechnique.statut === 'Valide' 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}>
                {selectedVehicle.carteGrise.statut === 'Valide' && 
                 selectedVehicle.assurance.statut === 'Valide' && 
                 selectedVehicle.visiteTechnique.statut === 'Valide' 
                  ? 'En règle' 
                  : 'Documents à renouveler'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Proprietaire Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Propriétaire
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Nom complet:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.proprietaire}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Téléphone:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.telephone}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Adresse:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.adresse}</span>
              </div>
            </div>
          </div>

          {/* Carte Grise */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Carte Grise
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Numéro:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.carteGrise.numero}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Date expiration:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.carteGrise.dateExpiration}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Statut:</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDocumentStatusColor(selectedVehicle.carteGrise.statut)}`}>
                  {selectedVehicle.carteGrise.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Assurance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Assurance
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Compagnie:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.assurance.compagnie}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Numéro:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.assurance.numero}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Date expiration:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.assurance.dateExpiration}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Statut:</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDocumentStatusColor(selectedVehicle.assurance.statut)}`}>
                  {selectedVehicle.assurance.statut}
                </span>
              </div>
            </div>
          </div>

          {/* Visite Technique */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Visite Technique
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Numéro:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.visiteTechnique.numero}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Date expiration:</span>
                <span className="text-sm font-medium text-gray-900">{selectedVehicle.visiteTechnique.dateExpiration}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Statut:</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDocumentStatusColor(selectedVehicle.visiteTechnique.statut)}`}>
                  {selectedVehicle.visiteTechnique.statut}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#00124c]">Gestion des Véhicules</h1>
        <p className="text-gray-600 mt-1">Consultez et gérez tous les véhicules enregistrés</p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#00124c] mb-2">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Plaque, propriétaire, modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-[#d4a574]"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Marque Filter */}
          <div>
            <label className="block text-sm font-medium text-[#00124c] mb-2">
              Marque
            </label>
            <CustomSelect
              value={filterMarque}
              onChange={setFilterMarque}
              options={marques.map(marque => ({ value: marque, label: marque }))}
              placeholder="Sélectionner une marque"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-[#00124c] mb-2">
              Statut
            </label>
            <CustomSelect
              value={filterStatut}
              onChange={setFilterStatut}
              options={[
                { value: 'Tous', label: 'Tous' },
                { value: 'En règle', label: 'En règle' },
                { value: 'Documents expirés', label: 'Documents expirés' },
                { value: 'Amendes impayées', label: 'Amendes impayées' }
              ]}
              placeholder="Sélectionner un statut"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredVehicles.length} véhicule{filteredVehicles.length > 1 ? 's' : ''} trouvé{filteredVehicles.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredVehicles.map(vehicle => (
          <div 
            key={vehicle.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedVehicle(vehicle)}
          >
            {/* Plaque & Quick Status */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#00124c]">{vehicle.plaque}</h3>
                <p className="text-sm text-gray-600 mt-1">{vehicle.marque} {vehicle.modele}</p>
                <p className="text-xs text-gray-500">{vehicle.annee}</p>
              </div>
              {vehicle.montantDu > 0 && (
                <span className="bg-orange-100 text-orange-800 text-xs font-semibold px-2 py-1 rounded-full">
                  Amendes
                </span>
              )}
            </div>

            {/* Owner */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{vehicle.proprietaire}</span>
              </div>
            </div>

            {/* Documents Status */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Carte grise</span>
                <span className={`font-semibold px-2 py-1 rounded ${getDocumentStatusColor(vehicle.carteGrise.statut)}`}>
                  {vehicle.carteGrise.statut}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Assurance</span>
                <span className={`font-semibold px-2 py-1 rounded ${getDocumentStatusColor(vehicle.assurance.statut)}`}>
                  {vehicle.assurance.statut}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Visite technique</span>
                <span className={`font-semibold px-2 py-1 rounded ${getDocumentStatusColor(vehicle.visiteTechnique.statut)}`}>
                  {vehicle.visiteTechnique.statut}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{vehicle.infractions}</div>
                <div className="text-xs text-gray-600">Infractions</div>
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${vehicle.montantDu > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                  {vehicle.montantDu.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">FCFA dû</div>
              </div>
            </div>

            {/* View Details Button */}
            <button className="w-full mt-4 px-4 py-2 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center">
              Voir les détails
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredVehicles.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun véhicule trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
}
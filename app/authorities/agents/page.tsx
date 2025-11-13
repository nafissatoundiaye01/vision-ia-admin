'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Mail, Phone, MapPin, TrendingUp, Award, AlertCircle, Eye, Edit2, UserCheck, UserX, FileText, Calendar, Clock } from 'lucide-react';
import CustomSelect from '@/app/components/ui/CustomSelect';
import { AGENTS, INFRACTIONS, type Agent as AgentType, type Infraction as InfractionType } from '@/app/data/mockData';

interface Agent extends AgentType {
  photo?: string;
}

export default function AgentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [infractionSearchQuery, setInfractionSearchQuery] = useState('');
  const [infractionFilterStatut, setInfractionFilterStatut] = useState('Tous');

  const agents: Agent[] = AGENTS.map(agent => ({
    ...agent,
    photo: undefined
  }));

  // Fonction pour obtenir les infractions d'un agent
  const getAgentInfractions = (agentId: number): InfractionType[] => {
    return INFRACTIONS.filter(inf => inf.agentId === agentId);
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch =
      agent.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.matricule.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.zone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatut = filterStatut === 'Tous' || agent.statut === filterStatut;

    return matchesSearch && matchesStatut;
  });

  const totalAgents = agents.length;
  const agentsActifs = agents.filter(a => a.statut === 'Actif').length;
  const totalInfractions = agents.reduce((acc, a) => acc + a.infractions, 0);
  const totalValidated = agents.reduce((acc, a) => acc + a.validated, 0);
  const tauxValidation = totalInfractions > 0 ? ((totalValidated / totalInfractions) * 100).toFixed(1) : 0;

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Actif': return 'bg-green-100 text-green-800 border-green-200';
      case 'Inactif': return 'bg-red-100 text-red-800 border-red-200';
      case 'En pause': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'Actif': return <UserCheck className="w-4 h-4" />;
      case 'Inactif': return <UserX className="w-4 h-4" />;
      case 'En pause': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  const getInfractionStatusColor = (statut: string) => {
    switch (statut) {
      case 'Payé': return 'bg-green-100 text-green-800';
      case 'En attente': return 'bg-orange-100 text-orange-800';
      case 'Relance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Agent Detail View
  if (selectedAgent) {
    const agentInfractions = getAgentInfractions(selectedAgent.id);
    const filteredInfractions = agentInfractions.filter(infraction => {
      const matchesSearch =
        infraction.id.toLowerCase().includes(infractionSearchQuery.toLowerCase()) ||
        infraction.type.toLowerCase().includes(infractionSearchQuery.toLowerCase()) ||
        infraction.lieu.toLowerCase().includes(infractionSearchQuery.toLowerCase()) ||
        infraction.plaque.toLowerCase().includes(infractionSearchQuery.toLowerCase());

      const matchesStatut =
        infractionFilterStatut === 'Tous' ||
        infraction.statut === infractionFilterStatut;

      return matchesSearch && matchesStatut;
    });
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => setSelectedAgent(null)}
            className="flex items-center text-[#00124c] hover:text-[#2d4a4c] mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Retour à la liste</span>
          </button>
          <h1 className="text-3xl font-bold text-[#00124c]">Détails de l'Agent</h1>
        </div>

        {/* Agent Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00124c] to-[#2d4a4c] rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-white">
                  {selectedAgent.prenom[0]}{selectedAgent.nom[0]}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#00124c] mb-1">
                  {selectedAgent.prenom} {selectedAgent.nom}
                </h2>
                <p className="text-lg text-gray-600">{selectedAgent.matricule}</p>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{selectedAgent.zone}</span>
                </div>
              </div>
            </div>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${getStatusColor(selectedAgent.statut)}`}>
              {getStatusIcon(selectedAgent.statut)}
              {selectedAgent.statut}
            </span>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Date d'entrée</div>
              <div className="text-lg font-bold text-gray-900">{selectedAgent.dateEntree}</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Infractions créées</div>
              <div className="text-2xl font-bold text-blue-600">{selectedAgent.infractions}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Infractions validées</div>
              <div className="text-2xl font-bold text-green-600">{selectedAgent.validated}</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Taux de validation</div>
              <div className="text-2xl font-bold text-purple-600">
                {((selectedAgent.validated / selectedAgent.infractions) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Informations de contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Email:</span>
                <span className="text-sm font-medium text-gray-900">{selectedAgent.email}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Téléphone:</span>
                <span className="text-sm font-medium text-gray-900">{selectedAgent.tel}</span>
              </div>
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Zone:</span>
                <span className="text-sm font-medium text-gray-900">{selectedAgent.zone}</span>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              Performance
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Infractions validées</span>
                  <span className="text-sm font-bold text-gray-900">
                    {selectedAgent.validated}/{selectedAgent.infractions}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-[#00124c] h-3 rounded-full transition-all"
                    style={{ width: `${(selectedAgent.validated / selectedAgent.infractions) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>
                    Taux de validation: <strong>{((selectedAgent.validated / selectedAgent.infractions) * 100).toFixed(1)}%</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Historique des Infractions */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
            <FileText className="w-6 h-6 mr-2" />
            Historique des Infractions ({agentInfractions.length})
          </h3>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher par N°PV, type, lieu, plaque..."
                  value={infractionSearchQuery}
                  onChange={(e) => setInfractionSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
            </div>
            <div>
              <CustomSelect
                value={infractionFilterStatut}
                onChange={setInfractionFilterStatut}
                options={[
                  { value: 'Tous', label: 'Tous les statuts' },
                  { value: 'Payé', label: 'Payé' },
                  { value: 'En attente', label: 'En attente' },
                  { value: 'Relance', label: 'Relance' }
                ]}
                placeholder="Sélectionner un statut"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-gray-600">
            {filteredInfractions.length} infraction{filteredInfractions.length > 1 ? 's' : ''} trouvée{filteredInfractions.length > 1 ? 's' : ''}
          </div>

          {/* Infractions Table - Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">N° PV</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date/Heure</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Lieu</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plaque</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Montant</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Validée</th>
                </tr>
              </thead>
              <tbody>
                {filteredInfractions.map((infraction) => (
                  <tr key={infraction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono text-gray-900">{infraction.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {infraction.date}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {infraction.heure}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">{infraction.type}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{infraction.lieu}</td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-mono font-semibold bg-gray-100 px-2 py-1 rounded">
                        {infraction.plaque}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                      {infraction.montant.toLocaleString()} FCFA
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getInfractionStatusColor(infraction.statut)}`}>
                        {infraction.statut}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-green-600">
                        <UserCheck className="w-4 h-4" />
                        <span className="text-xs font-medium">Oui</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Infractions Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {filteredInfractions.map((infraction) => (
              <div key={infraction.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 mb-1">N° PV</div>
                    <div className="font-mono font-semibold text-gray-900">{infraction.id}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getInfractionStatusColor(infraction.statut)}`}>
                    {infraction.statut}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Date/Heure</div>
                    <div className="flex items-center gap-1 text-gray-900">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {infraction.date}
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {infraction.heure}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Montant</div>
                    <div className="font-semibold text-gray-900">
                      {infraction.montant.toLocaleString()} FCFA
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500 mb-1">Type d'infraction</div>
                  <div className="text-sm font-medium text-gray-900">{infraction.type}</div>
                </div>

                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Lieu</div>
                  <div className="text-sm text-gray-600">{infraction.lieu}</div>
                </div>

                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Plaque</div>
                    <span className="text-sm font-mono font-semibold bg-gray-100 px-2 py-1 rounded">
                      {infraction.plaque}
                    </span>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-green-600">
                      <UserCheck className="w-4 h-4" />
                      <span className="text-xs font-medium">Validée</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredInfractions.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Aucune infraction trouvée</h3>
              <p className="text-gray-500">
                {infractionSearchQuery || infractionFilterStatut !== 'Tous'
                  ? 'Essayez de modifier vos critères de recherche'
                  : 'Cet agent n\'a pas encore enregistré d\'infractions'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#00124c]">Gestion des Agents</h1>
            <p className="text-gray-600 mt-1">Gérez vos agents et suivez leurs performances</p>
          </div>
          <button
            onClick={() => router.push('/authorities/agents/nouveau')}
            className="px-4 py-2 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-lg font-medium transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouvel Agent
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Total Agents</div>
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{totalAgents}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Agents Actifs</div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-green-600">{agentsActifs}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Infractions Totales</div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-blue-600">{totalInfractions}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600">Taux Validation</div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-purple-600">{tauxValidation}%</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-[#00124c] mb-2">
              Rechercher
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nom, matricule, zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
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
                { value: 'Actif', label: 'Actif' },
                { value: 'Inactif', label: 'Inactif' },
                { value: 'En pause', label: 'En pause' }
              ]}
              placeholder="Sélectionner un statut"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredAgents.length} agent{filteredAgents.length > 1 ? 's' : ''} trouvé{filteredAgents.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setSelectedAgent(agent)}
          >
            {/* Agent Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#00124c] to-[#2d4a4c] rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {agent.prenom[0]}{agent.nom[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {agent.prenom} {agent.nom}
                  </h3>
                  <p className="text-xs text-gray-500">{agent.matricule}</p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(agent.statut)}`}>
                {getStatusIcon(agent.statut)}
                {agent.statut}
              </span>
            </div>

            {/* Zone */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-700">{agent.zone}</span>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 truncate">{agent.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{agent.tel}</span>
              </div>
            </div>

            {/* Performance */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Performance</span>
                <span className="text-sm font-bold text-gray-900">
                  {agent.validated}/{agent.infractions}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#00124c] h-2.5 rounded-full transition-all"
                  style={{ width: `${(agent.validated / agent.infractions) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {((agent.validated / agent.infractions) * 100).toFixed(1)}% de validation
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAgent(agent);
                }}
                className="flex-1 px-3 py-2 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Détails
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/authorities/agents/${agent.id}/modifier`);
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAgents.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun agent trouvé</h3>
          <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
}

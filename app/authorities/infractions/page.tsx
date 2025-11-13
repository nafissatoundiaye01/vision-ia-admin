'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, Camera, FileText, MapPin, Calendar } from 'lucide-react';
import { INFRACTIONS, AGENTS } from '@/app/data/mockData';
import CustomSelect from '@/app/components/ui/CustomSelect';
import { SenegalFlagMini } from '@/app/components/ui/SenegalFlag';

export default function InfractionsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Convertir les données centralisées au format attendu par la page
  const infractions = INFRACTIONS.map(inf => {
    const agent = AGENTS.find(a => a.id === inf.agentId);
    return {
      id: inf.id,
      date: inf.date,
      heure: inf.heure,
      type: inf.type,
      lieu: inf.lieu,
      plaque: inf.plaque,
      montant: inf.montant.toString(),
      statut: inf.statut,
      agent: agent ? `${agent.prenom} ${agent.nom}` : inf.source,
      source: inf.agentId ? 'Agent' as const : 'VisionIA' as const,
      description: undefined,
      photos: inf.photo ? [inf.photo] : undefined
    };
  });

  const [formData, setFormData] = useState<Partial<any>>({
    date: '',
    heure: '',
    type: '',
    lieu: '',
    plaque: '',
    montant: '',
    statut: 'En attente',
    agent: '',
    source: 'Agent',
    description: '',
    photos: []
  });

  const types = ['Excès de vitesse', 'Stationnement interdit', 'Feu rouge grillé', 'Téléphone au volant', 'Absence ceinture', 'Document périmé'];
  const agents = ['Agent Diop', 'Agent Ndiaye', 'Agent Fall', 'Agent Seck', 'Agent Ba'];
  const cameras = ['VisionIA - Caméra 01', 'VisionIA - Caméra 02', 'VisionIA - Caméra 03', 'VisionIA - Caméra 05', 'VisionIA - Caméra 08', 'VisionIA - Caméra 12', 'VisionIA - Caméra 15'];

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Payé': return 'bg-green-100 text-green-800 border border-green-200';
      case 'En attente': return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Relance': return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getSourceBadge = (source: string) => {
    return source === 'VisionIA' 
      ? 'bg-purple-100 text-purple-800 border border-purple-200'
      : 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  const filteredInfractions = infractions.filter(inf => {
    const matchesSearch = searchQuery === '' || 
      inf.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.plaque.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inf.lieu.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || inf.statut === selectedStatus;
    const matchesType = selectedType === 'all' || inf.type === selectedType;
    const matchesSource = selectedSource === 'all' || inf.source === selectedSource;
    
    return matchesSearch && matchesStatus && matchesType && matchesSource;
  });

  const totalPages = Math.ceil(filteredInfractions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedInfractions = filteredInfractions.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: infractions.length,
    payees: infractions.filter(i => i.statut === 'Payé').length,
    enAttente: infractions.filter(i => i.statut === 'En attente').length,
    relances: infractions.filter(i => i.statut === 'Relance').length,
    visionIA: infractions.filter(i => i.source === 'VisionIA').length,
    agents: infractions.filter(i => i.source === 'Agent').length
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#00124c]">
                Gestion des Infractions
              </h1>
              <SenegalFlagMini className="shadow-md rounded" />
            </div>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Surveillance automatisée et agents terrain</p>
          </div>
          <button
            onClick={() => router.push('/authorities/infractions/nouveau')}
            className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Nouvelle infraction</span>
            <span className="sm:hidden">Nouvelle</span>
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Total</div>
          <div className="text-2xl sm:text-3xl font-bold text-[#00124c]">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Payées</div>
          <div className="text-2xl sm:text-3xl font-bold text-green-600">{stats.payees}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">En attente</div>
          <div className="text-2xl sm:text-3xl font-bold text-orange-600">{stats.enAttente}</div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Relances</div>
          <div className="text-2xl sm:text-3xl font-bold text-red-600">{stats.relances}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">VisionIA</div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">{stats.visionIA}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 p-4 sm:p-5 hover:shadow-lg transition-shadow">
          <div className="text-xs sm:text-sm text-gray-600 mb-1">Agents</div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{stats.agents}</div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 mb-4 sm:mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par ID, plaque, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#00124c]"
              />
            </div>
          </div>

          <div>
            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={[
                { value: 'all', label: 'Tous statuts' },
                { value: 'Payé', label: 'Payé' },
                { value: 'En attente', label: 'En attente' },
                { value: 'Relance', label: 'Relance' }
              ]}
              placeholder="Sélectionner un statut"
            />
          </div>

          <div>
            <CustomSelect
              value={selectedType}
              onChange={setSelectedType}
              options={[
                { value: 'all', label: 'Tous types' },
                ...types.map(type => ({ value: type, label: type }))
              ]}
              placeholder="Sélectionner un type"
            />
          </div>

          <div>
            <CustomSelect
              value={selectedSource}
              onChange={setSelectedSource}
              options={[
                { value: 'all', label: 'Toutes sources' },
                { value: 'VisionIA', label: 'VisionIA' },
                { value: 'Agent', label: 'Agents' }
              ]}
              placeholder="Source"
            />
          </div>
        </div>
      </div>

      {/* Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-hidden">
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[12%]">DATE/HEURE</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[15%]">TYPE</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[12%]">LIEU</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[12%]">PLAQUE</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[12%]">MONTANT</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[12%]">STATUT</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[13%]">SOURCE</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[7%]">PHOTOS</th>
                <th className="text-left py-4 px-3 text-xs font-semibold text-[#00124c] tracking-wider w-[9%]">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInfractions.map((infraction) => (
                <tr key={infraction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-3">
                    <div className="text-sm text-gray-700 truncate">{infraction.date}</div>
                    <div className="text-xs text-gray-500">{infraction.heure}</div>
                  </td>
                  <td className="py-4 px-3">
                    <span className="text-sm text-gray-700 truncate block">{infraction.type}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="text-sm text-gray-600 truncate block">{infraction.lieu}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="text-sm font-medium text-[#00124c] truncate block">{infraction.plaque}</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className="text-sm font-semibold text-gray-900 truncate block">{parseInt(infraction.montant).toLocaleString()} F</span>
                  </td>
                  <td className="py-4 px-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${getStatusColor(infraction.statut)}`}>
                      {infraction.statut}
                    </span>
                  </td>
                  <td className="py-4 px-3">
                    <div className="truncate">
                    <span className="text-sm text-black truncate block">{infraction.agent}</span>
                      
                    </div>
                  </td>
                  <td className="py-4 px-3">
                    {infraction.photos && infraction.photos.length > 0 ? (
                      <div className="flex items-center space-x-1">
                        <Camera className="w-4 h-4 text-[#00124c]" />
                        <span className="text-xs text-gray-600">{infraction.photos.length}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-3">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => router.push(`/authorities/infractions/${infraction.id}`)}
                        className="p-1.5 bg-[#00124c] hover:bg-[#2d4a4c] border border-[#00124c] rounded-lg transition-colors"
                        title="Voir les détails"
                      >
                        <Eye className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Affichage de {startIndex + 1} à {Math.min(startIndex + itemsPerPage, filteredInfractions.length)} sur {filteredInfractions.length} résultats
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 transition-all disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Précédent
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? 'bg-[#00124c] text-white shadow-lg'
                      : 'bg-white hover:bg-gray-100 border border-gray-300 text-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 transition-all disabled:opacity-50"
              disabled={currentPage === totalPages}
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {paginatedInfractions.map((infraction) => (
          <div key={infraction.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs font-semibold text-[#00124c] mb-1">{infraction.id}</div>
                <div className="text-lg font-bold text-gray-900">{infraction.plaque}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusColor(infraction.statut)}`}>
                  {infraction.statut}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getSourceBadge(infraction.source)}`}>
                  {infraction.source === 'VisionIA' ? '  IA' : '  Agent'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                {infraction.type}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                {infraction.lieu}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                {infraction.date} à {infraction.heure}
              </div>
              {infraction.photos && infraction.photos.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Camera className="w-4 h-4 mr-2 text-gray-400" />
                  {infraction.photos.length} photo(s)
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <div className="text-lg font-bold text-[#00124c]">
                {parseInt(infraction.montant).toLocaleString()} FCFA
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => router.push(`/authorities/infractions/${infraction.id}`)}
                  className="p-2 bg-[#00124c] hover:bg-[#2d4a4c] border border-[#00124c] rounded-lg transition-colors"
                  title="Voir les détails"
                >
                  <Eye className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Mobile Pagination */}
        <div className="flex justify-center items-center space-x-2 py-4">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 transition-all disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Préc
          </button>
          <span className="px-4 py-2 text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-700 transition-all disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Suiv
          </button>
        </div>
      </div>
    </div>
  );
}

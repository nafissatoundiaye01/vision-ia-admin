'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import CustomSelect from '@/app/components/ui/CustomSelect';

interface Agent {
  id: number;
  nom: string;
  prenom: string;
  matricule: string;
  zone: string;
  email: string;
  tel: string;
  statut: 'Actif' | 'Inactif' | 'En pause';
  dateEntree: string;
}

// Mock data - À remplacer par un appel API
const getMockAgent = (id: string): Agent | null => {
  const agents: Agent[] = [
    {
      id: 1,
      nom: 'Diop',
      prenom: 'Mamadou',
      matricule: 'AG-2024-001',
      zone: 'Dakar Plateau',
      email: 'mamadou.diop@vision-ia.sn',
      tel: '+221 77 123 45 67',
      statut: 'Actif',
      dateEntree: '15/01/2024'
    },
    {
      id: 2,
      nom: 'Ndiaye',
      prenom: 'Fatou',
      matricule: 'AG-2024-002',
      zone: 'Almadies',
      email: 'fatou.ndiaye@vision-ia.sn',
      tel: '+221 77 234 56 78',
      statut: 'Actif',
      dateEntree: '20/01/2024'
    },
    {
      id: 3,
      nom: 'Fall',
      prenom: 'Ousmane',
      matricule: 'AG-2024-003',
      zone: 'Point E',
      email: 'ousmane.fall@vision-ia.sn',
      tel: '+221 77 345 67 89',
      statut: 'Actif',
      dateEntree: '05/02/2024'
    },
    {
      id: 4,
      nom: 'Seck',
      prenom: 'Aïssatou',
      matricule: 'AG-2024-004',
      zone: 'Ouest Foire',
      email: 'aissatou.seck@vision-ia.sn',
      tel: '+221 77 456 78 90',
      statut: 'En pause',
      dateEntree: '10/02/2024'
    },
    {
      id: 5,
      nom: 'Ba',
      prenom: 'Abdoulaye',
      matricule: 'AG-2024-005',
      zone: 'Parcelles',
      email: 'abdoulaye.ba@vision-ia.sn',
      tel: '+221 77 567 89 01',
      statut: 'Inactif',
      dateEntree: '15/02/2024'
    },
    {
      id: 6,
      nom: 'Sy',
      prenom: 'Mariama',
      matricule: 'AG-2024-006',
      zone: 'Pikine',
      email: 'mariama.sy@vision-ia.sn',
      tel: '+221 77 678 90 12',
      statut: 'Actif',
      dateEntree: '01/03/2024'
    },
    {
      id: 7,
      nom: 'Sall',
      prenom: 'Ibrahima',
      matricule: 'AG-2024-007',
      zone: 'Guédiawaye',
      email: 'ibrahima.sall@vision-ia.sn',
      tel: '+221 77 789 01 23',
      statut: 'Actif',
      dateEntree: '10/03/2024'
    },
    {
      id: 8,
      nom: 'Kane',
      prenom: 'Ndèye',
      matricule: 'AG-2024-008',
      zone: 'Liberté 6',
      email: 'ndeye.kane@vision-ia.sn',
      tel: '+221 77 890 12 34',
      statut: 'Actif',
      dateEntree: '15/03/2024'
    },
  ];

  return agents.find(a => a.id === parseInt(id)) || null;
};

export default function EditAgentPage() {
  const params = useParams();
  const router = useRouter();
  const agent = getMockAgent(params.id as string);

  const [formData, setFormData] = useState({
    nom: agent?.nom || '',
    prenom: agent?.prenom || '',
    matricule: agent?.matricule || '',
    zone: agent?.zone || '',
    email: agent?.email || '',
    tel: agent?.tel || '',
    statut: (agent?.statut || 'Actif') as 'Actif' | 'Inactif' | 'En pause',
    dateEntree: agent?.dateEntree || ''
  });

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent introuvable</h1>
            <p className="text-gray-600 mb-6">L'agent demandé n'existe pas ou a été supprimé.</p>
            <button
              onClick={() => router.push('/authorities/agents')}
              className="px-6 py-3 bg-[#3d5a5c] text-white rounded-xl hover:bg-[#2d4a4c] transition-colors font-medium"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter la mise à jour de l'agent via API
    console.log('Mise à jour de l\'agent:', agent.id, formData);
    alert(`Agent ${formData.prenom} ${formData.nom} modifié avec succès !`);
    router.push('/authorities/agents');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/authorities/agents')}
          className="flex items-center text-[#3d5a5c] hover:text-[#2d4a4c] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Retour à la liste</span>
        </button>
        <h1 className="text-3xl font-bold text-[#3d5a5c]">Modifier l'agent</h1>
        <p className="text-gray-600 mt-1">
          Modification de l'agent {agent.prenom} {agent.nom} ({agent.matricule})
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-4xl">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Prénom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                placeholder="Ex: Mamadou"
              />
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                placeholder="Ex: Diop"
              />
            </div>

            {/* Matricule */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Matricule <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="matricule"
                value={formData.matricule}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                placeholder="Ex: AG-2024-001"
              />
            </div>

            {/* Zone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zone d'affectation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zone"
                value={formData.zone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                placeholder="Ex: Dakar Plateau"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                placeholder="Ex: agent@vision-ia.sn"
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="tel"
                value={formData.tel}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                placeholder="Ex: +221 77 123 45 67"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut <span className="text-red-500">*</span>
              </label>
              <CustomSelect
                value={formData.statut}
                onChange={(value) => setFormData({ ...formData, statut: value as 'Actif' | 'Inactif' | 'En pause' })}
                options={[
                  { value: 'Actif', label: 'Actif' },
                  { value: 'Inactif', label: 'Inactif' },
                  { value: 'En pause', label: 'En pause' }
                ]}
                placeholder="Sélectionner un statut"
              />
            </div>

            {/* Date d'entrée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'entrée
              </label>
              <input
                type="text"
                name="dateEntree"
                value={formData.dateEntree}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push('/authorities/agents')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#3d5a5c] hover:bg-[#2d4a4c] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

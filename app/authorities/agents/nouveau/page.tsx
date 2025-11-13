'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import CustomSelect from '@/app/components/ui/CustomSelect';

export default function NewAgentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    matricule: '',
    zone: '',
    email: '',
    tel: '',
    statut: 'Actif' as 'Actif' | 'Inactif' | 'En pause',
    dateEntree: new Date().toLocaleDateString('fr-FR')
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'ajout de l'agent via API
    console.log('Ajout d\'un nouvel agent:', formData);
    alert(`Agent ${formData.prenom} ${formData.nom} ajouté avec succès !`);
    router.push('/authorities/agents');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/authorities/agents')}
          className="flex items-center text-[#00124c] hover:text-[#2d4a4c] mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">Retour à la liste</span>
        </button>
        <h1 className="text-3xl font-bold text-[#00124c]">Nouvel Agent</h1>
        <p className="text-gray-600 mt-1">Ajoutez un nouveau agent au système</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
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
              className="px-6 py-2.5 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Ajouter l'agent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

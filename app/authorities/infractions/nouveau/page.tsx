'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, CreditCard, FileText, Camera, Upload, Save, X } from 'lucide-react';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const CustomSelect = ({ value, onChange, options, placeholder, label }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt: any) => opt.value === value);

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c] flex items-center justify-between hover:border-gray-400 transition-colors"
        >
          <span className={!value ? 'text-gray-400' : 'text-gray-900'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute z-40 w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-xl max-h-60 overflow-auto">
              {options.map((option: any) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function NewInfractionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: '',
    heure: '',
    type: '',
    lieu: '',
    plaque: '',
    montant: '',
    statut: 'En attente',
    agent: '',
    source: 'Agent',
    description: ''
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string]);
        setPhotoFiles(prev => [...prev, file]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.date || !formData.heure || !formData.type || !formData.lieu || !formData.plaque || !formData.montant) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // TODO: Envoyer les données au backend
    console.log('Form data:', formData);
    console.log('Photos:', photoFiles);

    // Rediriger vers la liste des infractions
    router.push('/authorities/infractions');
  };

  const typeOptions = [
    { value: 'exces-vitesse', label: 'Excès de vitesse' },
    { value: 'stationnement', label: 'Stationnement interdit' },
    { value: 'feu-rouge', label: 'Feu rouge grillé' },
    { value: 'telephone', label: 'Téléphone au volant' },
    { value: 'ceinture', label: 'Non port de ceinture' },
    { value: 'sens-interdit', label: 'Sens interdit' },
    { value: 'autre', label: 'Autre' }
  ];

  const statutOptions = [
    { value: 'En attente', label: 'En attente' },
    { value: 'Payé', label: 'Payé' },
    { value: 'Relance', label: 'Relance' }
  ];

  const sourceOptions = [
    { value: 'Agent', label: 'Agent de terrain' },
    { value: 'VisionIA', label: 'VisionIA - Caméra' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/authorities/infractions')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#00124c] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour à la liste</span>
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Nouvelle infraction
              </h1>
              <p className="text-gray-600">Enregistrer une nouvelle infraction au code de la route</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Informations principales */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informations principales</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Heure <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="time"
                        required
                        value={formData.heure}
                        onChange={(e) => setFormData({ ...formData, heure: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <CustomSelect
                      label={<>Type d'infraction <span className="text-red-500">*</span></>}
                      value={formData.type}
                      onChange={(value: string) => setFormData({ ...formData, type: value })}
                      options={typeOptions}
                      placeholder="Sélectionner le type d'infraction"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Lieu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.lieu}
                        onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                        placeholder="Ex: Dakar Plateau"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Plaque d'immatriculation <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.plaque}
                        onChange={(e) => setFormData({ ...formData, plaque: e.target.value.toUpperCase() })}
                        placeholder="Ex: DK-1234-AB"
                        className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c] uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Montant (FCFA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.montant}
                      onChange={(e) => setFormData({ ...formData, montant: e.target.value })}
                      placeholder="Ex: 25000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Agent <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.agent}
                      onChange={(e) => setFormData({ ...formData, agent: e.target.value })}
                      placeholder="Ex: Agent Diop"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (optionnel)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Détails supplémentaires sur l'infraction..."
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00124c] focus:border-[#00124c] resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-6">
                  <Camera className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-bold text-gray-900">Photos</h2>
                  <span className="text-sm text-gray-500">({photos.length})</span>
                </div>

                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#00124c] hover:bg-gray-50 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Cliquer pour ajouter</span> ou glisser-déposer
                      </p>
                      <p className="text-xs text-gray-400">PNG, JPG ou JPEG (MAX. 5MB)</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                    />
                  </label>

                  {photos.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Source */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Configuration</h2>

                <div className="space-y-6">
                  <CustomSelect
                    label="Statut"
                    value={formData.statut}
                    onChange={(value: string) => setFormData({ ...formData, statut: value })}
                    options={statutOptions}
                    placeholder="Sélectionner le statut"
                  />

                  <CustomSelect
                    label="Source"
                    value={formData.source}
                    onChange={(value: string) => setFormData({ ...formData, source: value })}
                    options={sourceOptions}
                    placeholder="Sélectionner la source"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
                <div className="space-y-3">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00124c] text-white rounded-xl hover:bg-[#2d4a4c] transition-colors font-medium"
                  >
                    <Save className="w-5 h-5" />
                    <span>Enregistrer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/authorities/infractions')}
                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Annuler
                  </button>
                </div>
              </div>

              {/* Help */}
              <div className="bg-blue-50 rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Aide</h3>
                <p className="text-sm text-blue-800">
                  Les champs marqués d'un astérisque (<span className="text-red-500">*</span>) sont obligatoires.
                  Assurez-vous d'ajouter au moins une photo pour documenter l'infraction.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

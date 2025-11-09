'use client';

import { useState } from 'react';
import CustomSelect from '@/app/components/ui/CustomSelect';

// Icon Components
const UserIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BellIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CogIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DownloadIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const RefreshIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ClipboardIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const LogoutIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BookOpenIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChatIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ExclamationIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CameraIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    updates: true
  });

  const [autoApproval, setAutoApproval] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Administrateur Système');
  const [selectedLanguage, setSelectedLanguage] = useState('Français');
  const [selectedTimezone, setSelectedTimezone] = useState('GMT+0 (Dakar)');
  const [selectedDateFormat, setSelectedDateFormat] = useState('DD/MM/YYYY');

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Configuration</h1>
        <p className="text-slate-600">Gérez vos paramètres de compte et préférences système</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <UserIcon className="w-6 h-6 text-[#d4a574]" />
              <h2 className="text-xl font-bold text-slate-800">Paramètres du Profil</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#d4a574] to-[#c49564] rounded-full flex items-center justify-center shadow-lg">
                  <UserIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors text-sm mr-2 flex items-center space-x-2">
                    <CameraIcon className="w-4 h-4" />
                    <span>Changer la Photo</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    defaultValue="Mamadou"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    defaultValue="Diop"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Adresse Email
                </label>
                <input
                  type="email"
                  defaultValue="mamadou.diop@visionia.sn"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Numéro de Téléphone
                </label>
                <input
                  type="tel"
                  defaultValue="+221 77 123 45 67"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Rôle
                </label>
                <CustomSelect
                  value={selectedRole}
                  onChange={setSelectedRole}
                  options={[
                    { value: 'Administrateur Système', label: 'Administrateur Système' },
                    { value: 'Gestionnaire d\'Autorité', label: 'Gestionnaire d\'Autorité' },
                    { value: 'Superviseur', label: 'Superviseur' },
                    { value: 'Analyste', label: 'Analyste' }
                  ]}
                  placeholder="Sélectionner un rôle"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <BellIcon className="w-6 h-6 text-[#d4a574]" />
              <h2 className="text-xl font-bold text-slate-800">Préférences de Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: 'email', label: 'Notifications Email', desc: 'Recevoir les mises à jour par email' },
                { key: 'push', label: 'Notifications Push', desc: 'Notifications navigateur et application' },
                { key: 'sms', label: 'Alertes SMS', desc: 'Alertes importantes par SMS' },
                { key: 'updates', label: 'Mises à Jour Système', desc: 'Informations sur les nouvelles fonctionnalités' }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-800">{item.label}</p>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  <button
                    onClick={() => setNotifications({
                      ...notifications,
                      [item.key]: !notifications[item.key as keyof typeof notifications]
                    })}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      notifications[item.key as keyof typeof notifications]
                        ? 'bg-[#d4a574]'
                        : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      notifications[item.key as keyof typeof notifications]
                        ? 'left-8'
                        : 'left-1'
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* System Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <CogIcon className="w-6 h-6 text-[#d4a574]" />
              <h2 className="text-xl font-bold text-slate-800">Paramètres Système</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="font-semibold text-slate-800">Approbation Automatique</p>
                  <p className="text-sm text-slate-600">Approuver automatiquement les cas à faible risque</p>
                </div>
                <button
                  onClick={() => setAutoApproval(!autoApproval)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    autoApproval ? 'bg-[#d4a574]' : 'bg-slate-300'
                  }`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    autoApproval ? 'left-8' : 'left-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Langue par Défaut
                </label>
                <CustomSelect
                  value={selectedLanguage}
                  onChange={setSelectedLanguage}
                  options={[
                    { value: 'Français', label: 'Français' },
                    { value: 'Wolof', label: 'Wolof' },
                    { value: 'English', label: 'English' },
                    { value: 'Arabe', label: 'Arabe' }
                  ]}
                  placeholder="Sélectionner une langue"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fuseau Horaire
                </label>
                <CustomSelect
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                  options={[
                    { value: 'GMT+0 (Dakar)', label: 'GMT+0 (Dakar)' },
                    { value: 'GMT+1 (Paris)', label: 'GMT+1 (Paris)' },
                    { value: 'GMT-5 (New York)', label: 'GMT-5 (New York)' },
                    { value: 'GMT+3 (Nairobi)', label: 'GMT+3 (Nairobi)' }
                  ]}
                  placeholder="Sélectionner un fuseau horaire"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Format de Date
                </label>
                <CustomSelect
                  value={selectedDateFormat}
                  onChange={setSelectedDateFormat}
                  options={[
                    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
                  ]}
                  placeholder="Sélectionner un format"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ShieldIcon className="w-6 h-6 text-[#d4a574]" />
              <h2 className="text-xl font-bold text-slate-800">Sécurité</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Mot de Passe Actuel
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                  placeholder="Entrez le mot de passe actuel"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nouveau Mot de Passe
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                  placeholder="Entrez le nouveau mot de passe"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirmer le Mot de Passe
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                  placeholder="Confirmez le nouveau mot de passe"
                />
              </div>
              <button className="w-full px-6 py-3 bg-[#3d5a5c] text-white rounded-xl font-semibold hover:bg-[#2d4a4c] transition-colors">
                Mettre à Jour le Mot de Passe
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Account Info */}
          <div className="bg-gradient-to-br from-[#3d5a5c] to-[#2d4a4c] rounded-2xl shadow-xl p-6 text-white">
            <h3 className="text-lg font-bold mb-4">Statut du Compte</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Plan</span>
                <span className="font-semibold">Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Membre Depuis</span>
                <span className="font-semibold">Janvier 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-300">Statut</span>
                <span className="px-3 py-1 bg-[#d4a574] rounded-full text-xs font-semibold flex items-center space-x-1">
                  <CheckCircleIcon className="w-3 h-3" />
                  <span>Actif</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Actions Rapides</h3>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors text-left flex items-center space-x-3">
                <DownloadIcon className="w-5 h-5 text-slate-600" />
                <span>Exporter les Données</span>
              </button>
              <button className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors text-left flex items-center space-x-3">
                <RefreshIcon className="w-5 h-5 text-slate-600" />
                <span>Synchroniser</span>
              </button>
              <button className="w-full px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors text-left flex items-center space-x-3">
                <ClipboardIcon className="w-5 h-5 text-slate-600" />
                <span>Journal d'Activité</span>
              </button>
              <button className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-semibold transition-colors text-left flex items-center space-x-3">
                <LogoutIcon className="w-5 h-5" />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Aide & Support</h3>
            <div className="space-y-3">
              <a href="#" className="flex items-center space-x-3 text-sm text-slate-600 hover:text-[#d4a574] transition-colors p-2 rounded-lg hover:bg-slate-50">
                <BookOpenIcon className="w-5 h-5" />
                <span>Documentation</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-sm text-slate-600 hover:text-[#d4a574] transition-colors p-2 rounded-lg hover:bg-slate-50">
                <ChatIcon className="w-5 h-5" />
                <span>Contacter le Support</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-sm text-slate-600 hover:text-[#d4a574] transition-colors p-2 rounded-lg hover:bg-slate-50">
                <ExclamationIcon className="w-5 h-5" />
                <span>Signaler un Bug</span>
              </a>
              <a href="#" className="flex items-center space-x-3 text-sm text-slate-600 hover:text-[#d4a574] transition-colors p-2 rounded-lg hover:bg-slate-50">
                <InfoIcon className="w-5 h-5" />
                <span>À Propos</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end space-x-4">
        <button className="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
          Annuler
        </button>
        <button className="px-8 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49564] hover:from-[#c49564] hover:to-[#b48554] text-white rounded-xl font-semibold transition-all shadow-lg">
          Enregistrer les Modifications
        </button>
      </div>
    </div>
  );
}

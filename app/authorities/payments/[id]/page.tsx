'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Smartphone, CheckCircle } from 'lucide-react';
import { PAYMENTS, INFRACTIONS, AGENTS } from '@/app/data/mockData';

interface Payment {
  id: string;
  date: string;
  heure: string;
  plaque: string;
  type: string;
  montant: number;
  mode: 'Wave' | 'Orange Money' | 'Free Money';
  referenceInfraction: string;
  referenceTransaction: string;
  agent: string;
}

// Fonction pour récupérer un paiement par son ID
const getMockPayment = (id: string): Payment | null => {
  const pay = PAYMENTS.find(p => p.id === id);

  if (!pay) return null;

  // Trouver l'infraction associée pour récupérer les détails
  const infraction = INFRACTIONS.find(i => i.id === pay.referenceInfraction);

  if (!infraction) return null;

  // Trouver l'agent si l'infraction a un agentId
  const agent = infraction.agentId ? AGENTS.find(a => a.id === infraction.agentId) : null;

  return {
    id: pay.id,
    date: pay.date,
    heure: pay.heure,
    plaque: infraction.plaque,
    type: infraction.type,
    montant: pay.montant,
    mode: pay.mode,
    referenceInfraction: pay.referenceInfraction,
    referenceTransaction: pay.referenceTransaction,
    agent: agent ? `${agent.prenom} ${agent.nom}` : infraction.source
  };
};

const getModeIcon = (mode: string) => {
  return <Smartphone className="w-5 h-5" />;
};

export default function PaymentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const payment = getMockPayment(params.id as string);

  if (!payment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paiement introuvable</h1>
          <p className="text-gray-600 mb-6">Le paiement demandé n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => router.push('/authorities/payments')}
            className="px-6 py-3 bg-[#00124c] text-white rounded-xl hover:bg-[#2d4a4c] transition-colors font-medium"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/authorities/payments')}
          className="flex items-center text-[#00124c] hover:text-[#2d4a4c] mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Retour à la liste</span>
        </button>
        <h1 className="text-3xl font-bold text-[#00124c]">Détails du Paiement</h1>
      </div>

      {/* Payment Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-[#00124c] mb-2">Paiement #{payment.id}</h2>
            <p className="text-xl text-gray-600">{payment.type}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {payment.date}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {payment.heure}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Plaque d'immatriculation</div>
            <div className="text-2xl font-bold text-gray-900">{payment.plaque}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Montant</div>
            <div className="text-2xl font-bold text-green-600">
              {payment.montant.toLocaleString()} FCFA
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Statut</div>
            <div className="text-lg font-bold flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              Payé
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations du paiement */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Informations du paiement
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-40">ID Paiement:</span>
              <span className="text-sm font-medium text-gray-900 font-mono">{payment.id}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-40">Référence Infraction:</span>
              <span className="text-sm font-medium text-gray-900 font-mono">{payment.referenceInfraction}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-40">Référence Transaction:</span>
              <span className="text-sm font-medium text-gray-900 font-mono">{payment.referenceTransaction}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-40">Mode de paiement:</span>
              <span className="text-sm font-medium text-gray-900">{payment.mode}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-40">Date:</span>
              <span className="text-sm font-medium text-gray-900">{payment.date}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-40">Heure:</span>
              <span className="text-sm font-medium text-gray-900">{payment.heure}</span>
            </div>
          </div>
        </div>

        {/* Source du paiement */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Infraction associée
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Type:</span>
              <span className="text-sm font-medium text-gray-900">{payment.type}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Plaque:</span>
              <span className="text-sm font-medium text-gray-900">{payment.plaque}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Agent:</span>
              <span className="text-sm font-medium text-gray-900">{payment.agent}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

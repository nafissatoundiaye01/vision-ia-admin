'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, FileText, Smartphone, CheckCircle } from 'lucide-react';

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

// Mock data - À remplacer par un appel API
const getMockPayment = (id: string): Payment | null => {
  const payments: Payment[] = [
    { id: 'PAY-2024-001247', date: '06/11/2024', heure: '14:35', plaque: 'DK-1234-AB', type: 'Excès de vitesse', montant: 25000, mode: 'Wave', referenceInfraction: 'INF-2024-001247', referenceTransaction: 'WAVE-789456123', agent: 'Agent Diop' },
    { id: 'PAY-2024-001246', date: '06/11/2024', heure: '14:22', plaque: 'TH-5678-CD', type: 'Stationnement interdit', montant: 15000, mode: 'Orange Money', referenceInfraction: 'INF-2024-001246', referenceTransaction: 'OM-456789012', agent: 'VisionIA - Caméra 12' },
    { id: 'PAY-2024-001244', date: '06/11/2024', heure: '12:45', plaque: 'RU-3456-GH', type: 'Téléphone au volant', montant: 20000, mode: 'Free Money', referenceInfraction: 'INF-2024-001244', referenceTransaction: 'FM-001244', agent: 'Agent Diop' },
    { id: 'PAY-2024-001241', date: '05/11/2024', heure: '11:30', plaque: 'DK-6789-MN', type: 'Excès de vitesse', montant: 25000, mode: 'Wave', referenceInfraction: 'INF-2024-001241', referenceTransaction: 'WAVE-123789456', agent: 'VisionIA - Caméra 08' },
    { id: 'PAY-2024-001240', date: '04/11/2024', heure: '17:45', plaque: 'RU-0123-OP', type: 'Stationnement interdit', montant: 15000, mode: 'Orange Money', referenceInfraction: 'INF-2024-001240', referenceTransaction: 'OM-789012345', agent: 'Agent Seck' },
    { id: 'PAY-2024-001238', date: '04/11/2024', heure: '10:15', plaque: 'TH-8901-ST', type: 'Stationnement interdit', montant: 15000, mode: 'Wave', referenceInfraction: 'INF-2024-001238', referenceTransaction: 'WAVE-456123789', agent: 'VisionIA - Caméra 12' },
    { id: 'PAY-2024-001237', date: '03/11/2024', heure: '16:50', plaque: 'DK-2345-UV', type: 'Téléphone au volant', montant: 20000, mode: 'Free Money', referenceInfraction: 'INF-2024-001237', referenceTransaction: 'FM-001237', agent: 'Agent Fall' },
    { id: 'PAY-2024-001235', date: '03/11/2024', heure: '09:20', plaque: 'DK-5678-YZ', type: 'Excès de vitesse', montant: 25000, mode: 'Wave', referenceInfraction: 'INF-2024-001235', referenceTransaction: 'WAVE-234567890', agent: 'Agent Ndiaye' },
    { id: 'PAY-2024-001234', date: '02/11/2024', heure: '15:30', plaque: 'TH-9012-AA', type: 'Feu rouge grillé', montant: 35000, mode: 'Orange Money', referenceInfraction: 'INF-2024-001234', referenceTransaction: 'OM-345678901', agent: 'VisionIA - Caméra 05' },
    { id: 'PAY-2024-001233', date: '02/11/2024', heure: '11:15', plaque: 'RU-3456-BB', type: 'Ceinture non attachée', montant: 10000, mode: 'Free Money', referenceInfraction: 'INF-2024-001233', referenceTransaction: 'FM-001233', agent: 'Agent Fall' },
  ];

  return payments.find(p => p.id === id) || null;
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
      <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Paiement introuvable</h1>
            <p className="text-gray-600 mb-6">Le paiement demandé n'existe pas.</p>
            <button
              onClick={() => router.push('/authorities/payments')}
              className="px-6 py-3 bg-[#3d5a5c] text-white rounded-xl hover:bg-[#2d4a4c] transition-colors font-medium"
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.push('/authorities/payments')}
            className="flex items-center text-[#3d5a5c] hover:text-[#2d4a4c] mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium">Retour aux paiements</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#3d5a5c]">Détails du Paiement</h1>
              <p className="text-gray-600 mt-1">Paiement effectué le {payment.date} à {payment.heure}</p>
            </div>
          </div>
        </div>

        {/* Badge Payé */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-800">Statut du paiement</div>
              <div className="text-2xl font-bold text-green-900">Payé</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* ID Paiement */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations du Paiement</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">ID Paiement</span>
                  <span className="font-mono font-bold text-gray-900">{payment.id}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Référence Infraction</span>
                  <span className="font-mono font-bold text-[#3d5a5c]">{payment.referenceInfraction}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Référence Transaction</span>
                  <span className="font-mono text-sm font-semibold text-gray-900">{payment.referenceTransaction}</span>
                </div>
              </div>
            </div>

            {/* Infraction Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Détails de l'Infraction</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 mb-2">Date & Heure</div>
                  <div className="flex items-center gap-2 text-base font-semibold text-gray-900">
                    <Calendar className="w-5 h-5 text-[#3d5a5c]" />
                    {payment.date}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{payment.heure}</div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-xs font-medium text-gray-500 mb-2">Plaque d'immatriculation</div>
                  <div className="text-lg font-mono font-bold text-gray-900 bg-white px-3 py-2 rounded-lg inline-block">
                    {payment.plaque}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
                  <div className="text-xs font-medium text-gray-500 mb-2">Type d'infraction</div>
                  <div className="text-base font-semibold text-gray-900">{payment.type}</div>
                </div>
              </div>
            </div>

            {/* Agent/Source */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Source</h2>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                <div className="w-10 h-10 bg-[#3d5a5c] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Enregistré par</div>
                  <div className="text-base font-semibold text-gray-900">{payment.agent}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Info */}
          <div className="space-y-6">
            {/* Montant */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
              <div className="text-sm font-medium text-green-700 mb-2">Montant payé</div>
              <div className="text-4xl font-bold text-green-900 mb-1">
                {payment.montant.toLocaleString()}
              </div>
              <div className="text-base font-medium text-green-700">FCFA</div>
            </div>

            {/* Mode de Paiement */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Mode de Paiement</h2>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
                {getModeIcon(payment.mode)}
                <div>
                  <div className="text-xs text-gray-500">Méthode utilisée</div>
                  <div className="text-base font-semibold text-gray-900">{payment.mode}</div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Historique</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <div className="font-semibold text-gray-900">Paiement effectué</div>
                    <div className="text-sm text-gray-600">{payment.date} à {payment.heure}</div>
                    <div className="text-xs text-gray-500 mt-1">via {payment.mode}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-[#3d5a5c]/10 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#3d5a5c]" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Infraction enregistrée</div>
                    <div className="text-sm text-gray-600">Par {payment.agent}</div>
                    <div className="text-xs text-gray-500 mt-1">Réf: {payment.referenceInfraction}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

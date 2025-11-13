'use client';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, Clock, Eye, CheckCircle, XCircle, AlertCircle, Printer, Mail } from 'lucide-react';
import { useState } from 'react';
import { INFRACTIONS, AGENTS } from '@/app/data/mockData';

interface Infraction {
  id: string;
  date: string;
  heure: string;
  type: string;
  lieu: string;
  plaque: string;
  montant: string;
  statut: 'Payé' | 'En attente' | 'Relance';
  agent: string;
  source: 'Agent' | 'VisionIA';
  description?: string;
  photos?: string[];
}

// Fonction pour récupérer une infraction par son ID
const getMockInfraction = (id: string): Infraction | null => {
  const inf = INFRACTIONS.find(i => i.id === id);

  if (!inf) return null;

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
};

export default function InfractionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const infraction = getMockInfraction(params.id as string);

  if (!infraction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Infraction introuvable</h1>
          <p className="text-gray-600 mb-6">L'infraction demandée n'existe pas ou a été supprimée.</p>
          <button
            onClick={() => router.push('/authorities/infractions')}
            className="px-6 py-3 bg-[#00124c] text-white rounded-xl hover:bg-[#2d4a4c] transition-colors font-medium"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'Payé': return 'bg-green-100 text-green-800 border-green-300';
      case 'En attente': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Relance': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'Payé': return <CheckCircle className="w-5 h-5" />;
      case 'En attente': return <Clock className="w-5 h-5" />;
      case 'Relance': return <AlertCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  // Fonction pour convertir un nombre en mots (français)
  const numberToWords = (num: number): string => {
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
    const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];

    if (num === 0) return 'zéro';
    if (num < 10) return units[num];
    if (num < 20) return teens[num - 10];
    if (num < 100) {
      const ten = Math.floor(num / 10);
      const unit = num % 10;
      if (ten === 7 || ten === 9) {
        return tens[ten - 1] + '-' + teens[unit];
      }
      if (ten === 8 && unit === 0) {
        return 'quatre-vingts';
      }
      return tens[ten] + (unit ? '-' + units[unit] : '');
    }
    if (num < 1000) {
      const hundred = Math.floor(num / 100);
      const rest = num % 100;
      if (hundred === 1) {
        return 'cent' + (rest ? ' ' + numberToWords(rest) : '');
      }
      return units[hundred] + ' cent' + (rest ? ' ' + numberToWords(rest) : hundred > 1 && rest === 0 ? 's' : '');
    }
    if (num < 1000000) {
      const thousand = Math.floor(num / 1000);
      const rest = num % 1000;
      if (thousand === 1) {
        return 'mille' + (rest ? ' ' + numberToWords(rest) : '');
      }
      return numberToWords(thousand) + ' mille' + (rest ? ' ' + numberToWords(rest) : '');
    }
    return num.toLocaleString('fr-FR');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const montantEnLettres = numberToWords(parseInt(infraction.montant));

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>PV Infraction ${infraction.id}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          @page {
            size: A4;
            margin: 0;
          }

          body {
            font-family: 'Courier New', monospace;
            background: white;
            padding: 20px;
            color: #000;
          }

          .receipt {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border: 3px solid #000;
            padding: 30px;
          }

          .header {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }

          .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 5px;
            letter-spacing: 2px;
          }

          .header p {
            font-size: 12px;
            margin: 3px 0;
          }

          .pv-title {
            text-align: center;
            background: #000;
            color: #fff;
            padding: 15px;
            margin: 20px 0;
            font-size: 20px;
            font-weight: bold;
            letter-spacing: 3px;
          }

          .section {
            margin: 25px 0;
            border: 2px solid #000;
            padding: 15px;
          }

          .section-title {
            background: #000;
            color: #fff;
            padding: 8px 12px;
            margin: -15px -15px 15px -15px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #000;
          }

          .info-row:last-child {
            border-bottom: none;
          }

          .info-label {
            font-weight: bold;
            text-transform: uppercase;
            font-size: 12px;
          }

          .info-value {
            font-size: 14px;
            font-weight: bold;
            text-align: right;
          }

          .amount-box {
            background: #f5f5f5;
            border: 3px double #000;
            padding: 20px;
            margin: 25px 0;
            text-align: center;
          }

          .amount-label {
            font-size: 14px;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .amount-value {
            font-size: 36px;
            font-weight: bold;
            margin: 10px 0;
          }

          .amount-words {
            font-size: 12px;
            font-style: italic;
            margin-top: 10px;
          }

          .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border: 2px solid #000;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .status-paye {
            background: #d4edda;
            color: #155724;
          }

          .status-attente {
            background: #fff3cd;
            color: #856404;
          }

          .status-relance {
            background: #f8d7da;
            color: #721c24;
          }

          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 3px double #000;
            text-align: center;
          }

          .footer-info {
            font-size: 10px;
            margin: 5px 0;
          }

          .signature-section {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }

          .signature-box {
            width: 45%;
            text-align: center;
          }

          .signature-line {
            border-top: 2px solid #000;
            margin-top: 60px;
            padding-top: 10px;
            font-size: 12px;
          }

          .qr-placeholder {
            width: 120px;
            height: 120px;
            border: 2px solid #000;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            background: #f5f5f5;
          }

          .barcode {
            text-align: center;
            margin: 20px 0;
            font-size: 24px;
            letter-spacing: 8px;
            font-weight: bold;
            border: 2px solid #000;
            padding: 10px;
            background: #fff;
          }

          @media print {
            body {
              padding: 0;
            }

            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <!-- Header -->
          <div class="header">
            <h1>RÉPUBLIQUE DU SÉNÉGAL</h1>
            <p>MINISTÈRE DE L'INTÉRIEUR</p>
            <p>Direction de la Police Routière</p>
            <p>────────────────────</p>
          </div>

          <!-- Title -->
          <div class="pv-title">
            PROCÈS-VERBAL D'INFRACTION
          </div>

          <!-- Barcode -->
          <div class="barcode">
            ${infraction.id.replace(/-/g, '')}
          </div>

          <!-- Infraction Details -->
          <div class="section">
            <div class="section-title">📋 Informations de l'infraction</div>
            <div class="info-row">
              <span class="info-label">N° PV:</span>
              <span class="info-value">${infraction.id}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">${infraction.date}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Heure:</span>
              <span class="info-value">${infraction.heure}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Type d'infraction:</span>
              <span class="info-value">${infraction.type}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Lieu:</span>
              <span class="info-value">${infraction.lieu}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Statut:</span>
              <span class="info-value">
                <span class="status-badge status-${infraction.statut === 'Payé' ? 'paye' : infraction.statut === 'En attente' ? 'attente' : 'relance'}">
                  ${infraction.statut.toUpperCase()}
                </span>
              </span>
            </div>
          </div>

          <!-- Vehicle Info -->
          <div class="section">
            <div class="section-title">🚗 Informations du véhicule</div>
            <div class="info-row">
              <span class="info-label">Plaque d'immatriculation:</span>
              <span class="info-value" style="font-size: 18px; letter-spacing: 3px;">${infraction.plaque}</span>
            </div>
          </div>

          <!-- Agent Info -->
          <div class="section">
            <div class="section-title">👮 Agent verbalisateur</div>
            <div class="info-row">
              <span class="info-label">Agent:</span>
              <span class="info-value">${infraction.agent}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Source:</span>
              <span class="info-value">${infraction.source}</span>
            </div>
          </div>

          ${infraction.description ? `
          <div class="section">
            <div class="section-title">📝 Description</div>
            <p style="padding: 10px; line-height: 1.6;">${infraction.description}</p>
          </div>
          ` : ''}

          <!-- Amount -->
          <div class="amount-box">
            <div class="amount-label">Montant de l'amende</div>
            <div class="amount-value">${parseInt(infraction.montant).toLocaleString()} FCFA</div>
            <div class="amount-words">
              (${montantEnLettres} francs CFA)
            </div>
          </div>

          <!-- Payment Instructions -->
          <div class="section">
            <div class="section-title">💳 Instructions de paiement</div>
            <p style="padding: 10px; line-height: 1.8;">
              Le paiement de cette amende doit être effectué dans un délai de <strong>30 jours</strong>
              à compter de la date d'émission du présent procès-verbal.<br><br>

              <strong>Modes de paiement acceptés:</strong><br>
              • En ligne sur le portail: www.infractions.sn<br>
              • Mobile Money (Orange Money, Free Money, Wave)<br>
              • Auprès des bureaux de la Police Routière<br>
              • Dans les banques et points de paiement agréés
            </p>
          </div>

          <!-- Signatures -->
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">
                L'Agent verbalisateur
              </div>
            </div>
            <div class="signature-box">
              <div class="signature-line">
                Le Contrevenant
              </div>
            </div>
          </div>

          <!-- QR Code Placeholder -->
          <div style="margin-top: 30px;">
            <div class="qr-placeholder">
              <div>
                QR CODE<br>
                ${infraction.id}
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-info">
              Document officiel édité le ${currentDate}
            </div>
            <div class="footer-info">
              Ce document fait foi jusqu'à preuve du contraire
            </div>
            <div class="footer-info">
              Pour toute réclamation: contact@policenationale.sn | Tel: +221 33 XXX XX XX
            </div>
            <div class="footer-info" style="margin-top: 10px; font-weight: bold;">
              ────────────────────────────────────────
            </div>
            <div class="footer-info" style="margin-top: 5px;">
              PV N° ${infraction.id} - ${infraction.plaque}
            </div>
          </div>

          <!-- Print Button -->
          <div class="no-print" style="text-align: center; margin-top: 30px;">
            <button onclick="window.print()" style="
              background: #00124c;
              color: white;
              border: none;
              padding: 15px 40px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              border-radius: 8px;
              font-family: Arial, sans-serif;
            ">
              🖨️ Imprimer le PV
            </button>
            <button onclick="window.close()" style="
              background: #6c757d;
              color: white;
              border: none;
              padding: 15px 40px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              border-radius: 8px;
              margin-left: 10px;
              font-family: Arial, sans-serif;
            ">
              Fermer
            </button>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
  };

  const handleSendReminder = () => {
    // TODO: Implémenter l'envoi de relance
    alert('Relance envoyée avec succès !');
  };

  const handleMarkAsPaid = () => {
    // TODO: Implémenter le changement de statut
    alert('Infraction marquée comme payée !');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/authorities/infractions')}
          className="flex items-center text-[#00124c] hover:text-[#2d4a4c] mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Retour à la liste</span>
        </button>
        <h1 className="text-3xl font-bold text-[#00124c]">Détails de l'Infraction</h1>
      </div>

      {/* Infraction Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-[#00124c] mb-2">PV #{infraction.id}</h2>
            <p className="text-xl text-gray-600">{infraction.type}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {infraction.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {infraction.heure}
              </span>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#00124c] hover:bg-[#2d4a4c] text-white rounded-lg font-medium transition-all flex items-center"
          >
            <Printer className="w-5 h-5 mr-2" />
            Imprimer le PV
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Plaque d'immatriculation</div>
            <div className="text-2xl font-bold text-gray-900">{infraction.plaque}</div>
          </div>
          <div className={`rounded-lg p-4 ${
            infraction.statut === 'Payé' ? 'bg-green-50' :
            infraction.statut === 'En attente' ? 'bg-orange-50' : 'bg-red-50'
          }`}>
            <div className="text-sm text-gray-600 mb-1">Montant</div>
            <div className={`text-2xl font-bold ${
              infraction.statut === 'Payé' ? 'text-green-600' :
              infraction.statut === 'En attente' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {parseInt(infraction.montant).toLocaleString()} FCFA
            </div>
          </div>
          <div className={`rounded-lg p-4 ${
            infraction.statut === 'Payé' ? 'bg-green-50' :
            infraction.statut === 'En attente' ? 'bg-orange-50' : 'bg-red-50'
          }`}>
            <div className="text-sm text-gray-600 mb-1">Statut</div>
            <div className={`text-lg font-bold flex items-center gap-2 ${
              infraction.statut === 'Payé' ? 'text-green-600' :
              infraction.statut === 'En attente' ? 'text-orange-600' : 'text-red-600'
            }`}>
              {getStatusIcon(infraction.statut)}
              {infraction.statut}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations de l'infraction */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Informations de l'infraction
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Type:</span>
              <span className="text-sm font-medium text-gray-900">{infraction.type}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Lieu:</span>
              <span className="text-sm font-medium text-gray-900">{infraction.lieu}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Date:</span>
              <span className="text-sm font-medium text-gray-900">{infraction.date}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Heure:</span>
              <span className="text-sm font-medium text-gray-900">{infraction.heure}</span>
            </div>
            {infraction.description && (
              <div className="flex items-start">
                <span className="text-sm text-gray-600 w-32">Description:</span>
                <span className="text-sm font-medium text-gray-900">{infraction.description}</span>
              </div>
            )}
          </div>
        </div>

        {/* Agent verbalisateur */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Agent verbalisateur
          </h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Agent:</span>
              <span className="text-sm font-medium text-gray-900">{infraction.agent}</span>
            </div>
            <div className="flex items-start">
              <span className="text-sm text-gray-600 w-32">Source:</span>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                infraction.source === 'VisionIA'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {infraction.source}
              </span>
            </div>
          </div>
        </div>

        {/* Photos - Full Width */}
        {infraction.photos && infraction.photos.length > 0 && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Photos de l'infraction ({infraction.photos.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {infraction.photos.map((photo, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer overflow-hidden rounded-lg border-2 border-gray-200 hover:border-[#00124c] transition-all aspect-square"
                  onClick={() => setSelectedPhotoIndex(index)}
                >
                  <img
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-5 h-5 text-[#00124c]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions rapides */}
        {infraction.statut !== 'Payé' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-[#00124c] mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <button
                onClick={handleMarkAsPaid}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium border border-green-200"
              >
                <CheckCircle className="w-5 h-5" />
                Marquer comme payée
              </button>
              {infraction.statut === 'En attente' && (
                <button
                  onClick={handleSendReminder}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium border border-orange-200"
                >
                  <Mail className="w-5 h-5" />
                  Envoyer une relance
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhotoIndex !== null && infraction.photos && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhotoIndex(null)}
        >
          <button
            onClick={() => setSelectedPhotoIndex(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black/50 rounded-full p-2 hover:bg-black/70"
          >
            <span className="text-3xl leading-none">×</span>
          </button>
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={infraction.photos[selectedPhotoIndex]}
              alt={`Photo ${selectedPhotoIndex + 1}`}
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/75 backdrop-blur-sm px-6 py-3 rounded-full text-white flex items-center gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(prev => prev! > 0 ? prev! - 1 : infraction.photos!.length - 1);
                }}
                className="hover:text-[#00124c] transition-colors font-medium"
              >
                ← Précédent
              </button>
              <span className="text-sm">
                {selectedPhotoIndex + 1} / {infraction.photos.length}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedPhotoIndex(prev => prev! < infraction.photos!.length - 1 ? prev! + 1 : 0);
                }}
                className="hover:text-[#00124c] transition-colors font-medium"
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

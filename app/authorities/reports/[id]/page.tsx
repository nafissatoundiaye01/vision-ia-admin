'use client';

import { useRouter, useParams } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Icon Components
const ChartBarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrendingUpIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const DocumentIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const DownloadIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PrinterIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
  </svg>
);

interface Report {
  id: number;
  title: string;
  type: 'activity' | 'financial' | 'incident' | 'performance';
  authority: string;
  generatedBy: string;
  date: string;
  size: string;
  format: 'PDF' | 'Excel';
  status: 'completed' | 'processing' | 'failed';
}

export default function ReportPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id;

  // Mock data - in a real app, fetch based on reportId
  const mockReports: Report[] = [
    {
      id: 1,
      title: 'Rapport d\'Activité Mensuel - Juin 2024',
      type: 'activity',
      authority: 'Toutes les Autorités',
      generatedBy: 'Admin Système',
      date: '2024-06-30',
      size: '2.4 MB',
      format: 'PDF',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Analyse Budgétaire Q2 2024',
      type: 'financial',
      authority: 'Département des Finances',
      generatedBy: 'Jane Smith',
      date: '2024-06-28',
      size: '3.1 MB',
      format: 'Excel',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Résumé des Infractions - Semaine 26',
      type: 'incident',
      authority: 'Police de Dakar',
      generatedBy: 'John Doe',
      date: '2024-06-26',
      size: '1.8 MB',
      format: 'PDF',
      status: 'completed'
    },
    {
      id: 4,
      title: 'Métriques de Performance - Mai 2024',
      type: 'performance',
      authority: 'Toutes les Autorités',
      generatedBy: 'Système',
      date: '2024-06-25',
      size: '4.2 MB',
      format: 'PDF',
      status: 'processing'
    },
  ];

  const mockInfractions = [
    { id: 'INF-001', date: '2024-06-15', type: 'Excès de vitesse', agent: 'Agent Diop', montant: 15000, status: 'Payée' },
    { id: 'INF-002', date: '2024-06-16', type: 'Stationnement interdit', agent: 'Agent Ndiaye', montant: 5000, status: 'En attente' },
    { id: 'INF-003', date: '2024-06-17', type: 'Feu rouge grillé', agent: 'Agent Fall', montant: 20000, status: 'Payée' },
    { id: 'INF-004', date: '2024-06-18', type: 'Téléphone au volant', agent: 'Agent Sow', montant: 10000, status: 'Payée' },
    { id: 'INF-005', date: '2024-06-19', type: 'Excès de vitesse', agent: 'Agent Ba', montant: 15000, status: 'Annulée' },
  ];

  const selectedReport = mockReports.find(r => r.id === Number(reportId)) || mockReports[0];

  const handleDownload = () => {
    if (selectedReport.format === 'PDF') {
      const doc = new jsPDF();

      doc.setFillColor(30, 41, 59);
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text('VISION IA', 20, 20);

      doc.setFontSize(14);
      doc.text('Système de Gestion des Infractions', 20, 30);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(18);
      doc.text(selectedReport.title, 20, 55);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Généré le: ${selectedReport.date}`, 20, 65);
      doc.text(`Généré par: ${selectedReport.generatedBy}`, 20, 70);
      doc.text(`Autorité: ${selectedReport.authority}`, 20, 75);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Résumé Exécutif', 20, 90);

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      const summaryText = 'Ce rapport présente une analyse détaillée des activités pour la période sélectionnée. Les données ont été collectées et analysées automatiquement par le système Vision IA.';
      const splitSummary = doc.splitTextToSize(summaryText, 170);
      doc.text(splitSummary, 20, 100);

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Statistiques Clés', 20, 120);

      const stats = [
        ['Métrique', 'Valeur', 'Évolution'],
        ['Total Infractions', '1,247', '+12%'],
        ['Infractions Payées', '892', '+8%'],
        ['Montant Total', '18,705,000 FCFA', '+15%'],
        ['Taux de Paiement', '71.5%', '+3%'],
      ];

      autoTable(doc, {
        startY: 125,
        head: [stats[0]],
        body: stats.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [30, 41, 59], textColor: 255 },
        margin: { left: 20, right: 20 },
      });

      const finalY = (doc as any).lastAutoTable?.finalY || 165;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Détails des Infractions', 20, finalY + 10);

      const tableData = mockInfractions.map(inf => [
        inf.id,
        inf.date,
        inf.type,
        inf.agent,
        `${inf.montant.toLocaleString('fr-FR')} FCFA`,
        inf.status
      ]);

      autoTable(doc, {
        startY: finalY + 15,
        head: [['ID', 'Date', 'Type', 'Agent', 'Montant', 'Statut']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: 255 },
        margin: { left: 20, right: 20 },
        styles: { fontSize: 9 },
      });

      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i} sur ${pageCount} - Vision IA © 2024`, 105, 290, { align: 'center' });
      }

      doc.save(`${selectedReport.title}.pdf`);
    } else {
      const wb = XLSX.utils.book_new();

      const summaryData = [
        ['VISION IA - Système de Gestion des Infractions'],
        [selectedReport.title],
        [],
        ['Généré le:', selectedReport.date],
        ['Généré par:', selectedReport.generatedBy],
        ['Autorité:', selectedReport.authority],
        [],
        ['STATISTIQUES CLÉS'],
        ['Métrique', 'Valeur', 'Évolution'],
        ['Total Infractions', 1247, '+12%'],
        ['Infractions Payées', 892, '+8%'],
        ['Montant Total (FCFA)', 18705000, '+15%'],
        ['Taux de Paiement', '71.5%', '+3%'],
      ];

      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      wsSummary['!cols'] = [{ wch: 25 }, { wch: 20 }, { wch: 15 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Résumé');

      const detailData = [
        ['ID', 'Date', 'Type d\'Infraction', 'Agent', 'Montant (FCFA)', 'Statut'],
        ...mockInfractions.map(inf => [inf.id, inf.date, inf.type, inf.agent, inf.montant, inf.status])
      ];

      const wsDetails = XLSX.utils.aoa_to_sheet(detailData);
      wsDetails['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, wsDetails, 'Détails Infractions');

      XLSX.writeFile(wb, `${selectedReport.title}.xlsx`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 mb-4 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Retour aux rapports</span>
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Aperçu du Rapport</h1>
            <p className="text-slate-600">{selectedReport.title}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center space-x-2"
            >
              <PrinterIcon className="w-5 h-5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49564] hover:from-[#c49564] hover:to-[#b48554] text-white rounded-xl font-semibold transition-all shadow-lg flex items-center space-x-2"
            >
              <DownloadIcon className="w-5 h-5" />
              <span>Télécharger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Report Header */}
          <div className="mb-8 pb-6 border-b">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{selectedReport.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
              <div>
                <span className="font-semibold">Date:</span> {selectedReport.date}
              </div>
              <div>
                <span className="font-semibold">Généré par:</span> {selectedReport.generatedBy}
              </div>
              <div>
                <span className="font-semibold">Autorité:</span> {selectedReport.authority}
              </div>
            </div>
          </div>

          {/* Report Sections */}
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center space-x-2">
                <ChartBarIcon className="w-5 h-5 text-slate-600" />
                <span>Résumé Exécutif</span>
              </h3>
              <p className="text-slate-700 leading-relaxed">
                Ce rapport présente une analyse détaillée des activités pour la période sélectionnée.
                Les données ont été collectées automatiquement et incluent des métriques clés de performance,
                des tendances et des recommandations stratégiques pour améliorer l'efficacité opérationnelle.
              </p>
            </div>

            {/* Key Statistics */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <TrendingUpIcon className="w-5 h-5 text-slate-600" />
                <span>Statistiques Clés</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600">Total Infractions</p>
                  <p className="text-2xl font-bold text-slate-800">1,247</p>
                  <p className="text-sm text-slate-500 font-semibold">+12% vs période précédente</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600">Montant Total</p>
                  <p className="text-2xl font-bold text-slate-800">18.7M FCFA</p>
                  <p className="text-sm text-slate-500 font-semibold">+15% vs période précédente</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600">Taux de Paiement</p>
                  <p className="text-2xl font-bold text-slate-800">71.5%</p>
                  <p className="text-sm text-slate-500 font-semibold">+3% vs période précédente</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-slate-200">
                  <p className="text-sm text-slate-600">Infractions Payées</p>
                  <p className="text-2xl font-bold text-slate-800">892</p>
                  <p className="text-sm text-slate-500 font-semibold">+8% vs période précédente</p>
                </div>
              </div>
            </div>

            {/* Infractions Details */}
            <div className="bg-slate-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
                <DocumentIcon className="w-5 h-5 text-slate-600" />
                <span>Détails des Infractions</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left rounded-tl-lg">ID</th>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Agent</th>
                      <th className="px-4 py-3 text-left">Montant</th>
                      <th className="px-4 py-3 text-left rounded-tr-lg">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {mockInfractions.map((inf, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-sm">{inf.id}</td>
                        <td className="px-4 py-3">{inf.date}</td>
                        <td className="px-4 py-3">{inf.type}</td>
                        <td className="px-4 py-3">{inf.agent}</td>
                        <td className="px-4 py-3 font-semibold">{inf.montant.toLocaleString('fr-FR')} FCFA</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            inf.status === 'Payée' ? 'bg-green-100 text-green-800' :
                            inf.status === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {inf.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analysis & Recommendations */}
            <div className="bg-[#d4a574]/10 rounded-xl p-6 border-l-4 border-[#d4a574]">
              <h3 className="text-lg font-bold text-slate-800 mb-3">Recommandations</h3>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start space-x-2">
                  <span className="text-[#d4a574] font-bold">•</span>
                  <span>Augmenter les contrôles dans les zones à forte concentration d'infractions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#d4a574] font-bold">•</span>
                  <span>Améliorer le taux de recouvrement en facilitant les options de paiement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-[#d4a574] font-bold">•</span>
                  <span>Renforcer la communication avec les contrevenants pour réduire les retards</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t text-center text-sm text-slate-500">
            <p>Vision IA - Système de Gestion des Infractions © 2024</p>
            <p className="mt-1">Rapport généré automatiquement - Confidentiel</p>
          </div>
        </div>
      </div>
    </div>
  );
}

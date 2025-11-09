'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import CustomSelect from '@/app/components/ui/CustomSelect';

// Icon Components
const ChartBarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CurrencyIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface ReportTemplate {
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'activity' | 'financial' | 'incident' | 'performance';
}

interface GenerateReportForm {
  template: string;
  authority: string;
  dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  startDate: string;
  endDate: string;
  format: 'PDF' | 'Excel';
  includeCharts: boolean;
  includeDetails: boolean;
}

function GenerateReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      name: 'Rapport d\'Activité',
      description: 'Génère des rapports d\'activité complets',
      icon: 'chart',
      color: 'from-[#d4a574] to-[#c49564]',
      type: 'activity'
    },
    {
      name: 'Rapport Financier',
      description: 'Analyse du budget et des dépenses',
      icon: 'currency',
      color: 'from-[#d4a574] to-[#c49564]',
      type: 'financial'
    },
    {
      name: 'Rapport d\'Infractions',
      description: 'Documentation détaillée des infractions',
      icon: 'shield',
      color: 'from-[#d4a574] to-[#c49564]',
      type: 'incident'
    },
    {
      name: 'Rapport de Performance',
      description: 'Métriques de performance des autorités',
      icon: 'trending',
      color: 'from-[#d4a574] to-[#c49564]',
      type: 'performance'
    },
  ];

  const [reportForm, setReportForm] = useState<GenerateReportForm>({
    template: searchParams.get('type') || '',
    authority: 'all',
    dateRange: 'month',
    startDate: '',
    endDate: '',
    format: 'PDF',
    includeCharts: true,
    includeDetails: true,
  });

  const mockInfractions = [
    { id: 'INF-001', date: '2024-06-15', type: 'Excès de vitesse', agent: 'Agent Diop', montant: 15000, status: 'Payée' },
    { id: 'INF-002', date: '2024-06-16', type: 'Stationnement interdit', agent: 'Agent Ndiaye', montant: 5000, status: 'En attente' },
    { id: 'INF-003', date: '2024-06-17', type: 'Feu rouge grillé', agent: 'Agent Fall', montant: 20000, status: 'Payée' },
    { id: 'INF-004', date: '2024-06-18', type: 'Téléphone au volant', agent: 'Agent Sow', montant: 10000, status: 'Payée' },
    { id: 'INF-005', date: '2024-06-19', type: 'Excès de vitesse', agent: 'Agent Ba', montant: 15000, status: 'Annulée' },
  ];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'chart': return ChartBarIcon;
      case 'currency': return CurrencyIcon;
      case 'shield': return ShieldIcon;
      case 'trending': return TrendingUpIcon;
      default: return DocumentIcon;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'activity': return 'Activité';
      case 'financial': return 'Financier';
      case 'incident': return 'Infractions';
      case 'performance': return 'Performance';
      default: return type;
    }
  };

  const generatePDFReport = (templateType: string) => {
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
    doc.text(`Rapport ${getTypeLabel(templateType)}`, 20, 55);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 20, 65);
    doc.text(`Période: ${reportForm.dateRange}`, 20, 70);
    doc.text(`Autorité: ${reportForm.authority === 'all' ? 'Toutes les autorités' : reportForm.authority}`, 20, 75);

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Résumé Exécutif', 20, 90);

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    const summaryText = `Ce rapport présente une analyse ${getTypeLabel(templateType).toLowerCase()} pour la période sélectionnée. Les données ont été collectées et analysées automatiquement par le système Vision IA.`;
    const splitSummary = doc.splitTextToSize(summaryText, 170);
    doc.text(splitSummary, 20, 100);

    if (templateType === 'incident' || templateType === 'activity') {
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
    }

    if (reportForm.includeDetails) {
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
    }

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i} sur ${pageCount} - Vision IA © 2024`, 105, 290, { align: 'center' });
    }

    const fileName = `Rapport_${getTypeLabel(templateType)}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    return fileName;
  };

  const generateExcelReport = (templateType: string) => {
    const wb = XLSX.utils.book_new();

    const summaryData = [
      ['VISION IA - Système de Gestion des Infractions'],
      [`Rapport ${getTypeLabel(templateType)}`],
      [],
      ['Généré le:', new Date().toLocaleDateString('fr-FR')],
      ['Période:', reportForm.dateRange],
      ['Autorité:', reportForm.authority === 'all' ? 'Toutes les autorités' : reportForm.authority],
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

    if (reportForm.includeDetails) {
      const detailData = [
        ['ID', 'Date', 'Type d\'Infraction', 'Agent', 'Montant (FCFA)', 'Statut'],
        ...mockInfractions.map(inf => [inf.id, inf.date, inf.type, inf.agent, inf.montant, inf.status])
      ];

      const wsDetails = XLSX.utils.aoa_to_sheet(detailData);
      wsDetails['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 15 }, { wch: 12 }];
      XLSX.utils.book_append_sheet(wb, wsDetails, 'Détails Infractions');
    }

    if (reportForm.includeCharts) {
      const chartsData = [
        ['ANALYSE PAR TYPE D\'INFRACTION'],
        [],
        ['Type', 'Nombre', 'Montant Total (FCFA)'],
        ['Excès de vitesse', 450, 6750000],
        ['Stationnement interdit', 380, 1900000],
        ['Feu rouge grillé', 220, 4400000],
        ['Téléphone au volant', 197, 1970000],
        [],
        ['ANALYSE PAR STATUT'],
        [],
        ['Statut', 'Nombre', 'Pourcentage'],
        ['Payée', 892, '71.5%'],
        ['En attente', 298, '23.9%'],
        ['Annulée', 57, '4.6%'],
      ];

      const wsCharts = XLSX.utils.aoa_to_sheet(chartsData);
      wsCharts['!cols'] = [{ wch: 30 }, { wch: 15 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(wb, wsCharts, 'Analyses');
    }

    const fileName = `Rapport_${getTypeLabel(templateType)}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    return fileName;
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let fileName = '';

      if (reportForm.format === 'PDF') {
        fileName = generatePDFReport(reportForm.template);
      } else {
        fileName = generateExcelReport(reportForm.template);
      }

      setIsGenerating(false);
      alert(`✅ Rapport généré avec succès: ${fileName}`);
      router.push('/authorities/reports');
    }, 2000);
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
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Générer un Rapport</h1>
        <p className="text-slate-600">Configurez les paramètres de votre rapport</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Template Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Type de Rapport <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTemplates.map((template) => {
                const IconComponent = getIconComponent(template.icon);
                return (
                  <button
                    key={template.type}
                    onClick={() => setReportForm({ ...reportForm, template: template.type })}
                    className={`p-6 rounded-xl border-2 transition-all text-left ${
                      reportForm.template === template.type
                        ? 'border-[#d4a574] bg-[#d4a574]/10 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                    }`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-r ${template.color} rounded-lg flex items-center justify-center mb-3`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-bold text-slate-800 text-lg">{template.name}</div>
                    <div className="text-sm text-slate-600 mt-1">{template.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Authority Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Autorité
            </label>
            <CustomSelect
              value={reportForm.authority}
              onChange={(value) => setReportForm({ ...reportForm, authority: value })}
              options={[
                { value: 'all', label: 'Toutes les autorités' },
                { value: 'police-dakar', label: 'Police de Dakar' },
                { value: 'police-thies', label: 'Police de Thiès' },
                { value: 'gendarmerie', label: 'Gendarmerie Nationale' },
                { value: 'douanes', label: 'Douanes' }
              ]}
              placeholder="Sélectionner une autorité"
            />
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Période
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
              {(['today', 'week', 'month', 'quarter', 'year', 'custom'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setReportForm({ ...reportForm, dateRange: range })}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                    reportForm.dateRange === range
                      ? 'bg-[#d4a574] text-white shadow-lg'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {range === 'today' && 'Aujourd\'hui'}
                  {range === 'week' && 'Semaine'}
                  {range === 'month' && 'Mois'}
                  {range === 'quarter' && 'Trimestre'}
                  {range === 'year' && 'Année'}
                  {range === 'custom' && 'Personnalisé'}
                </button>
              ))}
            </div>

            {reportForm.dateRange === 'custom' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Date de début</label>
                  <input
                    type="date"
                    value={reportForm.startDate}
                    onChange={(e) => setReportForm({ ...reportForm, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2">Date de fin</label>
                  <input
                    type="date"
                    value={reportForm.endDate}
                    onChange={(e) => setReportForm({ ...reportForm, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a574]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Format d'Export
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setReportForm({ ...reportForm, format: 'PDF' })}
                className={`p-6 rounded-xl border-2 transition-all flex items-center space-x-4 ${
                  reportForm.format === 'PDF'
                    ? 'border-[#d4a574] bg-[#d4a574]/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <DocumentIcon className="w-7 h-7 text-slate-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">PDF</div>
                  <div className="text-sm text-slate-600">Format document</div>
                </div>
              </button>
              <button
                onClick={() => setReportForm({ ...reportForm, format: 'Excel' })}
                className={`p-6 rounded-xl border-2 transition-all flex items-center space-x-4 ${
                  reportForm.format === 'Excel'
                    ? 'border-[#d4a574] bg-[#d4a574]/10 shadow-lg'
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChartBarIcon className="w-7 h-7 text-slate-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-lg">Excel</div>
                  <div className="text-sm text-slate-600">Feuille de calcul</div>
                </div>
              </button>
            </div>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Options
            </label>
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportForm.includeCharts}
                  onChange={(e) => setReportForm({ ...reportForm, includeCharts: e.target.checked })}
                  className="w-5 h-5 text-[#d4a574] rounded focus:ring-[#d4a574]"
                />
                <span className="text-slate-700 font-medium">Inclure les graphiques et analyses</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportForm.includeDetails}
                  onChange={(e) => setReportForm({ ...reportForm, includeDetails: e.target.checked })}
                  className="w-5 h-5 text-[#d4a574] rounded focus:ring-[#d4a574]"
                />
                <span className="text-slate-700 font-medium">Inclure les détails complets</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4 pt-6 border-t">
            <button
              onClick={() => router.back()}
              className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleGenerateReport}
              disabled={!reportForm.template || isGenerating}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 ${
                !reportForm.template || isGenerating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#d4a574] to-[#c49564] hover:from-[#c49564] hover:to-[#b48554] text-white shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <ClockIcon className="w-5 h-5 animate-spin" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5" />
                  <span>Générer le Rapport</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GenerateReportPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <GenerateReportContent />
    </Suspense>
  );
}

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/app/components/ui/CustomSelect';

// Types
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

interface ReportTemplate {
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'activity' | 'financial' | 'incident' | 'performance';
}

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

const SearchIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const EyeIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const PlusIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ClockIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ExclamationIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export default function ReportsPage() {
  const router = useRouter();

  // States
  const [reportType, setReportType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data - Reports
  const reports: Report[] = [
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

  // Report Templates
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

  // Get icon component
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'chart': return ChartBarIcon;
      case 'currency': return CurrencyIcon;
      case 'shield': return ShieldIcon;
      case 'trending': return TrendingUpIcon;
      default: return DocumentIcon;
    }
  };

  // Filter and search logic
  const filteredAndSortedReports = useMemo(() => {
    let filtered = reports;

    // Filter by type
    if (reportType !== 'all') {
      filtered = filtered.filter(r => r.type === reportType);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === 'name') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === 'status') {
        comparison = a.status.localeCompare(b.status);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [reports, reportType, searchTerm, sortBy, sortOrder]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle template click - navigate to generate page
  const handleTemplateClick = (template: ReportTemplate) => {
    router.push(`/authorities/reports/generate?type=${template.type}`);
  };

  // Handle view - navigate to preview page
  const handleView = (reportId: number) => {
    router.push(`/authorities/reports/${reportId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Rapports & Analyses</h1>
        <p className="text-slate-600">Générez et gérez les rapports des autorités</p>
      </div>

      {/* Report Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {reportTemplates.map((template, index) => {
          const IconComponent = getIconComponent(template.icon);
          return (
            <button
              key={index}
              onClick={() => handleTemplateClick(template)}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all text-left group"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${template.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{template.name}</h3>
              <p className="text-sm text-slate-600 mb-4">{template.description}</p>
              <div className="flex items-center text-[#d4a574] font-semibold text-sm">
                <span>Générer →</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un rapport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 pl-12 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#d4a574] focus:border-transparent"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2">
            <CustomSelect
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
              options={[
                { value: 'date', label: 'Trier par Date' },
                { value: 'name', label: 'Trier par Nom' },
                { value: 'status', label: 'Trier par Statut' }
              ]}
              placeholder="Trier par"
              className="flex-1"
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center space-x-3 flex-wrap gap-3">
            <button
              onClick={() => setReportType('all')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all ${
                reportType === 'all'
                  ? 'bg-[#00124c] text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tous ({reports.length})
            </button>
            <button
              onClick={() => setReportType('activity')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                reportType === 'activity'
                  ? 'bg-[#d4a574] text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ChartBarIcon className="w-4 h-4" />
              <span>Activité</span>
            </button>
            <button
              onClick={() => setReportType('financial')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                reportType === 'financial'
                  ? 'bg-[#d4a574] text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CurrencyIcon className="w-4 h-4" />
              <span>Financier</span>
            </button>
            <button
              onClick={() => setReportType('incident')}
              className={`px-6 py-2 rounded-xl font-semibold transition-all flex items-center space-x-2 ${
                reportType === 'incident'
                  ? 'bg-[#d4a574] text-white shadow-lg'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <ShieldIcon className="w-4 h-4" />
              <span>Infractions</span>
            </button>
          </div>
          <button
            onClick={() => router.push('/authorities/reports/generate')}
            className="px-6 py-3 bg-gradient-to-r from-[#d4a574] to-[#c49564] text-white rounded-xl font-semibold hover:from-[#c49564] hover:to-[#b48554] transition-all shadow-lg flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Rapport Personnalisé</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Rapports Générés ({filteredAndSortedReports.length})
          </h2>
        </div>

        {filteredAndSortedReports.length === 0 ? (
          <div className="text-center py-12">
            <DocumentIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600 text-lg font-semibold">Aucun rapport trouvé</p>
            <p className="text-slate-400 text-sm mt-2">
              Essayez de modifier vos filtres ou générez un nouveau rapport
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedReports.map((report) => (
              <div
                key={report.id}
                className="border border-slate-200 rounded-xl p-5 hover:shadow-lg transition-all bg-white cursor-pointer"
                onClick={() => handleView(report.id)}
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  {/* Report Info */}
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-[#d4a574] to-[#c49564] rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <DocumentIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">{report.title}</h3>
                      <div className="flex items-center space-x-4 mt-1 flex-wrap">
                        <span className="text-sm text-slate-600">
                          <span className="font-semibold">Autorité:</span> {report.authority}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-sm text-slate-600">
                          <span className="font-semibold">Par:</span> {report.generatedBy}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Report Details */}
                  <div className="flex items-center space-x-8 flex-wrap gap-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Date</p>
                      <p className="text-sm font-semibold text-slate-800">{report.date}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Format</p>
                      <p className="text-sm font-semibold text-slate-800">{report.format}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 mb-1">Taille</p>
                      <p className="text-sm font-semibold text-slate-800">{report.size}</p>
                    </div>
                    <div className="text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1 ${getStatusColor(report.status)}`}>
                        {report.status === 'completed' && <><CheckIcon className="w-3 h-3" /><span>COMPLÉTÉ</span></>}
                        {report.status === 'processing' && <><ClockIcon className="w-3 h-3" /><span>EN COURS</span></>}
                        {report.status === 'failed' && <><ExclamationIcon className="w-3 h-3" /><span>ÉCHOUÉ</span></>}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(report.id);
                      }}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors text-sm flex items-center space-x-2"
                    >
                      <EyeIcon className="w-4 h-4" />
                      <span>Voir</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Total Rapports</p>
              <p className="text-3xl font-bold text-slate-800">{reports.length}</p>
              <p className="text-xs text-slate-500 mt-1 font-semibold">+3 ce mois</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-[#d4a574] to-[#c49564] rounded-xl flex items-center justify-center shadow-lg">
              <ChartBarIcon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Ce Mois</p>
              <p className="text-3xl font-bold text-slate-800">
                {reports.filter(r => {
                  const reportDate = new Date(r.date);
                  const now = new Date();
                  return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
              <p className="text-xs text-slate-500 mt-1 font-semibold">+25% vs mois dernier</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-[#d4a574] to-[#c49564] rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUpIcon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">En Traitement</p>
              <p className="text-3xl font-bold text-slate-800">
                {reports.filter(r => r.status === 'processing').length}
              </p>
              <p className="text-xs text-slate-500 mt-1">En cours de génération</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-r from-[#d4a574] to-[#c49564] rounded-xl flex items-center justify-center shadow-lg">
              <ClockIcon className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

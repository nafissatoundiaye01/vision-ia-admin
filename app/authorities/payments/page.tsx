'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download, Calendar, FileText, CreditCard, Smartphone, Banknote, Filter, X, Eye, Send } from 'lucide-react';
import Image from 'next/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import CustomSelect from '@/app/components/ui/CustomSelect';
import { PAYMENTS, INFRACTIONS } from '@/app/data/mockData';

export default function PaymentsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('Tous');
  const [filterDateDebut, setFilterDateDebut] = useState('');
  const [filterDateFin, setFilterDateFin] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Convertir les paiements centralisés au format attendu
  const payments = PAYMENTS.map(pay => {
    const infraction = INFRACTIONS.find(inf => inf.id === pay.referenceInfraction);
    return {
      id: pay.id,
      date: pay.date,
      heure: pay.heure,
      plaque: infraction?.plaque || '',
      type: infraction?.type || '',
      montant: pay.montant,
      mode: pay.mode,
      referenceInfraction: pay.referenceInfraction,
      referenceTransaction: pay.referenceTransaction,
      agent: infraction?.source || ''
    };
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.plaque.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceInfraction?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.referenceTransaction?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMode = filterMode === 'Tous' || payment.mode === filterMode;

    // Date filter
    let matchesDate = true;
    if (filterDateDebut || filterDateFin) {
      const paymentDate = new Date(payment.date.split('/').reverse().join('-'));
      if (filterDateDebut) {
        const dateDebut = new Date(filterDateDebut);
        matchesDate = matchesDate && paymentDate >= dateDebut;
      }
      if (filterDateFin) {
        const dateFin = new Date(filterDateFin);
        matchesDate = matchesDate && paymentDate <= dateFin;
      }
    }

    return matchesSearch && matchesMode && matchesDate;
  });

  // Statistiques
  const totalRecouvrements = payments.reduce((acc, p) => acc + p.montant, 0);
  const totalPaiements = payments.length;

  // Modes de paiement avec totaux
  const modePaiementStats = [
    {
      mode: 'Wave',
      count: payments.filter(p => p.mode === 'Wave').length,
      total: payments.filter(p => p.mode === 'Wave').reduce((acc, p) => acc + p.montant, 0)
    },
    {
      mode: 'Orange Money',
      count: payments.filter(p => p.mode === 'Orange Money').length,
      total: payments.filter(p => p.mode === 'Orange Money').reduce((acc, p) => acc + p.montant, 0)
    },
    {
      mode: 'Free Money',
      count: payments.filter(p => p.mode === 'Free Money').length,
      total: payments.filter(p => p.mode === 'Free Money').reduce((acc, p) => acc + p.montant, 0)
    },
  ];

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Wave':
        return <Image src="/wave.png" alt="Wave" width={24} height={24} className="object-contain" />;
      case 'Orange Money':
        return <Image src="/orange_money_logo.png" alt="Orange Money" width={24} height={24} className="object-contain" />;
      case 'Free Money':
        return <Image src="/yas_money_logo.png" alt="Free Money" width={24} height={24} className="object-contain" />;
      default: return null;
    }
  };

  const getModeLogo = (mode: string, size: number = 40) => {
    switch (mode) {
      case 'Wave':
        return <Image src="/wave.png" alt="Wave" width={size} height={size} className="object-contain" />;
      case 'Orange Money':
        return <Image src="/orange_money_logo.png" alt="Orange Money" width={size} height={size} className="object-contain" />;
      case 'Free Money':
        return <Image src="/yas_money_logo.png" alt="Free Money" width={size} height={size} className="object-contain" />;
      default: return null;
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Landscape mode pour plus d'espace

    // En-tête avec logo (texte stylisé)
    doc.setFillColor(61, 90, 92);
    doc.rect(0, 0, 297, 35, 'F');

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('VisionIA', 14, 15);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.text('SUIVI DES PAIEMENTS', 14, 25);

    // Date de génération
    doc.setFontSize(9);
    doc.setTextColor(220, 220, 220);
    const dateGeneration = `Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    doc.text(dateGeneration, 297 - 14, 15, { align: 'right' });

    // Nombre de résultats
    doc.setFontSize(10);
    doc.text(`${filteredPayments.length} paiement${filteredPayments.length > 1 ? 's' : ''}`, 297 - 14, 25, { align: 'right' });

    let yPosition = 45;

    // Section Statistiques
    doc.setFontSize(14);
    doc.setTextColor(61, 90, 92);
    doc.setFont('helvetica', 'bold');
    doc.text('STATISTIQUES', 14, yPosition);
    yPosition += 8;

    // Stats boxes
    const statsData = [
      { label: 'Recouvrements Totaux', value: `${(totalRecouvrements / 1000000).toFixed(2)}M FCFA`, color: [34, 197, 94] },
      { label: 'Total Paiements', value: `${totalPaiements}`, color: [61, 90, 92] }
    ];

    const boxWidth = 130;
    const boxHeight = 22;
    statsData.forEach((stat, i) => {
      const x = 14 + (i * (boxWidth + 8));

      // Box background
      doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
      doc.roundedRect(x, yPosition, boxWidth, boxHeight, 3, 3, 'F');

      // Value
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(stat.value, x + boxWidth / 2, yPosition + 10, { align: 'center' });

      // Label
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(stat.label, x + boxWidth / 2, yPosition + 17, { align: 'center' });
    });

    yPosition += boxHeight + 12;

    // Modes de paiement
    doc.setFontSize(12);
    doc.setTextColor(61, 90, 92);
    doc.setFont('helvetica', 'bold');
    doc.text('MODES DE PAIEMENT', 14, yPosition);
    yPosition += 6;

    doc.setFontSize(9);
    doc.setTextColor(60, 60, 60);
    doc.setFont('helvetica', 'normal');
    const modesText = modePaiementStats.map(m => `${m.mode}: ${m.count}`).join('  |  ');
    doc.text(modesText, 14, yPosition);
    yPosition += 8;

    // Filtres actifs
    if (activeFiltersCount > 0) {
      doc.setFontSize(9);
      doc.setTextColor(249, 115, 22);
      doc.setFont('helvetica', 'italic');
      let filtersText = 'Filtres appliqués: ';
      const filters = [];
      if (filterMode !== 'Tous') filters.push(`Mode: ${filterMode}`);
      if (filterDateDebut) filters.push(`Du: ${new Date(filterDateDebut).toLocaleDateString('fr-FR')}`);
      if (filterDateFin) filters.push(`Au: ${new Date(filterDateFin).toLocaleDateString('fr-FR')}`);
      filtersText += filters.join(' | ');
      doc.text(filtersText, 14, yPosition);
      yPosition += 6;
    }

    // Table des paiements
    const tableData = filteredPayments.map(p => [
      p.id,
      p.date,
      p.heure,
      p.plaque,
      p.type,
      `${p.montant.toLocaleString()} F`,
      p.mode,
      p.referenceInfraction,
      p.agent
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['ID Paiement', 'Date', 'Heure', 'Plaque', 'Type Infraction', 'Montant', 'Mode Paiement', 'Réf. Infraction', 'Agent']],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 7,
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [61, 90, 92],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8,
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 28, fontStyle: 'bold', fontSize: 6.5 }, // ID Paiement
        1: { cellWidth: 22, halign: 'center' }, // Date
        2: { cellWidth: 15, halign: 'center' }, // Heure
        3: { cellWidth: 24, fontStyle: 'bold', halign: 'center' }, // Plaque
        4: { cellWidth: 40 }, // Type Infraction
        5: { cellWidth: 28, halign: 'right', fontStyle: 'bold' }, // Montant
        6: { cellWidth: 30, halign: 'center' }, // Mode Paiement
        7: { cellWidth: 30, fontSize: 6.5, fontStyle: 'bold', halign: 'center' }, // Réf. Infraction
        8: { cellWidth: 'auto' }, // Agent
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      margin: { left: 14, right: 14 },
      didDrawPage: function(data) {
        // Pied de page sur chaque page
        const pageCount = (doc as any).internal.getNumberOfPages();
        const currentPage = (doc as any).internal.getCurrentPageInfo().pageNumber;

        // Ligne de séparation
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(14, doc.internal.pageSize.height - 15, 297 - 14, doc.internal.pageSize.height - 15);

        // Texte du pied de page
        doc.setFontSize(8);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text('VisionIA - Système de Gestion des Infractions Routières', 14, doc.internal.pageSize.height - 8);
        doc.text(`Page ${currentPage} / ${pageCount}`, 297 - 14, doc.internal.pageSize.height - 8, { align: 'right' });
      }
    });

    // Sauvegarde du PDF
    const fileName = `paiements_visionia_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterMode('Tous');
    setFilterDateDebut('');
    setFilterDateFin('');
  };

  const activeFiltersCount =
    (filterMode !== 'Tous' ? 1 : 0) +
    (filterDateDebut ? 1 : 0) +
    (filterDateFin ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#3d5a5c]">Suivi des Paiements</h1>
            <p className="text-gray-600 mt-1">Gérez et suivez tous les paiements d'infractions</p>
          </div>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-[#3d5a5c] hover:bg-[#2d4a4c] text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-5 h-5" />
            Exporter en PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600 font-medium">Total Recouvrements</div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7 text-green-600" />
            </div>
          </div>
          <div className="text-4xl font-bold text-green-900">{(totalRecouvrements / 1000000).toFixed(2)}M</div>
          <div className="text-sm text-gray-500 mt-1">FCFA</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600 font-medium">Total Paiements</div>
            <div className="w-12 h-12 bg-[#3d5a5c]/10 rounded-lg flex items-center justify-center">
              <svg className="w-7 h-7 text-[#3d5a5c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-4xl font-bold text-[#3d5a5c]">{totalPaiements}</div>
          <div className="text-sm text-gray-500 mt-1">Paiements effectués</div>
        </div>
      </div>

      {/* Payment Methods Stats */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-xl font-bold text-[#3d5a5c] mb-4">Modes de Paiement - Totaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modePaiementStats.map((item, index) => (
            <div key={index} className="p-5 border-2 border-gray-200 rounded-xl hover:border-[#3d5a5c] transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-2 border border-gray-200">
                    {getModeLogo(item.mode, 40)}
                  </div>
                  <div className="font-semibold text-gray-900">{item.mode}</div>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Nombre de paiements</div>
                  <div className="text-2xl font-bold text-gray-900">{item.count}</div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Total payé</div>
                  <div className="text-xl font-bold text-green-600">
                    {(item.total / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">FCFA</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par ID, plaque, type, référence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              showFilters ? 'bg-[#3d5a5c] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="bg-white text-[#3d5a5c] text-xs font-bold px-2 py-0.5 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Mode Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                <CustomSelect
                  value={filterMode}
                  onChange={setFilterMode}
                  options={[
                    { value: 'Tous', label: 'Tous' },
                    { value: 'Wave', label: 'Wave' },
                    { value: 'Orange Money', label: 'Orange Money' },
                    { value: 'Free Money', label: 'Free Money' }
                  ]}
                  placeholder="Sélectionner un mode"
                />
              </div>

              {/* Date Début */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
                <input
                  type="date"
                  value={filterDateDebut}
                  onChange={(e) => setFilterDateDebut(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                />
              </div>

              {/* Date Fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                <input
                  type="date"
                  value={filterDateFin}
                  onChange={(e) => setFilterDateFin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-[#3d5a5c]"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Réinitialiser les filtres
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredPayments.length} paiement{filteredPayments.length > 1 ? 's' : ''} trouvé{filteredPayments.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Payments Table - Desktop */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID Paiement</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date/Heure</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Plaque</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Montant</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Mode</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Réf. Infraction</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-mono text-gray-900">{payment.id}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {payment.date}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{payment.heure}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-mono font-semibold bg-gray-100 px-2 py-1 rounded">
                      {payment.plaque}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">{payment.type}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-900">
                    {payment.montant.toLocaleString()} FCFA
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1 border border-gray-200">
                        {getModeIcon(payment.mode)}
                      </div>
                      {payment.mode}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-mono font-semibold text-gray-900">
                    {payment.referenceInfraction}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => router.push(`/authorities/payments/${payment.id}`)}
                      className="p-1.5 bg-[#3d5a5c] hover:bg-[#2d4a4c] text-white rounded-lg transition-colors"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payments Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="mb-3">
              <div className="text-xs font-semibold text-gray-500 mb-1">ID</div>
              <div className="font-mono font-semibold text-gray-900 text-sm">{payment.id}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <div className="text-xs text-gray-500 mb-1">Date/Heure</div>
                <div className="font-medium text-gray-900">{payment.date}</div>
                <div className="text-xs text-gray-600">{payment.heure}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Montant</div>
                <div className="font-semibold text-gray-900">{payment.montant.toLocaleString()} FCFA</div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Plaque</div>
              <span className="font-mono font-semibold bg-gray-100 px-2 py-1 rounded text-sm">
                {payment.plaque}
              </span>
            </div>

            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Type</div>
              <div className="text-sm font-medium text-gray-900">{payment.type}</div>
            </div>

            <div className="mt-2">
              <div className="text-xs text-gray-500 mb-1">Réf. Infraction</div>
              <div className="text-sm font-mono font-semibold text-[#3d5a5c]">{payment.referenceInfraction}</div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500 mb-1">Mode</div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1 border border-gray-200">
                    {getModeIcon(payment.mode)}
                  </div>
                  {payment.mode}
                </div>
              </div>
              <button
                onClick={() => router.push(`/authorities/payments/${payment.id}`)}
                className="p-2 bg-[#3d5a5c] hover:bg-[#2d4a4c] text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucun paiement trouvé</h3>
          <p className="text-gray-500">
            {searchQuery || activeFiltersCount > 0
              ? 'Essayez de modifier vos critères de recherche ou vos filtres'
              : 'Aucun paiement enregistré pour le moment'}
          </p>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
  onRangeSelect?: (start: Date, end: Date) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onRangeSelect
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le calendrier si on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day);

    if (selectingStart || !startDate) {
      onStartDateChange(clickedDate);
      onEndDateChange(null);
      setSelectingStart(false);
    } else {
      if (clickedDate < startDate) {
        // Si la date de fin est avant la date de début, inverser
        onEndDateChange(startDate);
        onStartDateChange(clickedDate);
      } else {
        onEndDateChange(clickedDate);
      }
      setSelectingStart(true);

      if (onRangeSelect && startDate) {
        onRangeSelect(startDate, clickedDate);
      }
    }
  };

  const isDateInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(year, month, day);
    return date >= startDate && date <= endDate;
  };

  const isDateStart = (day: number) => {
    if (!startDate) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === startDate.toDateString();
  };

  const isDateEnd = (day: number) => {
    if (!endDate) return false;
    const date = new Date(year, month, day);
    return date.toDateString() === endDate.toDateString();
  };

  const isDateHovered = (day: number) => {
    if (!hoveredDate || !startDate || endDate) return false;
    const date = new Date(year, month, day);
    return (date >= startDate && date <= hoveredDate) || (date <= startDate && date >= hoveredDate);
  };

  const formatDateRange = () => {
    if (!startDate) return 'Sélectionner une période';
    if (!endDate) return `Du ${startDate.toLocaleDateString('fr-FR')}`;

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')} (${diffDays} jour${diffDays > 1 ? 's' : ''})`;
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const quickSelections = [
    { label: 'Aujourd\'hui', days: 0 },
    { label: '7 derniers jours', days: 7 },
    { label: '30 derniers jours', days: 30 },
    { label: '3 derniers mois', days: 90 },
    { label: '6 derniers mois', days: 180 },
    { label: 'Cette année', days: -1 }
  ];

  const handleQuickSelect = (days: number) => {
    const end = new Date();
    let start: Date;

    if (days === 0) {
      // Aujourd'hui
      start = new Date(end);
    } else if (days === -1) {
      // Cette année
      start = new Date(end.getFullYear(), 0, 1);
    } else {
      start = new Date();
      start.setDate(end.getDate() - days);
    }

    onStartDateChange(start);
    onEndDateChange(end);
    setSelectingStart(true);

    if (onRangeSelect) {
      onRangeSelect(start, end);
    }
  };

  const clearSelection = () => {
    onStartDateChange(null);
    onEndDateChange(null);
    setSelectingStart(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Input trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2.5 text-left bg-white border border-gray-300 rounded-lg hover:border-[#3d5a5c] focus:outline-none focus:ring-2 focus:ring-[#3d5a5c] focus:border-transparent transition-all text-sm"
      >
        <div className="flex items-center justify-between">
          <span className={startDate ? 'text-gray-900' : 'text-gray-500'}>
            {formatDateRange()}
          </span>
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </button>

      {/* Calendar dropdown */}
     {isOpen && (
 <div
  className="
    absolute z-50 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-4
    w-[100%] 
  "
  style={{ boxSizing: 'border-box' }}
>

 {/* Quick selections */}
          <div className="mb-4 pb-3 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">SÉLECTIONS RAPIDES</div>
            <div className="flex flex-wrap gap-2">
              {quickSelections.map((quick) => (
                <button
                  key={quick.label}
                  onClick={() => handleQuickSelect(quick.days)}
                  className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-[#3d5a5c] hover:text-white rounded-md transition-colors"
                >
                  {quick.label}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="text-sm font-semibold text-[#3d5a5c]">
              {monthNames[month]} {year}
            </div>

            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-xs font-semibold text-gray-500 text-center py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const isInRange = isDateInRange(day);
              const isStart = isDateStart(day);
              const isEnd = isDateEnd(day);
              const isHovered = isDateHovered(day);

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  onMouseEnter={() => setHoveredDate(new Date(year, month, day))}
                  onMouseLeave={() => setHoveredDate(null)}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                    ${isStart || isEnd
                      ? 'bg-[#3d5a5c] text-white font-semibold shadow-md'
                      : isInRange || isHovered
                      ? 'bg-[#3d5a5c]/20 text-[#3d5a5c]'
                      : 'hover:bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
            <button
              onClick={clearSelection}
              className="flex-1 px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Effacer
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 text-xs bg-[#3d5a5c] hover:bg-[#2d4a4c] text-white rounded-lg font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SenegalFlag, { SenegalFlagMini } from '../ui/SenegalFlag';

interface MenuItem {
  icon: string;
  label: string;
  href: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeUsers] = useState([
    { id: 1, name: 'A', color: '#E8B88F' },
    { id: 2, name: 'B', color: '#7BA8B5' },
    { id: 3, name: 'C', color: '#D4A574' },
    { id: 4, name: 'D', color: '#C9A36C' },
  ]);

  const menuItems: MenuItem[] = [
    { icon: 'home', label: 'DASHBOARD', href: '/authorities' },
    { icon: 'map', label: 'CARTE', href: '/authorities/map' },
    { icon: 'clipboard', label: 'INFRACTIONS', href: '/authorities/infractions' },
    { icon: 'chart', label: 'STATISTIQUES', href: '/authorities/statistics' },
    { icon: 'car', label: 'VÉHICULES', href: '/authorities/vehicles' },
    { icon: 'users', label: 'AGENTS', href: '/authorities/agents' },
    { icon: 'wallet', label: 'PAIEMENTS', href: '/authorities/payments' },
    { icon: 'document', label: 'RAPPORTS', href: '/authorities/reports' },
    { icon: 'settings', label: 'CONFIGURATION', href: '/authorities/settings' },
  ];

  const getIcon = (iconName: string) => {
    const iconClass = "w-5 h-5";
    switch (iconName) {
      case 'home': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
      case 'map': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>;
      case 'clipboard': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
      case 'chart': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
      case 'car': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'users': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
      case 'wallet': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'document': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
      case 'settings': return <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
      default: return null;
    }
  };

  const isActive = (href: string) => pathname === href;

  const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (navRef.current) {
      const activeLink = navRef.current.querySelector('.active-item') as HTMLElement;
      if (activeLink) {
        // Calculer la position en tenant compte du scroll
        const navScrollTop = navRef.current.scrollTop;
        const activeLinkOffsetTop = activeLink.offsetTop;

        setIndicatorStyle({
          top: activeLinkOffsetTop,
          height: activeLink.offsetHeight,
        });

        // Scroller automatiquement pour centrer l'élément actif
        const navHeight = navRef.current.clientHeight;
        const scrollPosition = activeLinkOffsetTop - (navHeight / 2) + (activeLink.offsetHeight / 2);

        navRef.current.scrollTo({
          top: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [pathname, isCollapsed, isMobileOpen]);

  // Fermer le menu mobile lors du changement de route
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Gérer le responsive au resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Custom scrollbar styles - Invisible */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .sidebar-nav::-webkit-scrollbar,
          aside::-webkit-scrollbar {
            width: 0px;
            height: 0px;
            display: none;
          }
          .sidebar-nav::-webkit-scrollbar-track,
          aside::-webkit-scrollbar-track {
            background: transparent;
          }
          .sidebar-nav::-webkit-scrollbar-thumb,
          aside::-webkit-scrollbar-thumb {
            background: transparent;
          }
        `
      }} />

      {/* Mobile Menu Button - Visible uniquement sur mobile/tablette */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-[#00124c] rounded-full flex items-center justify-center shadow-lg"
      >
        {isMobileOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Overlay pour mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          h-screen flex flex-col transition-all duration-300 relative bg-[#00124c]
          rounded-tr-3xl rounded-br-3xl
          overflow-y-auto overflow-x-hidden

          /* Mobile & Tablette: drawer fixe qui slide */
          fixed top-0 left-0 z-40
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          w-64

          /* Desktop: positionnement sticky et width responsive */
          lg:translate-x-0 lg:sticky
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Toggle Button - Visible uniquement sur desktop */}
        <div className="hidden lg:flex justify-end p-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-6 h-6 bg-[#ffffff] rounded-full flex items-center justify-center z-50 shadow-lg transition-colors"
          >
            {isCollapsed ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* User Profile */}
        <div className={`${isCollapsed ? 'hidden lg:hidden' : 'block'} p-4 sm:p-6 pb-3 sm:pb-4`}>
          <div className="flex flex-col items-center mb-2">
            <div className="relative mb-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden">
                <svg viewBox="0 0 24 24" className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              {/* Mini drapeau sur l'avatar */}
              <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full p-0.5 shadow-lg">
                <SenegalFlagMini className="w-full h-full rounded-full" />
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="font-bold text-sm sm:text-base tracking-wide text-white">Pape Serigne Diouf</h2>
              </div>
              <p className="text-xs text-slate-300">Police Centrale / Dakar</p>
              <p className="text-xs text-slate-400 mt-0.5">🇸🇳 Sénégal</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav
          ref={navRef}
          className="sidebar-nav flex-1 py-2 pr-2 pl-3 sm:pl-4 relative overflow-y-auto overflow-x-hidden min-h-0"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {/* Indicator with rounded corners */}
          <div
            className="absolute left-3 sm:left-4 bg-white rounded-l-full shadow-lg transition-all duration-500 ease-in-out pointer-events-none"
            style={{
              top: `${indicatorStyle.top}px`,
              height: `${indicatorStyle.height}px`,
              width: isCollapsed ? 'calc(100% - 0.5rem)' : 'calc(100% - 0.75rem)',
              opacity: indicatorStyle.height > 0 ? 1 : 0,
            }}
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#d4a574] rounded-r-full"></div>
            <div className="absolute -top-4 right-0 w-4 h-4 bg-white"></div>
            <div className="absolute -top-4 right-0 w-4 h-4 bg-[#00124c] rounded-br-full"></div>
            <div className="absolute -bottom-4 right-0 w-4 h-4 bg-white"></div>
            <div className="absolute -bottom-4 right-0 w-4 h-4 bg-[#00124c] rounded-tr-full"></div>
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 my-1 transition-colors duration-300 ease-in-out text-xs sm:text-sm font-medium relative rounded-lg z-10 ${
                isActive(item.href)
                  ? 'active-item text-[#00124c]'
                  : 'text-slate-300 hover:bg-slate-700/30'
              }`}
            >
              <span className="text-base sm:text-lg flex-shrink-0">{getIcon(item.icon)}</span>
              <span className={`${isCollapsed ? 'lg:hidden' : 'block'} tracking-wide truncate`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Drapeau du Sénégal */}
        <div className={`${isCollapsed ? 'hidden lg:hidden' : 'block'} px-3 sm:px-4 py-3 sm:py-4 border-t border-neutral-500/30`}>
          <div className="rounded-xl overflow-hidden bg-[#00000000] p-3 flex items-center justify-center" style={{ height: '12vh' }}>
            <SenegalFlag className="w-full h-full rounded-lg shadow-lg" />
          </div>
          <p className="text-center text-xs text-slate-300 mt-2 font-medium tracking-wide">République du Sénégal</p>
        </div>
      </aside>
    </>
  );
}

import React from 'react';
import { House, UserSession } from '../types/condo';
import { PWAInstallButton } from './PWAInstallButton';
import {
  Shield,
  Home,
  UserCheck,
  User,
  KeyRound,
  FileSpreadsheet,
  Droplet,
  Wrench,
  MessageSquare,
  Users,
  Settings,
  ChevronDown,
} from 'lucide-react';

interface NavbarProps {
  currentHouse: House;
  session: UserSession;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: () => void;
  onExportExcel: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentHouse,
  session,
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onExportExcel,
}) => {
  const isTagActive = currentHouse.tagVehicularActivo;
  const isWaterActive = currentHouse.servicioAguaActivo;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      {/* Top Banner with Brand & Access */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Crest */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-1 flex items-center justify-center shadow-md shadow-blue-900/20 ring-1 ring-amber-400/30">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight">
                BEIRE A.C.
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-blue-100 text-blue-800">
                117 Casas
              </span>
            </div>
            <p className="text-[11px] text-slate-700 hidden sm:block truncate max-w-xs md:max-w-md">
              Asociación de Condóminos BEIRE • Querétaro, Qro.
            </p>
          </div>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* House Selector / Quick Pill */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-left hover:bg-slate-100 transition active:scale-95"
            title="Cambiar casa o modo de acceso"
          >
            <Home className="w-3.5 h-3.5 text-blue-700" />
            <div className="text-xs leading-none">
              <span className="font-bold text-slate-900">Casa {currentHouse.numeroCasa}</span>
              <span className="block text-[10px] text-slate-700 truncate max-w-[80px] sm:max-w-[120px]">
                {currentHouse.titular.split(' ')[0]}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-600" />
          </button>

          {/* Role Pill */}
          <button
            onClick={onOpenAuthModal}
            className={`hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
              session.role === 'admin'
                ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-400/40'
                : 'bg-blue-50 text-blue-800 ring-1 ring-blue-200'
            }`}
          >
            {session.role === 'admin' ? (
              <>
                <KeyRound className="w-3.5 h-3.5 text-amber-800" />
                <span>Admin Mesa</span>
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5 text-blue-800" />
                <span>Residente</span>
              </>
            )}
          </button>

          {/* Quick Excel Export */}
          <button
            onClick={onExportExcel}
            className="hidden md:flex items-center gap-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 px-2.5 py-1 text-xs font-semibold transition"
            title="Exportar archivo Excel oficial de esta casa"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
            <span>Excel Casa</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>
      </div>

      {/* House Status Pills (Vehicular Tag & Water Service) */}
      <div className="bg-slate-100/90 border-t border-slate-200 px-3 sm:px-6 py-1 flex items-center justify-between text-[11px] text-slate-600">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5 scrollbar-none">
          <span className="font-semibold text-slate-700 hidden sm:inline">Servicios Casa {currentHouse.numeroCasa}:</span>

          {/* Tag Status */}
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isTagActive ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
              }`}
            />
            <span className="text-slate-600">Control Vehicular:</span>
            <span
              className={`font-semibold ${
                isTagActive ? 'text-emerald-700' : 'text-red-700'
              }`}
            >
              {isTagActive ? 'Activo' : 'Restringido (2+ cuotas)'}
            </span>
          </div>

          <span className="text-slate-300">|</span>

          {/* Water Status */}
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${
                isWaterActive ? 'bg-sky-500' : 'bg-purple-600 animate-pulse'
              }`}
            />
            <span className="text-slate-600">Toma de Agua:</span>
            <span
              className={`font-semibold ${
                isWaterActive ? 'text-sky-700' : 'text-purple-700'
              }`}
            >
              {isWaterActive ? 'Conectada' : 'Restringida (6+ cuotas)'}
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-[10px] text-slate-700">
          <span>Medidor: <strong>{currentHouse.medidor}</strong></span>
          <span>•</span>
          <span>Av. Puente de la Reina 2042</span>
        </div>
      </div>

      {/* Desktop Navigation Tabs */}
      <nav className="hidden md:flex max-w-7xl mx-auto px-6 border-t border-slate-200 bg-white">
        <div className="flex space-x-1 py-1">
          <button
            onClick={() => setActiveTab('resumen')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'resumen'
                ? 'bg-blue-50 text-blue-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Resumen General</span>
          </button>

          <button
            onClick={() => setActiveTab('agua')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'agua'
                ? 'bg-sky-50 text-sky-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Droplet className="w-4 h-4" />
            <span>Recibo de Agua</span>
          </button>

          <button
            onClick={() => setActiveTab('mantenimiento')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'mantenimiento'
                ? 'bg-amber-50 text-amber-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Mantenimiento y Mora</span>
          </button>

          <button
            onClick={() => setActiveTab('reportes')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition relative ${
              activeTab === 'reportes'
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reportes en Tiempo Real</span>
          </button>

          <button
            onClick={() => setActiveTab('comunidad')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
              activeTab === 'comunidad'
                ? 'bg-purple-50 text-purple-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Minutas y Acuerdos</span>
          </button>

          {session.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                activeTab === 'admin'
                  ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                  : 'text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Panel 117 Casas</span>
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};

import React from 'react';
import { UserSession } from '../types/condo';
import { Home, Droplet, Wrench, MessageSquare, Users, Settings } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  session: UserSession;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  session,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg pb-safe">
      <div className="flex items-center justify-around">
        {/* Resumen */}
        <button
          onClick={() => setActiveTab('resumen')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'resumen'
              ? 'text-blue-700 font-bold'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Inicio</span>
        </button>

        {/* Agua */}
        <button
          onClick={() => setActiveTab('agua')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'agua'
              ? 'text-sky-700 font-bold'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Droplet className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Agua</span>
        </button>

        {/* Mantenimiento */}
        <button
          onClick={() => setActiveTab('mantenimiento')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'mantenimiento'
              ? 'text-amber-900 font-bold'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Mtto.</span>
        </button>

        {/* Reportes */}
        <button
          onClick={() => setActiveTab('reportes')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'reportes'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Reportes</span>
        </button>

        {/* Comunidad */}
        <button
          onClick={() => setActiveTab('comunidad')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            activeTab === 'comunidad'
              ? 'text-purple-700 font-bold'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Minutas</span>
        </button>

        {/* Admin (si rol admin) */}
        {session.role === 'admin' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
              activeTab === 'admin'
                ? 'text-indigo-700 font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">117 Casas</span>
          </button>
        )}
      </div>
    </nav>
  );
};

import React, { useState } from 'react';
import { House, UserSession, UserRole } from '../types/condo';
import {
  Shield,
  User,
  KeyRound,
  Home,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  houses: House[];
  currentSession: UserSession;
  onSaveSession: (session: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  houses,
  currentSession,
  onSaveSession,
}) => {
  const [role, setRole] = useState<UserRole>(currentSession.role);
  const [selectedHouseId, setSelectedHouseId] = useState<number>(currentSession.casaId || 59);
  const [adminPin, setAdminPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSelectRole = (r: UserRole) => {
    setRole(r);
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      // Validate Admin PIN (admin123 or direct enter)
      if (adminPin.trim() && adminPin.trim() !== 'admin123' && adminPin.trim() !== 'admin') {
        setErrorMsg('PIN de administrador incorrecto. (PIN Demo: admin123)');
        return;
      }
      onSaveSession({
        role: 'admin',
        casaId: selectedHouseId,
        userName: 'Administración Hábitat Condominal',
      });
      onClose();
    } else {
      const house = houses.find((h) => h.id === selectedHouseId);
      onSaveSession({
        role: 'residente',
        casaId: selectedHouseId,
        userName: house ? `${house.titular} (Casa ${house.numeroCasa})` : `Residente Casa ${selectedHouseId}`,
      });
      onClose();
    }
  };

  const currentSelectedHouse = houses.find((h) => h.id === selectedHouseId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-sm">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Control de Acceso y Privilegios
              </h3>
              <p className="text-xs text-slate-700">
                Condominio BEIRE A.C. (117 Casas)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="mt-4 grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => handleSelectRole('residente')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              role === 'residente'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Acceso Residente</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectRole('admin')}
            className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              role === 'admin'
                ? 'bg-white text-amber-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Administrador</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Si es Residente: Selector de Casa */}
          {role === 'residente' ? (
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Selecciona tu Casa (1 a 117):
                </label>
                <select
                  value={selectedHouseId}
                  onChange={(e) => setSelectedHouseId(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                >
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      Casa {h.numeroCasa} — {h.titular}
                    </option>
                  ))}
                </select>
              </div>

              {currentSelectedHouse && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 space-y-1 text-[11px] text-blue-950">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600">Titular:</span>
                    <span className="font-bold">{currentSelectedHouse.titular}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600">Medidor:</span>
                    <span className="font-mono">{currentSelectedHouse.medidor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600">Total Agua:</span>
                    <span className="font-mono font-bold">${currentSelectedHouse.waterBill.totalAPagar.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-600">Total Mantenimiento:</span>
                    <span className="font-mono font-bold">${currentSelectedHouse.maintenanceBill.totalAPagar.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <p className="text-[11px] text-slate-600">
                Como residente, tu acceso estará protegido y solo podrás visualizar los estados de cuenta, reportes y acuerdos correspondientes a la casa seleccionada.
              </p>
            </div>
          ) : (
            /* Si es Administrador */
            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Contraseña / PIN de Administrador:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Escribe PIN (demo: admin123)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                </div>
                <p className="text-[10px] text-slate-700 mt-1">
                  Clave predeterminada para demostración: <strong>admin123</strong> (o clic en ingresar).
                </p>
              </div>

              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Privilegios de Administrador:</p>
                  <p className="mt-0.5 leading-relaxed">
                    Acceso total a las 117 casas, publicación de minutas y acuerdos por casa, captura de lecturas, emisión de cobranza y exportación de libros de Excel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold border border-red-200">
              {errorMsg}
            </div>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
            >
              <span>Acceder al Sistema</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

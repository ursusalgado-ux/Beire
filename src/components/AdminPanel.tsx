import React, { useState } from 'react';
import { House, UserSession, PaymentTransaction } from '../types/condo';
import { excelService } from '../services/excelService';
import {
  Settings,
  Search,
  Filter,
  FileSpreadsheet,
  Download,
  Upload,
  CreditCard,
  Car,
  Droplet,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  TrendingDown,
  DollarSign,
  RotateCcw,
  Plus,
} from 'lucide-react';

interface AdminPanelProps {
  houses: House[];
  session: UserSession;
  currentHouse: House;
  onSelectHouse: (houseId: number) => void;
  onUpdateHouse: (house: House) => void;
  onOpenPaymentModal: (type: 'Agua' | 'Mantenimiento', defaultHouseId?: number) => void;
  onResetAll: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  houses,
  session,
  currentHouse,
  onSelectHouse,
  onUpdateHouse,
  onOpenPaymentModal,
  onResetAll,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');

  // KPI calculations
  const totalCasas = houses.length;
  let totalAdeudoMtto = 0;
  let totalAdeudoAgua = 0;
  let tagsRestringidosCount = 0;
  let aguaRestringidaCount = 0;
  let alCorrienteCount = 0;

  houses.forEach((h) => {
    if (h.maintenanceBill.totalAPagar > 0) {
      totalAdeudoMtto += h.maintenanceBill.totalAPagar;
    }
    if (h.waterBill.totalAPagar > 0) {
      totalAdeudoAgua += h.waterBill.totalAPagar;
    }
    if (!h.tagVehicularActivo) {
      tagsRestringidosCount++;
    }
    if (!h.servicioAguaActivo) {
      aguaRestringidaCount++;
    }
    if (h.maintenanceBill.mesesAdeudo === 0 && h.waterBill.mesesSinPago === 0) {
      alCorrienteCount++;
    }
  });

  // Filter houses
  const filteredHouses = houses.filter((h) => {
    const matchesSearch =
      h.numeroCasa.includes(searchTerm) ||
      h.titular.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.medidor.includes(searchTerm);

    if (!matchesSearch) return false;

    if (filterStatus === 'corriente') {
      return h.maintenanceBill.mesesAdeudo === 0 && h.waterBill.mesesSinPago === 0;
    }
    if (filterStatus === 'tag_bloqueado') {
      return !h.tagVehicularActivo;
    }
    if (filterStatus === 'agua_restringida') {
      return !h.servicioAguaActivo;
    }
    if (filterStatus === 'saldo_favor') {
      return h.maintenanceBill.capitalPendiente < 0;
    }
    if (filterStatus === 'con_adeudo') {
      return h.maintenanceBill.totalAPagar > 325 || h.waterBill.periodoAnteriorPendiente > 0;
    }

    return true;
  });

  const handleToggleTag = (h: House, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: House = {
      ...h,
      tagVehicularActivo: !h.tagVehicularActivo,
      maintenanceBill: {
        ...h.maintenanceBill,
        tagVehicularRestringido: h.tagVehicularActivo,
      },
    };
    onUpdateHouse(updated);
  };

  const handleToggleAgua = (h: House, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated: House = {
      ...h,
      servicioAguaActivo: !h.servicioAguaActivo,
      waterBill: {
        ...h.waterBill,
        reconexion: h.servicioAguaActivo ? 200.00 : 0.00,
      },
    };
    onUpdateHouse(updated);
  };

  const handleDownloadSingleExcel = (h: House, e: React.MouseEvent) => {
    e.stopPropagation();
    excelService.exportHouseExcel(h);
  };

  return (
    <div className="space-y-6">
      {/* Admin Title & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
              <Settings className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Panel de Control Administrativo (117 Casas)
              </h2>
              <p className="text-xs text-slate-700">
                Gestión de cobranza, lectura de agua, sanciones de asamblea y reportes ejecutivos en Excel
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => excelService.exportGlobalCondoExcel(houses)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow-sm transition active:scale-95"
            title="Genera reporte consolidado de las 117 casas en Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar Resumen 117 Casas (.xlsx)</span>
          </button>

          <button
            onClick={() => onOpenPaymentModal('Mantenimiento')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Registrar Cobro</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Total Condominio</span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">117 Casas</div>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 block">
            {alCorrienteCount} al corriente
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Cartera Mantenimiento</span>
          <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1">
            ${totalAdeudoMtto.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-slate-700 mt-0.5 block">Total exigible</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Cartera Agua CEA</span>
          <div className="text-xl sm:text-2xl font-black text-sky-900 mt-1">
            ${totalAdeudoAgua.toLocaleString('es-MX', { maximumFractionDigits: 0 })}
          </div>
          <span className="text-[10px] text-slate-700 mt-0.5 block">Periodo actual + rezagos</span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Tags Bloqueados</span>
          <div className="text-xl sm:text-2xl font-black text-red-600 mt-1">
            {tagsRestringidosCount}
          </div>
          <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
            ≥ 2 cuotas vencidas
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase text-slate-700 block">Tomas de Agua en Corte</span>
          <div className="text-xl sm:text-2xl font-black text-purple-700 mt-1">
            {aguaRestringidaCount}
          </div>
          <span className="text-[10px] text-purple-700 font-semibold mt-0.5 block">
            ≥ 6 cuotas vencidas
          </span>
        </div>
      </div>

      {/* Directory Table with Search & Status Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por número de casa (ej. 59), nombre del titular o medidor..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none text-xs">
            <button
              onClick={() => setFilterStatus('todos')}
              className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition ${
                filterStatus === 'todos'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas (117)
            </button>
            <button
              onClick={() => setFilterStatus('corriente')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                filterStatus === 'corriente'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
              }`}
            >
              Al Corriente
            </button>
            <button
              onClick={() => setFilterStatus('con_adeudo')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                filterStatus === 'con_adeudo'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
              }`}
            >
              Con Adeudo
            </button>
            <button
              onClick={() => setFilterStatus('tag_bloqueado')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                filterStatus === 'tag_bloqueado'
                  ? 'bg-red-600 text-white'
                  : 'bg-red-50 text-red-700 hover:bg-red-100'
              }`}
            >
              Tag Bloqueado
            </button>
            <button
              onClick={() => setFilterStatus('agua_restringida')}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition ${
                filterStatus === 'agua_restringida'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
              }`}
            >
              Agua Restringida
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-2.5 px-3">CASA</th>
                <th className="py-2.5 px-3">TITULAR Y CONTACTO</th>
                <th className="py-2.5 px-3 text-right">TOTAL MTTO</th>
                <th className="py-2.5 px-3 text-center">TAG CONTROL</th>
                <th className="py-2.5 px-3 text-right">AGUA (m³)</th>
                <th className="py-2.5 px-3 text-right">TOTAL AGUA</th>
                <th className="py-2.5 px-3 text-center">TOMA AGUA</th>
                <th className="py-2.5 px-3 text-right">ADEUDO TOTAL</th>
                <th className="py-2.5 px-3 text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHouses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-600">
                    No se encontraron casas con el término de búsqueda ingresado
                  </td>
                </tr>
              ) : (
                filteredHouses.map((h) => {
                  const isCurrentSelected = h.id === currentHouse.id;
                  const totalAdeudo = h.maintenanceBill.totalAPagar + h.waterBill.totalAPagar;

                  return (
                    <tr
                      key={h.id}
                      onClick={() => onSelectHouse(h.id)}
                      className={`cursor-pointer transition-colors ${
                        isCurrentSelected
                          ? 'bg-blue-50/80 font-medium'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Casa */}
                      <td className="py-2.5 px-3 font-black text-slate-900 text-sm">
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 font-mono">
                          {h.numeroCasa}
                        </span>
                      </td>

                      {/* Titular */}
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{h.titular}</div>
                        <div className="text-[10px] text-slate-600 font-mono">
                          Tel: {h.telefono} • Medidor: {h.medidor}
                        </div>
                      </td>

                      {/* Mtto Total */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ${h.maintenanceBill.totalAPagar.toFixed(2)}
                      </td>

                      {/* Tag Switch */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => handleToggleTag(h, e)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                            h.tagVehicularActivo
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                          title="Haga clic para cambiar estatus de apertura vehicular"
                        >
                          {h.tagVehicularActivo ? 'Activo' : 'Bloqueado'}
                        </button>
                      </td>

                      {/* Consumo m3 */}
                      <td className="py-2.5 px-3 text-right font-mono text-sky-900 font-semibold">
                        {h.waterBill.consumoM3} m³
                      </td>

                      {/* Agua Total */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-900 font-bold">
                        ${h.waterBill.totalAPagar.toFixed(2)}
                      </td>

                      {/* Toma Switch */}
                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={(e) => handleToggleAgua(h, e)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition ${
                            h.servicioAguaActivo
                              ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          }`}
                          title="Haga clic para cambiar estatus de toma hidráulica"
                        >
                          {h.servicioAguaActivo ? 'Conectada' : 'Cortada'}
                        </button>
                      </td>

                      {/* Adeudo Total */}
                      <td className="py-2.5 px-3 text-right font-mono font-extrabold text-blue-950">
                        ${totalAdeudo.toFixed(2)}
                      </td>

                      {/* Acciones */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectHouse(h.id);
                            }}
                            className="p-1 rounded hover:bg-slate-200 text-slate-700"
                            title="Ver estados de cuenta de esta casa"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => handleDownloadSingleExcel(h, e)}
                            className="p-1 rounded hover:bg-emerald-100 text-emerald-700"
                            title="Descargar Excel individual de esta casa"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-700">
          <span>Mostrando <strong>{filteredHouses.length}</strong> de 117 casas registradas</span>
          <button
            onClick={onResetAll}
            className="flex items-center gap-1 text-[11px] text-slate-700 hover:text-red-700 font-semibold"
            title="Restablecer base de datos inicial a valores de muestra originales"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Restablecer Datos Demo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

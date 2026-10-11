import React from 'react';
import { House, UserSession, MaintenanceReport, AssemblyMinute } from '../types/condo';
import { CONDO_INFO } from '../data/mockDatabase';
import {
  Home,
  Droplet,
  Wrench,
  Car,
  Droplets,
  Calendar,
  CreditCard,
  FileSpreadsheet,
  Printer,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  AlertTriangle,
} from 'lucide-react';

interface OverviewSectionProps {
  house: House;
  session: UserSession;
  reports: MaintenanceReport[];
  minutes: AssemblyMinute[];
  onNavigateTab: (tab: string) => void;
  onExportExcel: () => void;
  onOpenPaymentModal: (type: 'Agua' | 'Mantenimiento') => void;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  house,
  session,
  reports,
  minutes,
  onNavigateTab,
  onExportExcel,
  onOpenPaymentModal,
}) => {
  const [copiedClabe, setCopiedClabe] = React.useState(false);
  const [copiedAccount, setCopiedAccount] = React.useState(false);

  const handleCopyClabe = () => {
    navigator.clipboard.writeText(CONDO_INFO.clabe.replace(/\s+/g, ''));
    setCopiedClabe(true);
    setTimeout(() => setCopiedClabe(false), 2000);
  };

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(CONDO_INFO.cuenta.replace(/\s+/g, ''));
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const myReports = reports.filter((r) => r.casaId === house.id);
  const latestReport = myReports[0];
  const latestMinute = minutes[0];

  const totalGeneral = Number(
    (house.waterBill.totalAPagar + house.maintenanceBill.totalAPagar).toFixed(2)
  );

  return (
    <div className="space-y-6">
      {/* Welcome Hero Card */}
      <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-5 sm:p-7 text-white shadow-lg ring-1 ring-white/10 relative overflow-hidden">
        {/* Background Decorative Crest Outline */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 pointer-events-none rounded-full bg-white" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                Casa {house.numeroCasa}
              </span>
              <span className="text-xs text-blue-200">
                {CONDO_INFO.nombre}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1.5">
              {house.titular}
            </h2>

            <p className="text-xs text-slate-300 mt-0.5">
              {CONDO_INFO.direccion} • Medidor: <strong className="text-white font-mono">{house.medidor}</strong>
            </p>
          </div>

          {/* Quick Balance Counter */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 min-w-[200px] text-left md:text-right">
            <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wide block">
              Total Acumulado del Mes
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-300 mt-0.5">
              ${totalGeneral.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-blue-200 mt-1 flex items-center md:justify-end gap-1">
              <span>Agua (${house.waterBill.totalAPagar.toFixed(2)}) + Mtto (${house.maintenanceBill.totalAPagar.toFixed(2)})</span>
            </div>
          </div>
        </div>

        {/* Action Row */}
        <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('agua')}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-400/30 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <Droplet className="w-3.5 h-3.5 text-sky-400" />
            <span>Recibo de Agua</span>
          </button>

          <button
            onClick={() => onNavigateTab('mantenimiento')}
            className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Informativo Mantenimiento</span>
          </button>

          <button
            onClick={onExportExcel}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Descargar Excel Casa</span>
          </button>
        </div>
      </div>

      {/* Two Main Cards: Agua & Mantenimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* ================= AGUA CARD ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <Droplet className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-sky-800">
                    Sección de Agua
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Recibo {house.waterBill.periodo}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                {house.waterBill.folio}
              </span>
            </div>

            {/* Numbers */}
            <div className="mt-4 grid grid-cols-2 gap-3 bg-sky-50/40 p-3.5 rounded-2xl border border-sky-100">
              <div>
                <span className="block text-[10px] font-bold text-slate-700 uppercase">Consumo del Periodo</span>
                <span className="text-xl font-black text-sky-900">{house.waterBill.consumoM3} m³</span>
                <span className="block text-[10px] text-slate-700">Lecturas {house.waterBill.lecturaAnterior} → {house.waterBill.lecturaActual}</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-700 uppercase">Total a Pagar</span>
                <span className="text-xl font-black text-slate-900">${house.waterBill.totalAPagar.toFixed(2)}</span>
                <span className="block text-[10px] text-emerald-700 font-medium">Tarifa oficial CEA</span>
              </div>
            </div>

            <div className="mt-3 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Fecha límite de pago:</span>
                <strong className="text-slate-900 capitalize">{house.waterBill.fechaLimitePago}</strong>
              </div>
              <div className="flex justify-between">
                <span>Servicio de administración:</span>
                <span>${house.waterBill.servicioAdministracion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estatus de servicio:</span>
                <span className="font-semibold text-sky-700">Conectado y sin corte</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onOpenPaymentModal('Agua')}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pagar Agua</span>
            </button>

            <button
              onClick={() => onNavigateTab('agua')}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>Ver Recibo Completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= MANTENIMIENTO CARD ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Wrench className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-900">
                    Sección Mantenimiento
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Informativo {house.maintenanceBill.periodo}
                  </h3>
                </div>
              </div>

              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                Cuota: ${house.maintenanceBill.cuotaVigente.toFixed(2)}
              </span>
            </div>

            {/* Numbers */}
            <div className="mt-4 grid grid-cols-2 gap-3 bg-amber-50/40 p-3.5 rounded-2xl border border-amber-100">
              <div>
                <span className="block text-[10px] font-bold text-slate-700 uppercase">Total a Pagar</span>
                <span className="text-xl font-black text-slate-900">${house.maintenanceBill.totalAPagar.toFixed(2)}</span>
                <span className="block text-[10px] text-slate-700">Aplica hasta día 10</span>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-700 uppercase">Capital Pendiente</span>
                <span
                  className={`text-xl font-black ${
                    house.maintenanceBill.capitalPendiente < 0 ? 'text-emerald-700' : 'text-slate-900'
                  }`}
                >
                  ${house.maintenanceBill.capitalPendiente.toFixed(2)}
                </span>
                <span className="block text-[10px] text-emerald-700 font-medium">
                  {house.maintenanceBill.capitalPendiente < 0 ? 'Saldo a favor' : 'Al corriente'}
                </span>
              </div>
            </div>

            <div className="mt-3 text-xs space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Fecha límite sin recargo:</span>
                <strong className="text-slate-900">{house.maintenanceBill.fechaLimite}</strong>
              </div>
              <div className="flex justify-between">
                <span>Interés moratorio mensual:</span>
                <span className="text-red-700 font-semibold">8% sobre capital vencido</span>
              </div>
              <div className="flex justify-between">
                <span>Control vehicular remoto:</span>
                <span className={`font-semibold ${house.tagVehicularActivo ? 'text-emerald-700' : 'text-red-700'}`}>
                  {house.tagVehicularActivo ? 'Habilitado' : 'Restringido (≥ 2 cuotas)'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => onOpenPaymentModal('Mantenimiento')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1 active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pagar Mantenimiento</span>
            </button>

            <button
              onClick={() => onNavigateTab('mantenimiento')}
              className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1"
            >
              <span>Ver Informativo y Mora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Service Status & BanBajio SPEI Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* BanBajio Banking Info Box */}
        <div className="bg-white rounded-3xl border border-blue-200 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-900">
                <CreditCard className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900">
                  Depósitos y SPEI
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  Cuenta Oficial BanBajio
                </h4>
              </div>
            </div>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              BanBajio
            </span>
          </div>

          <div className="mt-3.5 space-y-2.5 text-xs">
            <p className="font-bold text-slate-900">{CONDO_INFO.nombre}</p>

            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>
                <span className="block text-[10px] text-slate-700 font-bold uppercase">CLABE Interbancaria</span>
                <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">{CONDO_INFO.clabe}</span>
              </div>
              <button
                onClick={handleCopyClabe}
                className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold flex items-center gap-1"
              >
                {copiedClabe ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedClabe ? 'Copiada' : 'Copiar'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div>
                <span className="block text-[10px] text-slate-700 font-bold uppercase">Número de Cuenta</span>
                <span className="font-mono font-black text-slate-900 text-xs sm:text-sm">{CONDO_INFO.cuenta}</span>
              </div>
              <button
                onClick={handleCopyAccount}
                className="px-2.5 py-1 text-xs rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-semibold flex items-center gap-1"
              >
                {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copiedAccount ? 'Copiada' : 'Copiar'}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-600 pt-1 leading-relaxed">
              <strong>Referencia:</strong> Incluye tu número de casa <strong>({house.numeroCasa})</strong> en el concepto y envía tu comprobante a <strong>{CONDO_INFO.email}</strong> o WhatsApp al <strong>{CONDO_INFO.whatsapp}</strong>.
            </p>
          </div>
        </div>

        {/* Live Reports & Community Minutes Widget */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Atención en Tiempo Real
                  </span>
                  <h4 className="text-sm font-black text-slate-900">
                    Reportes e Incidencias
                  </h4>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('reportes')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Ver todos
              </button>
            </div>

            {latestReport ? (
              <div className="mt-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">
                    {latestReport.titulo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    {latestReport.estado}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2">
                  {latestReport.descripcion}
                </p>
                {latestReport.respuestaAdmin && (
                  <div className="text-[11px] text-blue-900 font-medium pt-1 border-t border-slate-200">
                    Admin: "{latestReport.respuestaAdmin}"
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-700 mt-4">
                No tienes reportes activos para la Casa {house.numeroCasa}.
              </p>
            )}

            {/* Latest Assembly Minute */}
            {latestMinute && (
              <div className="mt-3 p-3 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                <div className="flex items-center justify-between text-[10px] text-purple-900 font-bold uppercase">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    <span>Última Minuta: {latestMinute.titulo}</span>
                  </span>
                  <span>{latestMinute.fecha}</span>
                </div>
                <p className="text-[11px] text-slate-700 line-clamp-2">
                  {latestMinute.resumen}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('reportes')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Crear Reporte de Mantenimiento</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => onNavigateTab('comunidad')}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1"
            >
              <span>Ver Minutas</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

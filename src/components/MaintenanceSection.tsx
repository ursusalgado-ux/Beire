import React, { useState } from 'react';
import { House, UserSession } from '../types/condo';
import { CONDO_INFO } from '../data/mockDatabase';
import {
  Wrench,
  FileSpreadsheet,
  Printer,
  CreditCard,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Car,
  Droplets,
  Calendar,
  Table,
  Info,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

interface MaintenanceSectionProps {
  house: House;
  session: UserSession;
  onExportExcel: () => void;
  onOpenPaymentModal: (type: 'Mantenimiento') => void;
  onUpdateHouse?: (house: House) => void;
}

export const MaintenanceSection: React.FC<MaintenanceSectionProps> = ({
  house,
  session,
  onExportExcel,
  onOpenPaymentModal,
  onUpdateHouse,
}) => {
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [showFullLedger, setShowFullLedger] = useState(false);

  const bill = house.maintenanceBill;

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

  // Toggle Tag vehicular por parte del admin
  const handleToggleTag = () => {
    if (!onUpdateHouse || session.role !== 'admin') return;
    const updated: House = {
      ...house,
      tagVehicularActivo: !house.tagVehicularActivo,
      maintenanceBill: {
        ...bill,
        tagVehicularRestringido: house.tagVehicularActivo,
      },
    };
    onUpdateHouse(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Wrench className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Sección de Mantenimiento y Cuotas
              </h2>
              <p className="text-xs text-slate-700">
                Informativo mensual oficial de la Casa {house.numeroCasa} • Cuota ordinaria y cálculo de mora 8%
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Informativo</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Descargar Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => onOpenPaymentModal('Mantenimiento')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 shadow-sm transition active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Reportar Pago</span>
          </button>

          {session.role === 'admin' && (
            <button
              onClick={handleToggleTag}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                house.tagVehicularActivo
                  ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>{house.tagVehicularActivo ? 'Restringir Tag' : 'Habilitar Tag'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Reglas de Semáforo de Restricción */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Regla Tag Vehicular */}
        <div
          className={`rounded-2xl p-4 border transition-all ${
            house.tagVehicularActivo
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-red-50 border-red-300 ring-2 ring-red-400'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`p-2 rounded-xl ${
                  house.tagVehicularActivo
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                <Car className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Acceso Automatizado Vehicular
                </span>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {house.tagVehicularActivo ? 'Tag Activo en Portón' : 'Tag Restringido / Bloqueado'}
                </h4>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                house.tagVehicularActivo
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {house.tagVehicularActivo ? 'Habilitado' : 'Suspendido'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Acuerdo de asamblea: A partir de <strong>2 cuotas de mantenimiento vencidas</strong> o 1 extraordinaria, se restringe la apertura automática por control remoto.
          </p>
        </div>

        {/* Regla Servicio Hidráulico */}
        <div
          className={`rounded-2xl p-4 border transition-all ${
            house.servicioAguaActivo
              ? 'bg-sky-50/60 border-sky-200'
              : 'bg-purple-50 border-purple-300 ring-2 ring-purple-400'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span
                className={`p-2 rounded-xl ${
                  house.servicioAguaActivo
                    ? 'bg-sky-100 text-sky-700'
                    : 'bg-purple-100 text-purple-700'
                }`}
              >
                <Droplets className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Servicio Hidráulico Domiciliar
                </span>
                <h4 className="text-sm font-extrabold text-slate-900">
                  {house.servicioAguaActivo ? 'Toma Conectada' : 'Restricción Hidráulica'}
                </h4>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                house.servicioAguaActivo
                  ? 'bg-sky-100 text-sky-800'
                  : 'bg-purple-100 text-purple-800'
              }`}
            >
              {house.servicioAguaActivo ? 'Normal' : 'Suspendido'}
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Acuerdo de asamblea: A partir de <strong>6 cuotas de mantenimiento vencidas</strong>, se restringe el paso a la casa (toma general disponible) + <strong>${CONDO_INFO.costoReconexion.toFixed(2)} por reconexión</strong>.
          </p>
        </div>
      </div>

      {/* ============================================================== */}
      {/* INFORMATIVO MANTENIMIENTO (Diseño fiel al PDF original)       */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden print:border-none print:shadow-none">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b-2 border-slate-200 bg-gradient-to-r from-amber-50/40 via-white to-slate-50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-2 flex items-center justify-center text-amber-400 font-bold text-xl shadow-md border border-amber-400/40">
                BEIRE
              </div>
              <div>
                <span className="text-xs font-extrabold tracking-wider text-amber-900 uppercase">
                  INFORMATIVO MANTENIMIENTO {bill.periodo}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Asociación de Condóminos BEIRE A.C.
                </h3>
                <p className="text-xs text-slate-700">
                  Av. Puente de la Reina No. 2042, Frac. Puerta Navarra, CP 76116, Querétaro, Qro.
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-700">CUOTA VIGENTE:</span>
                  <span className="text-xs font-black text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                    ${bill.cuotaVigente.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Casa & Titular */}
            <div className="text-left md:text-right bg-white p-3 rounded-xl border border-slate-200 shadow-2xs min-w-[200px]">
              <div className="flex items-center justify-between md:justify-end gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {bill.periodo}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200">
                  {house.numeroCasa}
                </span>
              </div>
              <p className="text-[10px] text-slate-700 uppercase mt-1">Casa / Interior</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">{house.titular}</p>
              <p className="text-[10px] text-slate-700">Titular Registrado</p>
            </div>
          </div>
        </div>

        {/* Total a Pagar Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-slate-200 bg-slate-900 text-white divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="p-4 sm:p-5 flex flex-col justify-center">
            <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">
              TOTAL A PAGAR:
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
              ${bill.totalAPagar.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-amber-200 uppercase mt-1 font-medium tracking-wide">
              {bill.totalLetra}
            </p>
          </div>

          <div className="p-4 sm:p-5 flex flex-col justify-center bg-slate-800/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
              ESTA CANTIDAD APLICA HASTA EL DÍA {CONDO_INFO.diaLimiteMantenimiento} DEL MES VIGENTE
            </span>
            <p className="text-xs text-slate-300 mt-1">
              Los pagos posteriores generan un <strong>8% de interés moratorio mensual</strong> sobre el capital total vencido (Código Civil de Querétaro).
            </p>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Capital pendiente actual:</span>
              <span
                className={`font-mono font-bold ${
                  bill.capitalPendiente < 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                ${bill.capitalPendiente.toFixed(2)} {bill.capitalPendiente < 0 && '(Saldo a favor deducido)'}
              </span>
            </div>
          </div>
        </div>

        {/* Desglose: Resumen Mes Anterior vs Cálculo Saldo Nuevo */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b-2 border-slate-200">
          {/* Resumen Mes Anterior */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">
                RESUMEN MES ANTERIOR {bill.mesAnteriorNombre}
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                Periodo Previo
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Capital anterior + cuota:</span>
                <span className="font-mono font-medium">${bill.capitalAnteriorMasCuota.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Intereses anterior:</span>
                <span className="font-mono font-medium">${bill.interesesAnterior.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold">
                <span>Total a pagar mes anterior:</span>
                <span className="font-mono">${bill.totalAPagarMesAnterior.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-100">
                <span>Su pago:</span>
                <span className="font-mono">${bill.suPagoMesAnterior.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 text-[11px]">
                <span>Fecha de pago:</span>
                <span className="font-mono">{bill.fechaPagoMesAnterior || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Cálculo Saldo Nuevo */}
          <div className="p-4 sm:p-6 space-y-3 bg-amber-50/20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                CÁLCULO SALDO NUEVO {bill.periodo}
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 font-bold text-amber-900">
                Mes Vigente
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Cuota vigente incluyendo otros conceptos:</span>
                <span className="font-mono font-bold text-slate-900">${bill.cuotaVigente.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Capital pendiente (saldo anterior restante):</span>
                <span className={`font-mono font-semibold ${bill.capitalPendiente < 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                  ${bill.capitalPendiente.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Intereses actualizados (8% moratorio):</span>
                <span className="font-mono font-medium">${bill.interesesActualizados.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-black text-slate-900">
                <span>Total del mes:</span>
                <span className="font-mono text-sm text-amber-900">${bill.totalDelMes.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Marco Legal & Asamblea (Texto Exacto del Recibo Escaneado) */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b-2 border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs text-xs space-y-2">
            <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-700" />
              <span>Conforme a los Acuerdos de Asamblea</span>
            </h5>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Los pagos que se realicen después del día 10 de cada mes generan un <strong>8% de interés moratorio</strong>, mensualmente mientras dure el adeudo. Este interés se calcula sobre el capital total vencido.
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              De acuerdo al Código Civil del Estado de Querétaro, cualquier cantidad que se pague mientras exista un adeudo, se aplicará primeramente a intereses y en caso de sobrar dinero, se aplicará al capital más antiguo; no puede aplicarse un pago a una cuota vigente mientras existan adeudos.
            </p>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              La única manera de detener la generación de intereses moratorios sin pagar la totalidad del deudo, es firmar por escrito un convenio de pagos con la administración, firmar un pagaré y realizar el primer pago.
            </p>
          </div>

          {/* BanBajio Card & Restricción Warnings */}
          <div className="space-y-3">
            <div className="rounded-xl border border-blue-200 bg-white p-3.5 shadow-xs text-xs">
              <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wide">
                NUEVA CUENTA BANBAJIO PARA PAGO
              </span>
              <p className="font-bold text-slate-900 mt-0.5">{CONDO_INFO.nombre}</p>
              <div className="flex items-center justify-between text-xs mt-1.5 bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="font-mono">CLABE: <strong>{CONDO_INFO.clabe}</strong></span>
                <button
                  onClick={handleCopyClabe}
                  className="text-[10px] text-blue-700 font-bold hover:underline"
                >
                  {copiedClabe ? 'Copiada' : 'Copiar'}
                </button>
              </div>
              <p className="text-[10px] text-slate-700 mt-1.5">
                Referencía con el <strong>número de casa ({house.numeroCasa})</strong> y envía imagen a <strong>{CONDO_INFO.email}</strong> o WhatsApp al <strong>{CONDO_INFO.whatsapp}</strong>.
              </p>
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-900 space-y-1">
              <p>
                <strong>Reglas de restricción:</strong> 2 cuotas vencidas restringen controles remotos vehiculares. 6 cuotas vencidas restringen el servicio hidráulico (+ $200.00 reconexión en 24 a 48 hrs).
              </p>
              <p className="text-[10px] text-amber-800 italic">
                Si al recibir este recibo ya realizó un pago en este mes que cubra esta cantidad, haga caso omiso o pague solo la diferencia.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 text-center text-[11px] text-slate-700 font-medium border-b border-slate-200">
          Administrado por {CONDO_INFO.administrador}
        </div>

        {/* ============================================================== */}
        {/* ESTADO DE CUENTA DETALLADO POR MES (TABLA TIPO EXCEL COMPLETO) */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Table className="w-5 h-5 text-amber-700" />
                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                  Estado de Cuenta Histórico Mensual Detallado
                </h4>
              </div>
              <p className="text-xs text-slate-700">
                Registro financiero mes a mes idéntico al libro de Excel oficial del condominio
              </p>
            </div>

            <button
              onClick={() => setShowFullLedger(!showFullLedger)}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1"
            >
              <span>{showFullLedger ? 'Ver solo periodos recientes' : 'Ver todos los periodos históricos'}</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-[11px] border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[9px] tracking-wider whitespace-nowrap">
                  <th className="py-2 px-2.5">MES</th>
                  <th className="py-2 px-2.5 text-right">CUOTA</th>
                  <th className="py-2 px-2.5 text-right">PAGOS EN TIEMPO</th>
                  <th className="py-2 px-2.5 text-center">FECHAS</th>
                  <th className="py-2 px-2.5 text-right">CAP. VENCIDO</th>
                  <th className="py-2 px-2.5 text-right">CAP. TOTAL</th>
                  <th className="py-2 px-2.5 text-right">INTERÉS 8%</th>
                  <th className="py-2 px-2.5 text-right">SUMA INT.</th>
                  <th className="py-2 px-2.5 text-right">SALDO PARCIAL</th>
                  <th className="py-2 px-2.5 text-right">PAGO EXTEMP.</th>
                  <th className="py-2 px-2.5 text-right">INT. REMAN.</th>
                  <th className="py-2 px-2.5 text-right">CAP. REMAN.</th>
                  <th className="py-2 px-2.5 text-right">SALDO</th>
                  <th className="py-2 px-2.5 text-left">NOTAS Y ACUERDOS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {(showFullLedger ? bill.ledger : bill.ledger.slice(-6)).map((row, idx) => {
                  const isCurrent = row.mes.includes('2026 OCTUBRE');

                  return (
                    <tr
                      key={idx}
                      className={`${
                        isCurrent
                          ? 'bg-amber-50/80 font-bold'
                          : row.nota
                          ? 'bg-blue-50/40'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-2.5 font-semibold text-slate-900 whitespace-nowrap">{row.mes}</td>
                      <td className="py-2 px-2.5 text-right font-mono">${row.cuota.toFixed(2)}</td>
                      <td className="py-2 px-2.5 text-right font-mono text-emerald-700">
                        ${row.pagosEnTiempo.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-center font-mono text-[10px] text-slate-600 whitespace-nowrap">
                        {row.fechasPago || '-'}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-700">
                        ${row.capitalVencidoMes.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-slate-700">
                        ${row.capitalTotalVencido.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-red-700">
                        ${row.interesMes.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono text-red-800">
                        ${row.sumaIntereses.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono">${row.saldoParcial.toFixed(2)}</td>
                      <td className="py-2 px-2.5 text-right font-mono text-emerald-700">
                        ${row.pagosExtemporaneos.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-right font-mono">${row.interesesRemanentes.toFixed(2)}</td>
                      <td className="py-2 px-2.5 text-right font-mono">${row.capitalRemanente.toFixed(2)}</td>
                      <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                        ${row.saldo.toFixed(2)}
                      </td>
                      <td className="py-2 px-2.5 text-xs text-blue-900 font-medium">
                        {row.nota && (
                          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {row.nota}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { House, UserSession } from '../types/condo';
import { CONDO_INFO } from '../data/mockDatabase';
import {
  Droplet,
  FileSpreadsheet,
  Printer,
  CreditCard,
  Copy,
  Check,
  Calendar,
  Gauge,
  AlertTriangle,
  History,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Info,
} from 'lucide-react';

interface WaterSectionProps {
  house: House;
  session: UserSession;
  onExportExcel: () => void;
  onOpenPaymentModal: (type: 'Agua') => void;
  onUpdateHouse?: (house: House) => void;
}

export const WaterSection: React.FC<WaterSectionProps> = ({
  house,
  session,
  onExportExcel,
  onOpenPaymentModal,
  onUpdateHouse,
}) => {
  const [copiedClabe, setCopiedClabe] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [isEditingReading, setIsEditingReading] = useState(false);
  const [newReading, setNewReading] = useState(house.waterBill.lecturaActual.toString());

  const bill = house.waterBill;

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

  const handleSaveReading = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateHouse) return;
    const act = parseFloat(newReading);
    if (isNaN(act) || act < bill.lecturaAnterior) {
      alert('La lectura actual no puede ser menor a la lectura anterior');
      return;
    }
    const m3 = act - bill.lecturaAnterior;
    const costoM3 = Number((m3 * 33.894).toFixed(2));
    const totalPeriodo = Number((costoM3 + bill.servicioAdministracion + bill.reconexion).toFixed(2));
    const totalPagar = Number((totalPeriodo + bill.periodoAnteriorPendiente).toFixed(2));

    const updated: House = {
      ...house,
      waterBill: {
        ...bill,
        lecturaActual: act,
        consumoM3: m3,
        consumoPeriodoMonto: costoM3,
        totalPeriodoActual: totalPeriodo,
        totalAPagar: totalPagar,
        fechaLecturaActual: new Date().toLocaleDateString('es-MX'),
      },
    };

    onUpdateHouse(updated);
    setIsEditingReading(false);
  };

  // Encontrar el valor máximo de consumo para escalar la gráfica
  const maxM3 = Math.max(...bill.historico12Meses.map((h) => h.consumoM3), 12);

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
              <Droplet className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Sección de Agua y Alcantarillado
              </h2>
              <p className="text-xs text-slate-700">
                Recibo oficial informativo de la Casa {house.numeroCasa} • Tarifa vigente CEA Querétaro
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
            <span>Imprimir Recibo</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Descargar Excel (.xlsx)</span>
          </button>

          <button
            onClick={() => onOpenPaymentModal('Agua')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 shadow-sm transition active:scale-95"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Reportar Pago</span>
          </button>

          {session.role === 'admin' && (
            <button
              onClick={() => setIsEditingReading(!isEditingReading)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition"
            >
              <Gauge className="w-3.5 h-3.5" />
              <span>{isEditingReading ? 'Cancelar Edición' : 'Capturar Lectura'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Quick Reading Editor */}
      {isEditingReading && session.role === 'admin' && (
        <form
          onSubmit={handleSaveReading}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in"
        >
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-900">
                Captura de Medidor para Casa {house.numeroCasa}
              </p>
              <p className="text-[11px] text-amber-700">
                Lectura Anterior: {bill.lecturaAnterior} m3 ({bill.fechaLecturaAnterior})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="number"
              step="1"
              value={newReading}
              onChange={(e) => setNewReading(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-amber-300 bg-white w-32 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              placeholder="Lectura Actual"
              required
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700"
            >
              Guardar y Recalcular
            </button>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* RECIBO OFICIAL DE AGUA (Diseño idéntico a la plantilla escaneada) */}
      {/* ============================================================== */}
      <div className="bg-white rounded-2xl border-2 border-slate-300 shadow-md overflow-hidden print:border-none print:shadow-none">
        {/* Recibo Header */}
        <div className="p-4 sm:p-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-50 via-white to-sky-50/30">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 p-2 flex items-center justify-center text-amber-400 font-bold text-xl shadow-md border border-amber-400/40">
                BEIRE
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Asociación de Condóminos Beire A.C.
                </h3>
                <p className="text-xs text-slate-700">
                  Av. Puente de la Reina No. 2042 • Querétaro, Qro.
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-slate-700">FOLIO:</span>
                  <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {bill.folio}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] font-bold text-slate-700">MEDIDOR:</span>
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {bill.medidor}
                  </span>
                </div>
              </div>
            </div>

            {/* Casa Badge & Periodo */}
            <div className="text-left md:text-right bg-white p-3 rounded-xl border border-slate-200 shadow-2xs min-w-[200px]">
              <div className="flex items-center justify-between md:justify-end gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {bill.periodo}
                </span>
                <span className="text-xl sm:text-2xl font-black text-blue-900 px-2 py-0.5 rounded-lg bg-blue-50 border border-blue-200">
                  {house.numeroCasa}
                </span>
              </div>
              <p className="text-[10px] text-slate-700 uppercase mt-1">
                Casa / Interior
              </p>
              <p className="text-xs font-bold text-slate-900 mt-0.5 truncate">
                {house.titular}
              </p>
              <p className="text-[10px] text-slate-700">Titular de la Propiedad</p>
            </div>
          </div>
        </div>

        {/* Total a Pagar Big Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b-2 border-slate-200 bg-sky-950 text-white divide-y md:divide-y-0 md:divide-x divide-sky-900">
          <div className="p-4 sm:p-5 flex flex-col justify-center">
            <span className="text-[11px] font-bold tracking-wider text-sky-300 uppercase">
              TOTAL A PAGAR:
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-1">
              ${bill.totalAPagar.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-[10px] text-sky-200 uppercase mt-1 font-medium tracking-wide">
              {bill.totalLetra}
            </p>
          </div>

          <div className="p-4 sm:p-5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-sky-300 text-xs font-bold uppercase">
              <Calendar className="w-3.5 h-3.5" />
              <span>FECHA LÍMITE DE PAGO:</span>
            </div>
            <p className="text-sm sm:text-base font-extrabold text-white mt-1 capitalize">
              {bill.fechaLimitePago}
            </p>
            <p className="text-[11px] text-sky-200 mt-1">
              {bill.mesesSinPago > 0 ? (
                <span className="text-amber-300 font-bold">
                  Meses sin pago: {bill.mesesSinPago} (Riesgo de corte)
                </span>
              ) : (
                <span className="text-emerald-300 font-medium">
                  Cuenta al corriente • Sin meses de mora
                </span>
              )}
            </p>
          </div>

          <div className="p-4 sm:p-5 flex flex-col justify-center bg-sky-900/60">
            <span className="text-[11px] font-bold tracking-wider text-sky-300 uppercase">
              CONSUMO REGISTRADO
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-black text-amber-300">
                {bill.consumoM3}
              </span>
              <span className="text-sm font-bold text-sky-200">m³ consumidos</span>
            </div>
            <p className="text-[11px] text-sky-200 mt-1">
              Lectura Ant: {bill.lecturaAnterior} → Act: {bill.lecturaActual} ({bill.diasTranscurridos} días)
            </p>
          </div>
        </div>

        {/* Lecturas y Fechas Bar */}
        <div className="p-3 sm:p-4 bg-slate-100 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="block text-[10px] font-bold text-slate-700 uppercase">Lectura Anterior</span>
            <span className="font-extrabold text-slate-800 text-sm">{bill.lecturaAnterior} m³</span>
            <span className="block text-[10px] text-slate-700">{bill.fechaLecturaAnterior}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-700 uppercase">Lectura Actual</span>
            <span className="font-extrabold text-slate-800 text-sm">{bill.lecturaActual} m³</span>
            <span className="block text-[10px] text-slate-700">{bill.fechaLecturaActual}</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-700 uppercase">Días Transcurridos</span>
            <span className="font-extrabold text-slate-800 text-sm">{bill.diasTranscurridos} días</span>
            <span className="block text-[10px] text-slate-700">Periodo ordinario</span>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-slate-700 uppercase">Restricción Servicio</span>
            <span className="font-extrabold text-slate-800 text-sm">
              {bill.restriccionAPartirDe ? bill.restriccionAPartirDe : 'No Aplica'}
            </span>
            <span className="block text-[10px] text-slate-700">Sin corte activo</span>
          </div>
        </div>

        {/* Desglose: Periodo Anterior vs Periodo Actual */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 border-b-2 border-slate-200">
          {/* Periodo Anterior */}
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                PERIODO ANTERIOR ({bill.periodoAnteriorNombre})
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                Histórico
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total a pagar anterior:</span>
                <span className="font-mono font-medium">${bill.periodoAnteriorTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Su pago anterior:</span>
                <span className="font-mono">-${bill.periodoAnteriorPago.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700 text-[11px]">
                <span>Fecha de pago anterior:</span>
                <span className="font-mono">{bill.periodoAnteriorFechaPago || 'No registrado'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Saldo pendiente:</span>
                <span className="font-mono font-medium">${bill.periodoAnteriorSaldo.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recargos por extemporáneo:</span>
                <span className="font-mono font-medium">${bill.periodoAnteriorRecargos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span>Total pendiente arrastrado:</span>
                <span className="font-mono text-sm text-blue-900">${bill.periodoAnteriorPendiente.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Periodo Actual */}
          <div className="p-4 sm:p-6 space-y-3 bg-sky-50/20">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                PERIODO ACTUAL ({bill.periodo})
              </h4>
              <span className="text-[11px] px-2 py-0.5 rounded bg-sky-100 font-bold text-sky-800">
                {bill.consumoM3} m³ Facturados
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-700">
                <span>Consumo del periodo (CEA / alcantarillado):</span>
                <span className="font-mono font-bold text-slate-900">${bill.consumoPeriodoMonto.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Fondo de reserva:</span>
                <span className="font-mono">${bill.fondoReserva.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Servicio de administración:</span>
                <span className="font-mono font-semibold">${bill.servicioAdministracion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Reconexión de servicio:</span>
                <span className="font-mono">${bill.reconexion.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Multas aplicables:</span>
                <span className="font-mono">${bill.multas.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Descuentos autorizados:</span>
                <span className="font-mono">-${bill.descuentos.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span>Total del periodo actual:</span>
                <span className="font-mono text-sm text-sky-900">${bill.totalPeriodoActual.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Banking Info Box (BanBajio) & Legal Notes */}
        <div className="p-4 sm:p-6 bg-slate-50 border-b-2 border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* BanBajio Card */}
          <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-blue-100">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                NUEVA CUENTA BANCARIA PARA PAGO EN BANBAJIO
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                Oficial
              </span>
            </div>

            <div className="mt-3 space-y-2 text-xs">
              <p className="font-bold text-slate-900">{CONDO_INFO.nombre}</p>

              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div>
                  <span className="block text-[10px] text-slate-700 font-semibold uppercase">Cuenta</span>
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{CONDO_INFO.cuenta}</span>
                </div>
                <button
                  onClick={handleCopyAccount}
                  className="px-2 py-1 text-[11px] rounded bg-white border border-slate-300 hover:bg-slate-100 font-medium flex items-center gap-1"
                >
                  {copiedAccount ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-600" />}
                  <span>{copiedAccount ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                <div>
                  <span className="block text-[10px] text-slate-700 font-semibold uppercase">CLABE Interbancaria</span>
                  <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{CONDO_INFO.clabe}</span>
                </div>
                <button
                  onClick={handleCopyClabe}
                  className="px-2 py-1 text-[11px] rounded bg-white border border-slate-300 hover:bg-slate-100 font-medium flex items-center gap-1"
                >
                  {copiedClabe ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-600" />}
                  <span>{copiedClabe ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-600 pt-1">
                <strong>Importante:</strong> Referencía tus pagos con el <strong>número de tu casa ({house.numeroCasa})</strong> y envía comprobante a <strong>{CONDO_INFO.email}</strong> o WhatsApp al <strong>{CONDO_INFO.whatsapp}</strong>.
              </p>
            </div>
          </div>

          {/* Legal Disclaimers & Reconexion Rules */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs text-slate-700 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Condiciones del Servicio y Reconexión</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Pague antes de la fecha límite. Este recibo es informativo y carece de validez fiscal. Guarde sus comprobantes de depósito.
              </p>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                En caso de restricción del servicio se cargarán <strong>${CONDO_INFO.costoReconexion.toFixed(2)} por reconexión</strong>, la cual tarda de 24 a 48 hrs después de reportar y validar el pago.
              </p>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                Mientras se regularice el pago, podrá usar la toma general del condominio sin realizar conexiones temporales ni mangueras hasta su domicilio particular.
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-amber-200/70 text-[10px] text-slate-700 italic">
              Este recibo es informativo, prevalecen los registros contables de la Administración del Condominio sobre el presente.
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* GRÁFICA INTERACTIVA Y TABLA DE HISTÓRICO DE LOS ÚLTIMOS 12 MESES */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-sky-700" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">
                Histórico Últimos 12 Meses y Mes Vigente
              </h4>
            </div>
            <span className="text-xs text-slate-700">
              Evolución de consumo en m³ de agua potable
            </span>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-2">
              <span>Consumo mensual (m³)</span>
              <span className="text-[11px] text-slate-600">Promedio: 10 m³/mes</span>
            </div>

            <div className="h-44 flex items-end gap-1.5 sm:gap-2.5 pt-6 pb-2 overflow-x-auto">
              {bill.historico12Meses.map((h, idx) => {
                const heightPercent = Math.round((h.consumoM3 / maxM3) * 100);
                const isCurrent = idx === bill.historico12Meses.length - 1;

                return (
                  <div key={idx} className="flex-1 min-w-[28px] sm:min-w-[40px] flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-700 mb-1 opacity-0 group-hover:opacity-100 transition sm:opacity-100">
                      {h.consumoM3}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        isCurrent
                          ? 'bg-amber-500 shadow-sm ring-2 ring-amber-300'
                          : h.consumoM3 > 10
                          ? 'bg-sky-600 hover:bg-sky-700'
                          : 'bg-sky-400 hover:bg-sky-500'
                      }`}
                      title={`${h.mes}: ${h.consumoM3} m³ ($${h.totalMes})`}
                    />
                    <span className="text-[9px] sm:text-[10px] text-slate-700 mt-1.5 truncate max-w-full text-center block">
                      {h.mes.split(' ')[1]?.slice(0, 3) || h.mes.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Table matching the PDF */}
          <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">MES</th>
                  <th className="py-2.5 px-3 text-center">CONSUMO m³</th>
                  <th className="py-2.5 px-3 text-right">TOTAL $ MES (1)</th>
                  <th className="py-2.5 px-3 text-right">ACUMULADO (2)</th>
                  <th className="py-2.5 px-3 text-right">SU PAGO</th>
                  <th className="py-2.5 px-3 text-center">FECHA PAGO</th>
                  <th className="py-2.5 px-3 text-right">REMANENTE (3)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {bill.historico12Meses.map((row, idx) => {
                  const isCurrent = idx === bill.historico12Meses.length - 1;
                  const isNegativeRemanente = row.remanente < 0;

                  return (
                    <tr
                      key={idx}
                      className={`${
                        isCurrent ? 'bg-sky-50/70 font-semibold' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2 px-3 font-medium text-slate-900">{row.mes}</td>
                      <td className="py-2 px-3 text-center font-bold text-sky-900">{row.consumoM3}</td>
                      <td className="py-2 px-3 text-right font-mono">${row.totalMes.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono">${row.acumulado.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono font-medium text-emerald-700">
                        {row.suPago > 0 ? `$${row.suPago.toFixed(2)}` : '$0.00'}
                      </td>
                      <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-600">
                        {row.fechaPago === '00/01/1900' || !row.fechaPago ? '-' : row.fechaPago}
                      </td>
                      <td
                        className={`py-2 px-3 text-right font-mono font-bold ${
                          isNegativeRemanente ? 'text-emerald-700' : 'text-slate-900'
                        }`}
                      >
                        ${row.remanente.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footnotes from the original PDF */}
          <div className="mt-3 text-[10px] text-slate-700 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <p><strong>1 Total correspondiente:</strong> a la tarifa oficial de la CEA vigente en el momento de la lectura más otros costos como reconexiones, multas, entre otros incluyendo descuentos.</p>
            <p><strong>2 El resultado de:</strong> Remanente del mes anterior más el Total del mes correspondiente.</p>
            <p><strong>3 El resultado de:</strong> lo acumulado menos su pago. Si resulta negativo, es saldo a favor.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { House, PaymentTransaction, UserSession } from '../types/condo';
import { CONDO_INFO } from '../data/mockDatabase';
import { CreditCard, CheckCircle2, Copy, Check, Upload, Calendar } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  houses: House[];
  currentHouse: House;
  session: UserSession;
  defaultType?: 'Agua' | 'Mantenimiento';
  onAddTransaction: (tx: PaymentTransaction) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  houses,
  currentHouse,
  session,
  defaultType = 'Mantenimiento',
  onAddTransaction,
}) => {
  const [tipo, setTipo] = useState<'Agua' | 'Mantenimiento'>(defaultType);
  const [selectedHouseId, setSelectedHouseId] = useState(currentHouse.id);
  const [monto, setMonto] = useState(
    defaultType === 'Agua'
      ? currentHouse.waterBill.totalAPagar.toString()
      : currentHouse.maintenanceBill.totalAPagar.toString()
  );
  const [folio, setFolio] = useState(`BB-${Math.floor(100000 + Math.random() * 900000)}`);
  const [metodo, setMetodo] = useState<PaymentTransaction['metodo']>('Transferencia BanBajio');
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('es-MX'));
  const [observaciones, setObservaciones] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(monto);
    if (isNaN(val) || val <= 0) return;

    const tx: PaymentTransaction = {
      id: `tx-${Date.now().toString().slice(-5)}`,
      casaId: session.role === 'admin' ? selectedHouseId : currentHouse.id,
      tipo,
      monto: val,
      fecha,
      folioComprobante: folio,
      metodo,
      estatus: session.role === 'admin' ? 'Aplicado' : 'En Verificación',
      observaciones: observaciones || `Pago reportado para ${tipo}`,
    };

    onAddTransaction(tx);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <CreditCard className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {session.role === 'admin' ? 'Registrar Cobro / Abono' : 'Reportar Comprobante de Pago'}
              </h3>
              <p className="text-xs text-slate-700">
                {session.role === 'admin' ? 'Aplicar a libro contable' : `Casa ${currentHouse.numeroCasa} • BanBajio`}
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

        {submitted ? (
          <div className="py-8 text-center space-y-2 animate-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">¡Pago Registrado con Éxito!</h4>
            <p className="text-xs text-slate-600">
              {session.role === 'admin'
                ? 'El saldo fue actualizado y aplicado al estado de cuenta.'
                : 'Tu reporte ha sido enviado a la administración para su validación.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
            {/* Concepto Selector */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Concepto a Pagar</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTipo('Agua');
                    setMonto(currentHouse.waterBill.totalAPagar.toString());
                  }}
                  className={`py-2 px-3 rounded-xl border font-bold text-center transition ${
                    tipo === 'Agua'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Agua Potable
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTipo('Mantenimiento');
                    setMonto(currentHouse.maintenanceBill.totalAPagar.toString());
                  }}
                  className={`py-2 px-3 rounded-xl border font-bold text-center transition ${
                    tipo === 'Mantenimiento'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-1 ring-amber-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Mantenimiento
                </button>
              </div>
            </div>

            {/* Casa Selector si es Admin */}
            {session.role === 'admin' && (
              <div>
                <label className="block font-bold text-slate-700 mb-1">Casa Destino</label>
                <select
                  value={selectedHouseId}
                  onChange={(e) => setSelectedHouseId(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  {houses.map((h) => (
                    <option key={h.id} value={h.id}>
                      Casa {h.numeroCasa} — {h.titular}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Monto */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Monto Pagado (MXN)</label>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-bold font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Folio y Método */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Folio / Rastreo</label>
                <input
                  type="text"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  placeholder="Ej. BB-491023"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Método</label>
                <select
                  value={metodo}
                  onChange={(e) => setMetodo(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Transferencia BanBajio">SPEI BanBajio</option>
                  <option value="Depósito">Depósito en Ventanilla</option>
                  <option value="Efectivo">Efectivo en Administración</option>
                </select>
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Fecha de Operación</label>
              <input
                type="text"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono"
                required
              />
            </div>

            {/* Observaciones */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Notas u Observaciones</label>
              <input
                type="text"
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ej. Transferencia Bancomer a BanBajio referencia 059"
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
              >
                Confirmar Registro
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { House, HouseAgreement, AssemblyMinute, UserSession } from '../types/condo';
import {
  Users,
  FileText,
  Handshake,
  PlusCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Shield,
  FileCheck,
  Building,
  UserCheck,
} from 'lucide-react';

interface CommunitySectionProps {
  currentHouse: House;
  session: UserSession;
  agreements: HouseAgreement[];
  minutes: AssemblyMinute[];
  onAddAgreement: (agr: HouseAgreement) => void;
  onAddMinute: (min: AssemblyMinute) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  currentHouse,
  session,
  agreements,
  minutes,
  onAddAgreement,
  onAddMinute,
}) => {
  const [subTab, setSubTab] = useState<'acuerdos' | 'minutas'>('acuerdos');
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [showMinuteModal, setShowMinuteModal] = useState(false);
  const [selectedMinute, setSelectedMinute] = useState<AssemblyMinute | null>(null);

  // New Agreement Form State
  const [targetCasaId, setTargetCasaId] = useState(currentHouse.id);
  const [agrTitle, setAgrTitle] = useState('');
  const [agrType, setAgrType] = useState<HouseAgreement['tipo']>('Convenio de Pago');
  const [agrDescription, setAgrDescription] = useState('');
  const [agrAmount, setAgrAmount] = useState('');
  const [agrAuthorizedBy, setAgrAuthorizedBy] = useState('Mesa Directiva y Hábitat Condominal');

  // New Minute Form State
  const [minTitle, setMinTitle] = useState('');
  const [minType, setMinType] = useState<'Ordinaria' | 'Extraordinaria'>('Ordinaria');
  const [minDate, setMinDate] = useState('');
  const [minHour, setMinHour] = useState('19:30 hrs');
  const [minQuorum, setMinQuorum] = useState('75.0');
  const [minLocation, setMinLocation] = useState('Palapa / Área Común BEIRE');
  const [minSummary, setMinSummary] = useState('');
  const [minAgreementsText, setMinAgreementsText] = useState('');
  const [minSigners, setMinSigners] = useState('Presidente, Secretario, Administrador y Escrutadores');

  // Submissions
  const handleCreateAgreement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agrTitle.trim() || !agrDescription.trim()) return;

    const newAgr: HouseAgreement = {
      id: `agr-${Date.now().toString().slice(-4)}`,
      casaId: targetCasaId,
      titulo: agrTitle,
      fecha: new Date().toLocaleDateString('es-MX'),
      tipo: agrType,
      descripcion: agrDescription,
      montoAjuste: agrAmount ? parseFloat(agrAmount) : undefined,
      estatus: 'Vigente',
      autorizadoPor: agrAuthorizedBy,
    };

    onAddAgreement(newAgr);
    setAgrTitle('');
    setAgrDescription('');
    setAgrAmount('');
    setShowAgreementModal(false);
  };

  const handleCreateMinute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!minTitle.trim() || !minSummary.trim()) return;

    const acuerdosArr = minAgreementsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newMin: AssemblyMinute = {
      id: `min-${Date.now().toString().slice(-4)}`,
      titulo: minTitle,
      tipo: minType,
      fecha: minDate || new Date().toLocaleDateString('es-MX'),
      hora: minHour,
      quorumPorcentaje: parseFloat(minQuorum) || 70,
      lugar: minLocation,
      resumen: minSummary,
      acuerdos: acuerdosArr.length > 0 ? acuerdosArr : ['Acuerdo registrado en asamblea'],
      firmantes: minSigners,
    };

    onAddMinute(newMin);
    setMinTitle('');
    setMinSummary('');
    setMinAgreementsText('');
    setShowMinuteModal(false);
  };

  // Filtrado de acuerdos
  // Si es residente, ve los de su casa. Si es admin, ve todos.
  const visibleAgreements =
    session.role === 'admin'
      ? agreements
      : agreements.filter((a) => a.casaId === currentHouse.id);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
              <Users className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Acuerdos por Casa y Minutas de Asamblea
              </h2>
              <p className="text-xs text-slate-700">
                Registro oficial de convenios particulares y asambleas generales del Condominio BEIRE
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {session.role === 'admin' && (
            <>
              <button
                onClick={() => setShowAgreementModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Publicar Acuerdo</span>
              </button>

              <button
                onClick={() => setShowMinuteModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Publicar Minuta</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Segment Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSubTab('acuerdos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'acuerdos'
              ? 'bg-purple-100 text-purple-900 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Handshake className="w-4 h-4 text-purple-600" />
          <span>
            {session.role === 'admin'
              ? `Acuerdos por Casa (${visibleAgreements.length})`
              : `Acuerdos Casa ${currentHouse.numeroCasa} (${visibleAgreements.length})`}
          </span>
        </button>

        <button
          onClick={() => setSubTab('minutas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            subTab === 'minutas'
              ? 'bg-purple-100 text-purple-900 shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-purple-600" />
          <span>Minutas de Asamblea ({minutes.length})</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* SECCIÓN 1: ACUERDOS POR CASA                                   */}
      {/* ============================================================== */}
      {subTab === 'acuerdos' && (
        <div className="space-y-4">
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-3 text-xs text-purple-900 flex items-start gap-2.5">
            <Handshake className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {session.role === 'admin'
                  ? 'Panel de Acuerdos Particulares (117 Casas)'
                  : `Acuerdos y Convenios de la Casa ${currentHouse.numeroCasa}`}
              </p>
              <p className="text-[11px] text-purple-800 mt-0.5">
                Los acuerdos registrados son aplicables directamente a los estados de cuenta y validan condonaciones, prórrogas o ajustes conciliados con la mesa directiva.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleAgreements.length === 0 ? (
              <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-700">
                <Handshake className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-semibold text-slate-700">Sin acuerdos registrados para esta casa</p>
                <p className="text-xs text-slate-600 mt-1">La propiedad opera con el reglamento general sin convenios especiales.</p>
              </div>
            ) : (
              visibleAgreements.map((agr) => (
                <div
                  key={agr.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                          Casa {agr.casaId.toString().padStart(3, '0')}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700">
                          {agr.tipo}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          agr.estatus === 'Cumplido'
                            ? 'bg-emerald-100 text-emerald-800'
                            : agr.estatus === 'Vigente'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {agr.estatus}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-2.5">
                      {agr.titulo}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {agr.descripcion}
                    </p>

                    {agr.montoAjuste !== undefined && agr.montoAjuste > 0 && (
                      <div className="mt-2 text-xs font-mono font-bold text-purple-900 bg-purple-50 p-1.5 rounded">
                        Monto de ajuste: ${agr.montoAjuste.toFixed(2)} MXN
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span>Fecha: {agr.fecha}</span>
                    <span className="font-medium text-slate-700 truncate max-w-[180px]">
                      {agr.autorizadoPor}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECCIÓN 2: MINUTAS DE ASAMBLEA                                 */}
      {/* ============================================================== */}
      {subTab === 'minutas' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {minutes.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        m.tipo === 'Ordinaria'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      Asamblea {m.tipo}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-600" />
                      <span>{m.fecha}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-3">
                    {m.titulo}
                  </h3>

                  <div className="mt-2 text-xs text-slate-600 flex items-center gap-3">
                    <span>Quórum: <strong>{m.quorumPorcentaje}%</strong></span>
                    <span>•</span>
                    <span>{m.lugar}</span>
                  </div>

                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed">
                    {m.resumen}
                  </p>

                  <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase text-slate-700 block mb-1.5">
                      Principales Acuerdos Aprobados:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-700">
                      {m.acuerdos.slice(0, 3).map((ac, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{ac}</span>
                        </li>
                      ))}
                      {m.acuerdos.length > 3 && (
                        <li className="text-[11px] text-blue-700 font-semibold pt-1">
                          + {m.acuerdos.length - 3} acuerdos adicionales...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-600 truncate max-w-[200px]">
                    Firmantes: {m.firmantes}
                  </span>
                  <button
                    onClick={() => setSelectedMinute(m)}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                  >
                    Ver Minuta Completa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL DETALLE DE MINUTA COMPLETA                             */}
      {/* ============================================================== */}
      {selectedMinute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-700" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {selectedMinute.titulo}
                  </h3>
                  <p className="text-xs text-slate-700">
                    Asamblea {selectedMinute.tipo} • {selectedMinute.fecha} ({selectedMinute.hora})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMinute(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                <div><strong>Lugar:</strong> {selectedMinute.lugar}</div>
                <div><strong>Quórum Legal:</strong> {selectedMinute.quorumPorcentaje}% de los condóminos</div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Resumen de la Sesión</h4>
                <p className="text-slate-700 leading-relaxed">{selectedMinute.resumen}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">Acuerdos Aprobados por Asamblea</h4>
                <div className="space-y-2">
                  {selectedMinute.acuerdos.map((ac, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-purple-50/50 p-2.5 rounded-lg border border-purple-100">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-200 text-purple-900 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <p className="text-slate-800 leading-snug">{ac}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-700 italic border-t border-slate-100">
                <strong>Firmantes y avales:</strong> {selectedMinute.firmantes}
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setSelectedMinute(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL CREAR NUEVO ACUERDO POR CASA                           */}
      {/* ============================================================== */}
      {showAgreementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Registrar Acuerdo por Casa</h3>
            <p className="text-xs text-slate-700 mb-4">Convenio particular o ajuste autorizado</p>

            <form onSubmit={handleCreateAgreement} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Número de Casa (1 a 117)</label>
                <input
                  type="number"
                  min="1"
                  max="117"
                  value={targetCasaId}
                  onChange={(e) => setTargetCasaId(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tipo de Acuerdo</label>
                <select
                  value={agrType}
                  onChange={(e) => setAgrType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                >
                  <option value="Convenio de Pago">Convenio de Pago</option>
                  <option value="Ajuste de Saldo">Ajuste de Saldo Contable</option>
                  <option value="Acuerdo Directiva">Acuerdo Directiva</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título del Acuerdo</label>
                <input
                  type="text"
                  value={agrTitle}
                  onChange={(e) => setAgrTitle(e.target.value)}
                  placeholder="Ej. Convenio de pago en 3 cuotas o Bonificación"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción y Condiciones</label>
                <textarea
                  value={agrDescription}
                  onChange={(e) => setAgrDescription(e.target.value)}
                  rows={3}
                  placeholder="Detalla los términos convenidos, fechas de pago o motivos del ajuste..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monto de Ajuste (Opcional MXN)</label>
                <input
                  type="number"
                  step="0.01"
                  value={agrAmount}
                  onChange={(e) => setAgrAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAgreementModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                >
                  Publicar Acuerdo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL CREAR NUEVA MINUTA DE ASAMBLEA                         */}
      {/* ============================================================== */}
      {showMinuteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 mb-1">Publicar Minuta de Asamblea</h3>
            <p className="text-xs text-slate-700 mb-4">Registro oficial de asamblea ordinaria o extraordinaria</p>

            <form onSubmit={handleCreateMinute} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Asamblea</label>
                  <select
                    value={minType}
                    onChange={(e) => setMinType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  >
                    <option value="Ordinaria">Ordinaria</option>
                    <option value="Extraordinaria">Extraordinaria</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Quórum Acreditado (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={minQuorum}
                    onChange={(e) => setMinQuorum(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de la Minuta</label>
                <input
                  type="text"
                  value={minTitle}
                  onChange={(e) => setMinTitle(e.target.value)}
                  placeholder="Ej. Asamblea Extraordinaria - Mantenimiento de Portones"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Resumen de la Sesión</label>
                <textarea
                  value={minSummary}
                  onChange={(e) => setMinSummary(e.target.value)}
                  rows={3}
                  placeholder="Breve reseña de los temas tratados..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Acuerdos Aprobados (Uno por renglón)
                </label>
                <textarea
                  value={minAgreementsText}
                  onChange={(e) => setMinAgreementsText(e.target.value)}
                  rows={4}
                  placeholder="1. Se aprueba la cuota de mantenimiento de $325.00&#10;2. Se fija horario de recolección de basura..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMinuteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Publicar Minuta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

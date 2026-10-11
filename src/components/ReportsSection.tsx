import React, { useState } from 'react';
import { MaintenanceReport, ReportCategory, ReportPriority, ReportStatus, UserSession, House } from '../types/condo';
import {
  MessageSquare,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  Filter,
  Camera,
  MapPin,
  Tag,
  User,
  Shield,
  Lightbulb,
  Wrench,
  Check,
} from 'lucide-react';

interface ReportsSectionProps {
  reports: MaintenanceReport[];
  currentHouse: House;
  session: UserSession;
  onAddReport: (report: MaintenanceReport) => void;
  onUpdateReport: (reportId: string, partial: Partial<MaintenanceReport>) => void;
}

export const ReportsSection: React.FC<ReportsSectionProps> = ({
  reports,
  currentHouse,
  session,
  onAddReport,
  onUpdateReport,
}) => {
  const [showNewModal, setShowNewModal] = useState(false);
  const [filterType, setFilterType] = useState<'todos' | 'reporte' | 'sugerencia'>('todos');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedReport, setSelectedReport] = useState<MaintenanceReport | null>(null);

  // Form State
  const [tipo, setTipo] = useState<'reporte' | 'sugerencia'>('reporte');
  const [categoria, setCategoria] = useState<ReportCategory>('Alumbrado Público');
  const [titulo, setTitulo] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [prioridad, setPrioridad] = useState<ReportPriority>('Media');
  const [descripcion, setDescripcion] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');

  // Admin response state
  const [adminReply, setAdminReply] = useState('');
  const [adminStatus, setAdminStatus] = useState<ReportStatus>('En Proceso');
  const [adminAttendant, setAdminAttendant] = useState('Habitat Condominal');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) return;

    const newTicket: MaintenanceReport = {
      id: `rep-${Date.now().toString().slice(-5)}`,
      casaId: currentHouse.id,
      tipo,
      categoria,
      titulo,
      ubicacion: ubicacion || `Frente a Casa ${currentHouse.numeroCasa}`,
      prioridad,
      estado: 'Recibido',
      fechaCreacion: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
      fechaActualizacion: new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' }),
      descripcion,
      fotoUrl: fotoUrl || undefined,
    };

    onAddReport(newTicket);
    // Reset Form
    setTitulo('');
    setUbicacion('');
    setDescripcion('');
    setFotoUrl('');
    setShowNewModal(false);
  };

  const handleAdminUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    onUpdateReport(selectedReport.id, {
      estado: adminStatus,
      respuestaAdmin: adminReply,
      atendidoPor: adminAttendant,
    });

    setSelectedReport(null);
    setAdminReply('');
  };

  // Filter list
  const filtered = reports.filter((r) => {
    if (filterType !== 'todos' && r.tipo !== filterType) return false;
    if (filterStatus !== 'todos' && r.estado !== filterStatus) return false;
    return true;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'Resuelto':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Resuelto</span>
          </span>
        );
      case 'En Proceso':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
            <span>En Proceso</span>
          </span>
        );
      case 'En Revisión':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
            <AlertCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>En Revisión</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Recibido</span>
          </span>
        );
    }
  };

  const getPriorityColor = (p: ReportPriority) => {
    switch (p) {
      case 'Urgente':
        return 'text-red-700 bg-red-100 border-red-200';
      case 'Alta':
        return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'Media':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Reportes y Sugerencias en Tiempo Real
              </h2>
              <p className="text-xs text-slate-700">
                Atención directa de incidencias condominiales, fallas de servicios y propuestas de asamblea
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nuevo Reporte o Sugerencia</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setFilterType('todos')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              filterType === 'todos' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todos ({reports.length})
          </button>
          <button
            onClick={() => setFilterType('reporte')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition ${
              filterType === 'reporte' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Fallas de Mantenimiento</span>
          </button>
          <button
            onClick={() => setFilterType('sugerencia')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 transition ${
              filterType === 'sugerencia' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Sugerencias para Asamblea</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-600 font-medium">Estatus:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden"
          >
            <option value="todos">Todos los estatus</option>
            <option value="Recibido">Recibido</option>
            <option value="En Revisión">En Revisión</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
      </div>

      {/* Reports Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-700">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">No hay reportes o sugerencias con estos filtros</p>
            <p className="text-xs text-slate-600 mt-1">Crea el primer reporte presionando el botón superior.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isMine = item.casaId === currentHouse.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow relative"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200">
                        Casa {item.casaId.toString().padStart(3, '0')}
                      </span>
                      {isMine && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Mi Casa
                        </span>
                      )}
                      <span className="text-[10px] font-semibold text-slate-600">
                        {item.categoria}
                      </span>
                    </div>

                    <div>{getStatusBadge(item.estado)}</div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3">
                    <div className="flex items-center gap-1.5">
                      {item.tipo === 'reporte' ? (
                        <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                      ) : (
                        <Lightbulb className="w-4 h-4 text-purple-600 shrink-0" />
                      )}
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.titulo}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                      {item.descripcion}
                    </p>
                  </div>

                  {/* Location & Metadata */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-600" />
                      <span>{item.ubicacion}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-600" />
                      <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${getPriorityColor(item.prioridad)}`}>
                        Prioridad {item.prioridad}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-600">
                      <Clock className="w-3 h-3 text-slate-600" />
                      <span>{item.fechaCreacion}</span>
                    </div>
                  </div>

                  {/* Admin Response Box */}
                  {item.respuestaAdmin && (
                    <div className="mt-3.5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
                      <div className="flex items-center justify-between pb-1 border-b border-slate-200 text-[10px] text-slate-600 font-bold uppercase">
                        <span className="flex items-center gap-1 text-blue-900">
                          <Shield className="w-3 h-3 text-blue-700" />
                          <span>Respuesta de {item.atendidoPor || 'Administración'}</span>
                        </span>
                        <span>{item.fechaActualizacion}</span>
                      </div>
                      <p className="mt-1.5 text-slate-700 text-xs leading-relaxed">
                        {item.respuestaAdmin}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Controls (Admin can respond/update status) */}
                {session.role === 'admin' && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedReport(item);
                        setAdminReply(item.respuestaAdmin || '');
                        setAdminStatus(item.estado);
                        setAdminAttendant(item.atendidoPor || 'Habitat Condominal');
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition"
                    >
                      Gestionar / Responder
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL PARA CREAR NUEVO REPORTE O SUGERENCIA                  */}
      {/* ============================================================== */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <MessageSquare className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Nuevo Reporte en Tiempo Real
                  </h3>
                  <p className="text-xs text-slate-700">
                    Casa {currentHouse.numeroCasa} • {currentHouse.titular}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              {/* Selector Tipo */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tipo de Publicación
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipo('reporte')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                      tipo === 'reporte'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-blue-600" />
                    <span>Falla / Mantenimiento</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipo('sugerencia')}
                    className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-center gap-1.5 transition ${
                      tipo === 'sugerencia'
                        ? 'bg-purple-50 border-purple-500 text-purple-900 ring-1 ring-purple-500'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Lightbulb className="w-4 h-4 text-purple-600" />
                    <span>Sugerencia a Mesa</span>
                  </button>
                </div>
              </div>

              {/* Categoría y Prioridad */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value as ReportCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Alumbrado Público">Alumbrado Público</option>
                    <option value="Portón Eléctrico / Acceso">Portón Eléctrico / Acceso</option>
                    <option value="Fuga de Agua / Tubería">Fuga de Agua / Tubería</option>
                    <option value="Áreas Verdes y Jardín">Áreas Verdes y Jardín</option>
                    <option value="Basura y Limpieza">Basura y Limpieza</option>
                    <option value="Seguridad y Vigilancia">Seguridad y Vigilancia</option>
                    <option value="Sugerencia Asamblea">Sugerencia Asamblea</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nivel de Prioridad</label>
                  <select
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value as ReportPriority)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Baja">Baja (Preventivo)</option>
                    <option value="Media">Media (Atención ordinaria)</option>
                    <option value="Alta">Alta (Afecta servicios)</option>
                    <option value="Urgente">Urgente (Emergencia)</option>
                  </select>
                </div>
              </div>

              {/* Título */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título Breve</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ej. Fuga en válvula de calle o falla en sensor portón"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Ubicación */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ubicación en el Condominio</label>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder={`Ej. Frente a Casa ${currentHouse.numeroCasa}, o palapa central`}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Descripción Detallada</label>
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                  placeholder="Describe con precisión el problema observado, horario en que ocurre, o tu propuesta para la asamblea..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Fotografía opcional */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Foto o Evidencia (Opcional)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={fotoUrl}
                    onChange={(e) => setFotoUrl(e.target.value)}
                    placeholder="Enlace o nota de imagen tomada con celular"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setFotoUrl('Foto_evidencia_camara_reporte.jpg')}
                    className="p-2 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600"
                    title="Simular captura con cámara"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar a Administración</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL DE ADMINISTRADOR PARA GESTIONAR REPORTE               */}
      {/* ============================================================== */}
      {selectedReport && session.role === 'admin' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-700" />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Gestión de Reporte #{selectedReport.id}
                  </h3>
                  <p className="text-xs text-slate-700">
                    Casa {selectedReport.casaId.toString().padStart(3, '0')} • {selectedReport.titulo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminUpdate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estatus del Reporte</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['En Revisión', 'En Proceso', 'Resuelto'] as ReportStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setAdminStatus(st)}
                      className={`py-2 px-2 rounded-xl border text-center font-bold transition ${
                        adminStatus === st
                          ? st === 'Resuelto'
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Personal / Contratista Asignado</label>
                <input
                  type="text"
                  value={adminAttendant}
                  onChange={(e) => setAdminAttendant(e.target.value)}
                  placeholder="Ej. Habitat Condominal / Electricista / Técnico de Portón"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Respuesta o Informe de Solución
                </label>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  rows={4}
                  placeholder="Escribe la respuesta visible para el residente sobre la visita técnica, reparación realizada o dictamen..."
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Guardar y Notificar a Residente</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export interface WaterMonthHistory {
  mes: string; // e.g. "2026 OCTUBRE"
  consumoM3: number;
  totalMes: number;
  acumulado: number;
  suPago: number;
  fechaPago: string;
  remanente: number;
}

export interface WaterBill {
  folio: string; // "2026 OCTUBRE 059"
  periodo: string; // "2026 OCTUBRE"
  medidor: string; // "161026861"
  lecturaAnterior: number; // 852
  fechaLecturaAnterior: string; // "30/08/2026"
  lecturaActual: number; // 862
  fechaLecturaActual: string; // "28/09/2026"
  consumoM3: number; // 10
  diasTranscurridos: number; // 29
  // Periodo anterior
  periodoAnteriorNombre: string; // "2026 SEPTIEMBRE"
  periodoAnteriorTotal: number; // 406.74
  periodoAnteriorPago: number; // 360.00
  periodoAnteriorFechaPago: string; // "10/09/2026"
  periodoAnteriorSaldo: number; // 46.74
  periodoAnteriorRecargos: number; // 0.00
  periodoAnteriorPendiente: number; // 46.74
  // Periodo actual
  consumoPeriodoMonto: number; // 338.94 (incluye alcantarillado y saneamiento CEA)
  fondoReserva: number; // 0.00
  servicioAdministracion: number; // 25.00
  reconexion: number; // 0.00
  multas: number; // 0.00
  descuentos: number; // 0.00
  totalPeriodoActual: number; // 363.94
  // Total a pagar
  totalAPagar: number; // 410.68
  totalLetra: string; // "CUATROCIENTOS DIEZ PESOS 68/100 M.N."
  fechaLimitePago: string; // "viernes, 30 de octubre de 2026"
  mesesSinPago: number; // 0
  restriccionAPartirDe: string; // "" o fecha
  historico12Meses: WaterMonthHistory[];
}

export interface MaintenanceLedgerEntry {
  mes: string; // "2026 SEPTIEMBRE"
  cuota: number; // 325.00
  pagosEnTiempo: number; // 0.00 o 350.00
  fechasPago: string; // "10/09/2026"
  capitalVencidoMes: number; // -325.00
  capitalTotalVencido: number; // -335.39
  interesMes: number; // -26.83
  sumaIntereses: number; // -27.66
  saldoParcial: number; // -363.05
  pagosExtemporaneos: number; // 360.00
  interesesRemanentes: number; // 0.00
  peSobrante: number; // 0.00
  capitalRemanente: number; // -335.39
  saldo: number; // 301.22
  nota?: string;
}

export interface MaintenanceBill {
  periodo: string; // "2026 OCTUBRE"
  cuotaVigente: number; // 325.00
  totalAPagar: number; // 301.22
  totalLetra: string; // "TRESCIENTOS UN PESOS 22/100 M.N."
  fechaLimite: string; // "10 de octubre de 2026"
  // Resumen mes anterior
  mesAnteriorNombre: string; // "2026 SEPTIEMBRE"
  capitalAnteriorMasCuota: number; // 335.39
  interesesAnterior: number; // 0.83
  totalAPagarMesAnterior: number; // 336.22
  suPagoMesAnterior: number; // 360.00
  fechaPagoMesAnterior: string; // "10/09/2026"
  // Calculo saldo nuevo
  capitalPendiente: number; // -23.78
  interesesActualizados: number; // 0.00
  totalDelMes: number; // 301.22
  // Estatus de sanciones
  mesesAdeudo: number; // 0
  tagVehicularRestringido: boolean;
  servicioHidraulicoRestringido: boolean;
  ledger: MaintenanceLedgerEntry[];
}

export interface House {
  id: number; // 1 to 117
  numeroCasa: string; // "059" o "59"
  titular: string; // "SALGADO JUAREZ URSU ALBERTO"
  telefono: string;
  email: string;
  medidor: string;
  tagVehicularActivo: boolean;
  servicioAguaActivo: boolean;
  waterBill: WaterBill;
  maintenanceBill: MaintenanceBill;
}

export type ReportCategory =
  | 'Alumbrado Público'
  | 'Portón Eléctrico / Acceso'
  | 'Fuga de Agua / Tubería'
  | 'Áreas Verdes y Jardín'
  | 'Basura y Limpieza'
  | 'Seguridad y Vigilancia'
  | 'Sugerencia Asamblea'
  | 'Otro';

export type ReportPriority = 'Baja' | 'Media' | 'Alta' | 'Urgente';

export type ReportStatus = 'Recibido' | 'En Revisión' | 'En Proceso' | 'Resuelto';

export interface MaintenanceReport {
  id: string;
  casaId: number;
  tipo: 'reporte' | 'sugerencia';
  categoria: ReportCategory;
  titulo: string;
  descripcion: string;
  ubicacion: string;
  prioridad: ReportPriority;
  estado: ReportStatus;
  fechaCreacion: string;
  fechaActualizacion: string;
  respuestaAdmin?: string;
  atendidoPor?: string;
  fotoUrl?: string;
}

export interface HouseAgreement {
  id: string;
  casaId: number;
  titulo: string;
  fecha: string;
  descripcion: string;
  tipo: 'Convenio de Pago' | 'Ajuste de Saldo' | 'Acuerdo Directiva' | 'Otro';
  montoAjuste?: number;
  estatus: 'Vigente' | 'Cumplido' | 'Cancelado';
  autorizadoPor: string;
}

export interface AssemblyMinute {
  id: string;
  titulo: string;
  tipo: 'Ordinaria' | 'Extraordinaria';
  fecha: string;
  hora: string;
  quorumPorcentaje: number;
  lugar: string;
  resumen: string;
  acuerdos: string[];
  firmantes: string;
  documentoUrl?: string;
}

export interface PaymentTransaction {
  id: string;
  casaId: number;
  tipo: 'Agua' | 'Mantenimiento';
  monto: number;
  fecha: string;
  folioComprobante: string;
  metodo: 'Transferencia BanBajio' | 'Depósito' | 'Efectivo';
  estatus: 'Aplicado' | 'En Verificación';
  observaciones?: string;
}

export type UserRole = 'admin' | 'residente';

export interface UserSession {
  role: UserRole;
  casaId: number; // if residente, fixed to their house; if admin, current active view
  userName: string;
}

import {
  House,
  WaterBill,
  MaintenanceBill,
  WaterMonthHistory,
  MaintenanceLedgerEntry,
  MaintenanceReport,
  HouseAgreement,
  AssemblyMinute,
  PaymentTransaction,
} from '../types/condo';

export const CONDO_INFO = {
  nombre: 'Asociación de Condóminos BEIRE A.C.',
  direccion: 'Av. Puente de la Reina No. 2042, Frac. Puerta Navarra, CP 76116, Querétaro, Qro.',
  administrador: 'Habitat Condominal',
  cuotaVigenteMantenimiento: 325.00,
  servicioAdministracionAgua: 25.00,
  costoReconexion: 200.00,
  tasaInteresMoratorio: 0.08, // 8% mensual
  diaLimiteMantenimiento: 10,
  banco: 'BANBAJIO',
  cuenta: '4771 1379 0201',
  clabe: '0306 8090 0044 4473 97',
  email: 'pagosbeire@gmail.com',
  whatsapp: '442 783 1342',
  totalCasas: 117,
};

// Histórico exacto de los últimos 12 meses de Casa 59 (según el recibo escaneado de agua)
const HISTORICO_AGUA_CASA_59: WaterMonthHistory[] = [
  { mes: '2025 OCTUBRE', consumoM3: 9, totalMes: 316.49, acumulado: 481.56, suPago: 0.00, fechaPago: '00/01/1900', remanente: 481.56 },
  { mes: '2025 NOVIEMBRE', consumoM3: 8, totalMes: 278.81, acumulado: 760.37, suPago: 800.00, fechaPago: '28/11/2025', remanente: -39.63 },
  { mes: '2025 DICIEMBRE', consumoM3: 10, totalMes: 345.20, acumulado: 305.57, suPago: 0.00, fechaPago: '00/01/1900', remanente: 305.57 },
  { mes: '2026 ENERO', consumoM3: 8, totalMes: 285.67, acumulado: 591.24, suPago: 0.00, fechaPago: '00/01/1900', remanente: 591.24 },
  { mes: '2026 FEBRERO', consumoM3: 9, totalMes: 324.38, acumulado: 915.61, suPago: 451.00, fechaPago: '18/02/2026', remanente: 464.61 },
  { mes: '2026 MARZO', consumoM3: 11, totalMes: 382.52, acumulado: 847.13, suPago: 450.00, fechaPago: '31/03/2026', remanente: 397.13 },
  { mes: '2026 ABRIL', consumoM3: 10, totalMes: 353.86, acumulado: 751.00, suPago: 500.00, fechaPago: '30/04/2026', remanente: 251.00 },
  { mes: '2026 MAYO', consumoM3: 11, totalMes: 382.52, acumulado: 633.52, suPago: 500.00, fechaPago: '30/05/2026', remanente: 133.52 },
  { mes: '2026 JUNIO', consumoM3: 10, totalMes: 353.86, acumulado: 487.38, suPago: 500.00, fechaPago: '29/06/2026', remanente: -12.62 },
  { mes: '2026 JULIO', consumoM3: 10, totalMes: 363.94, acumulado: 351.32, suPago: 352.00, fechaPago: '23/07/2026', remanente: -0.68 },
  { mes: '2026 AGOSTO', consumoM3: 10, totalMes: 363.94, acumulado: 363.26, suPago: 350.00, fechaPago: '04/08/2026', remanente: 13.26 },
  { mes: '2026 SEPTIEMBRE', consumoM3: 11, totalMes: 393.48, acumulado: 406.74, suPago: 360.00, fechaPago: '10/09/2026', remanente: 46.74 },
  { mes: '2026 OCTUBRE', consumoM3: 10, totalMes: 363.94, acumulado: 410.68, suPago: 0.00, fechaPago: '', remanente: 410.68 },
];

export const WATER_BILL_59: WaterBill = {
  folio: '2026 OCTUBRE 059',
  periodo: '2026 OCTUBRE',
  medidor: '161026861',
  lecturaAnterior: 852,
  fechaLecturaAnterior: '30/08/2026',
  lecturaActual: 862,
  fechaLecturaActual: '28/09/2026',
  consumoM3: 10,
  diasTranscurridos: 29,
  periodoAnteriorNombre: '2026 SEPTIEMBRE',
  periodoAnteriorTotal: 406.74,
  periodoAnteriorPago: 360.00,
  periodoAnteriorFechaPago: '10/09/2026',
  periodoAnteriorSaldo: 46.74,
  periodoAnteriorRecargos: 0.00,
  periodoAnteriorPendiente: 46.74,
  consumoPeriodoMonto: 338.94,
  fondoReserva: 0.00,
  servicioAdministracion: 25.00,
  reconexion: 0.00,
  multas: 0.00,
  descuentos: 0.00,
  totalPeriodoActual: 363.94,
  totalAPagar: 410.68,
  totalLetra: 'CUATROCIENTOS DIEZ PESOS 68/100 M.N.',
  fechaLimitePago: 'viernes, 30 de octubre de 2026',
  mesesSinPago: 0,
  restriccionAPartirDe: '',
  historico12Meses: HISTORICO_AGUA_CASA_59,
};

// Histórico contable exacto de mantenimiento para Casa 59 (del archivo de Excel escaneado)
const LEDGER_CASA_59: MaintenanceLedgerEntry[] = [
  { mes: '2022 SEPTIEMBRE', cuota: 300.00, pagosEnTiempo: 300.00, fechasPago: '10/09/2022', capitalVencidoMes: 0.00, capitalTotalVencido: 0.00, interesMes: 0.00, sumaIntereses: 0.00, saldoParcial: 467.00, pagosExtemporaneos: 0.00, interesesRemanentes: 0.00, peSobrante: 0.00, capitalRemanente: 0.00, saldo: 467.00, nota: 'Ajuste por acuerdo con Jorge que no se habia considerado' },
  { mes: '2025 NOVIEMBRE', cuota: 300.00, pagosEnTiempo: 350.00, fechasPago: '01y28/11/25', capitalVencidoMes: -300.00, capitalTotalVencido: -307.37, interesMes: -24.59, sumaIntereses: -24.59, saldoParcial: -331.96, pagosExtemporaneos: 400.00, interesesRemanentes: 0.00, peSobrante: 375.41, capitalRemanente: 68.04, saldo: 68.04 },
  { mes: '2025 DICIEMBRE', cuota: 300.00, pagosEnTiempo: 0.00, fechasPago: '', capitalVencidoMes: -231.96, capitalTotalVencido: -231.96, interesMes: -18.56, sumaIntereses: -18.56, saldoParcial: -250.52, pagosExtemporaneos: 0.00, interesesRemanentes: -18.56, peSobrante: 0.00, capitalRemanente: -231.96, saldo: -250.52 },
  { mes: '2026 ENERO', cuota: 300.00, pagosEnTiempo: 0.00, fechasPago: '', capitalVencidoMes: -300.00, capitalTotalVencido: -531.96, interesMes: -42.56, sumaIntereses: -61.11, saldoParcial: -593.07, pagosExtemporaneos: 0.00, interesesRemanentes: -61.11, peSobrante: 0.00, capitalRemanente: -531.96, saldo: -593.07 },
  { mes: '2026 FEBRERO', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '18/02/2026', capitalVencidoMes: -325.00, capitalTotalVencido: -856.96, interesMes: -68.56, sumaIntereses: -129.67, saldoParcial: -986.63, pagosExtemporaneos: 450.00, interesesRemanentes: 0.00, peSobrante: 320.33, capitalRemanente: -536.63, saldo: -536.63 },
  { mes: '2026 MARZO', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '31/03/2026', capitalVencidoMes: -325.00, capitalTotalVencido: -861.63, interesMes: -68.93, sumaIntereses: -68.93, saldoParcial: -930.56, pagosExtemporaneos: 450.00, interesesRemanentes: 0.00, peSobrante: 381.07, capitalRemanente: -480.56, saldo: -480.56 },
  { mes: '2026 ABRIL', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '30/04/2026', capitalVencidoMes: -325.00, capitalTotalVencido: -805.56, interesMes: -64.44, sumaIntereses: -64.44, saldoParcial: -870.01, pagosExtemporaneos: 500.00, interesesRemanentes: 0.00, peSobrante: 435.56, capitalRemanente: -370.01, saldo: -370.01 },
  { mes: '2026 MAYO', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '30/05/2026', capitalVencidoMes: -325.00, capitalTotalVencido: -695.01, interesMes: -55.60, sumaIntereses: -55.60, saldoParcial: -750.61, pagosExtemporaneos: 500.00, interesesRemanentes: 0.00, peSobrante: 444.40, capitalRemanente: -250.61, saldo: -250.61 },
  { mes: '2026 JUNIO', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '29/06/2026', capitalVencidoMes: -325.00, capitalTotalVencido: -575.61, interesMes: -46.05, sumaIntereses: -46.05, saldoParcial: -621.65, pagosExtemporaneos: 500.00, interesesRemanentes: 0.00, peSobrante: 453.95, capitalRemanente: -121.65, saldo: -121.65 },
  { mes: '2026 JULIO', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '23/07/2026', capitalVencidoMes: -325.00, capitalTotalVencido: -446.65, interesMes: -35.73, sumaIntereses: -35.73, saldoParcial: -482.39, pagosExtemporaneos: 447.00, interesesRemanentes: 0.00, peSobrante: 411.27, capitalRemanente: -35.39, saldo: -35.39 },
  { mes: '2026 AGOSTO', cuota: 325.00, pagosEnTiempo: 350.00, fechasPago: '04/08/2026', capitalVencidoMes: -10.39, capitalTotalVencido: -10.39, interesMes: -0.83, sumaIntereses: -0.83, saldoParcial: -11.22, pagosExtemporaneos: 0.00, interesesRemanentes: -0.83, peSobrante: 0.00, capitalRemanente: -10.39, saldo: -11.22 },
  { mes: '2026 SEPTIEMBRE', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '10/09/2026', capitalVencidoMes: -325.00, capitalTotalVencido: -335.39, interesMes: -26.83, sumaIntereses: -27.66, saldoParcial: -363.05, pagosExtemporaneos: 360.00, interesesRemanentes: 0.00, peSobrante: 0.00, capitalRemanente: -335.39, saldo: 301.22 },
  { mes: '2026 OCTUBRE', cuota: 325.00, pagosEnTiempo: 0.00, fechasPago: '', capitalVencidoMes: 0.00, capitalTotalVencido: -23.78, interesMes: 0.00, sumaIntereses: 0.00, saldoParcial: 301.22, pagosExtemporaneos: 0.00, interesesRemanentes: 0.00, peSobrante: 0.00, capitalRemanente: -23.78, saldo: 301.22 },
];

export const MAINTENANCE_BILL_59: MaintenanceBill = {
  periodo: '2026 OCTUBRE',
  cuotaVigente: 325.00,
  totalAPagar: 301.22,
  totalLetra: 'TRESCIENTOS UN PESOS 22/100 M.N.',
  fechaLimite: '10 de octubre de 2026',
  mesAnteriorNombre: '2026 SEPTIEMBRE',
  capitalAnteriorMasCuota: 335.39,
  interesesAnterior: 0.83,
  totalAPagarMesAnterior: 336.22,
  suPagoMesAnterior: 360.00,
  fechaPagoMesAnterior: '10/09/2026',
  capitalPendiente: -23.78,
  interesesActualizados: 0.00,
  totalDelMes: 301.22,
  mesesAdeudo: 0,
  tagVehicularRestringido: false,
  servicioHidraulicoRestringido: false,
  ledger: LEDGER_CASA_59,
};

// Generador de 117 casas completas para la Asociación
export function generateAll117Houses(): House[] {
  const residentNames = [
    'SALGADO JUAREZ URSU ALBERTO',
    'GONZALEZ RIVERA ALEJANDRO',
    'MARTINEZ HERNANDEZ MARIANA',
    'GARCIA LOPEZ CARLOS EDUARDO',
    'RODRIGUEZ PEREZ VALENTINA',
    'HERNANDEZ SILVA RICARDO',
    'RAMIREZ MORALES DANIELA',
    'FLORES SANCHEZ JAVIER',
    'TORRES VEGA ANDREA',
    'DIAZ CASTILLO GABRIEL',
    'MORALES ROJAS PATRICIA',
    'RUIZ GUERRERO MANUEL',
    'CASTRO MENDEZ SOFIA',
    'VARGAS DOMINGUEZ HECTOR',
    'ORTIZ MEDINA BEATRIZ',
    'MENDEZ LUNA ROBERTO',
    'GUZMAN NAVARRO CLAUDIA',
    'ROMERO CAMPOS FERNANDO',
    'SILVA DELGADO MONICA',
    'ALVAREZ ORTEGA SERGIO',
  ];

  const houses: House[] = [];

  for (let i = 1; i <= 117; i++) {
    const numStr = i.toString().padStart(3, '0');

    if (i === 59) {
      // Casa 59 - Exacta
      houses.push({
        id: 59,
        numeroCasa: '059',
        titular: 'SALGADO JUAREZ URSU ALBERTO',
        telefono: '442 783 1342',
        email: 'ursu_salgado@my.unitec.edu.mx',
        medidor: '161026861',
        tagVehicularActivo: true,
        servicioAguaActivo: true,
        waterBill: WATER_BILL_59,
        maintenanceBill: MAINTENANCE_BILL_59,
      });
      continue;
    }

    // Variar estatus de adeudo de manera realista:
    // 75% al corriente, 15% 1 mes pendiente, 7% 2-4 meses (tag restringido), 3% 6+ meses (agua restringida)
    const isOverdueTag = i % 14 === 0;
    const isOverdueWater = i === 42 || i === 98;
    const isOneMonth = i % 7 === 0 && !isOverdueTag && !isOverdueWater;

    const consumoM3 = 6 + (i % 9);
    const costM3 = consumoM3 * 33.89;
    const totalAgua = Number((costM3 + 25.00).toFixed(2));
    const lecturaAnt = 500 + i * 4;
    const lecturaAct = lecturaAnt + consumoM3;

    let mesesAdeudo = 0;
    let cuotaMantenimiento = 325.00;
    let totalMantenimiento = 325.00;
    let capitalPendiente = 0.00;

    if (isOverdueWater) {
      mesesAdeudo = 6;
      totalMantenimiento = 325 * 6 + 156.00;
      capitalPendiente = 325 * 5;
    } else if (isOverdueTag) {
      mesesAdeudo = 2;
      totalMantenimiento = 325 * 2 + 52.00;
      capitalPendiente = 325;
    } else if (isOneMonth) {
      mesesAdeudo = 1;
      totalMantenimiento = 325 + 26.00;
    } else if (i % 5 === 0) {
      // Saldo a favor
      totalMantenimiento = 280.00;
      capitalPendiente = -45.00;
    }

    const waterHistory: WaterMonthHistory[] = [
      { mes: '2026 AGOSTO', consumoM3: consumoM3 - 1, totalMes: totalAgua - 30, acumulado: totalAgua - 30, suPago: totalAgua - 30, fechaPago: '05/08/2026', remanente: 0.00 },
      { mes: '2026 SEPTIEMBRE', consumoM3: consumoM3, totalMes: totalAgua, acumulado: totalAgua, suPago: isOneMonth ? 0 : totalAgua, fechaPago: isOneMonth ? '' : '10/09/2026', remanente: isOneMonth ? totalAgua : 0.00 },
      { mes: '2026 OCTUBRE', consumoM3: consumoM3, totalMes: totalAgua, acumulado: isOneMonth ? totalAgua * 2 : totalAgua, suPago: 0.00, fechaPago: '', remanente: isOneMonth ? totalAgua * 2 : totalAgua },
    ];

    const titular = residentNames[(i - 1) % residentNames.length];

    houses.push({
      id: i,
      numeroCasa: numStr,
      titular,
      telefono: `442 ${100 + (i % 900)} ${2000 + i}`,
      email: `casa${i}@condobeire.mx`,
      medidor: `16102${(6800 + i).toString()}`,
      tagVehicularActivo: !isOverdueTag && !isOverdueWater,
      servicioAguaActivo: !isOverdueWater,
      waterBill: {
        folio: `2026 OCTUBRE ${numStr}`,
        periodo: '2026 OCTUBRE',
        medidor: `16102${(6800 + i).toString()}`,
        lecturaAnterior: lecturaAnt,
        fechaLecturaAnterior: '30/08/2026',
        lecturaActual: lecturaAct,
        fechaLecturaActual: '28/09/2026',
        consumoM3,
        diasTranscurridos: 29,
        periodoAnteriorNombre: '2026 SEPTIEMBRE',
        periodoAnteriorTotal: totalAgua,
        periodoAnteriorPago: isOneMonth ? 0.00 : totalAgua,
        periodoAnteriorFechaPago: isOneMonth ? '' : '10/09/2026',
        periodoAnteriorSaldo: isOneMonth ? totalAgua : 0.00,
        periodoAnteriorRecargos: 0.00,
        periodoAnteriorPendiente: isOneMonth ? totalAgua : 0.00,
        consumoPeriodoMonto: Number(costM3.toFixed(2)),
        fondoReserva: 0.00,
        servicioAdministracion: 25.00,
        reconexion: isOverdueWater ? 200.00 : 0.00,
        multas: 0.00,
        descuentos: 0.00,
        totalPeriodoActual: totalAgua + (isOverdueWater ? 200.00 : 0.00),
        totalAPagar: isOneMonth ? totalAgua * 2 : totalAgua,
        totalLetra: `PESOS CONSOLIDADO CASA ${numStr} M.N.`,
        fechaLimitePago: 'viernes, 30 de octubre de 2026',
        mesesSinPago: mesesAdeudo,
        restriccionAPartirDe: isOverdueWater ? '01/10/2026' : '',
        historico12Meses: waterHistory,
      },
      maintenanceBill: {
        periodo: '2026 OCTUBRE',
        cuotaVigente: cuotaMantenimiento,
        totalAPagar: Number(totalMantenimiento.toFixed(2)),
        totalLetra: `PESOS M.N. CASA ${numStr}`,
        fechaLimite: '10 de octubre de 2026',
        mesAnteriorNombre: '2026 SEPTIEMBRE',
        capitalAnteriorMasCuota: cuotaMantenimiento,
        interesesAnterior: 0.00,
        totalAPagarMesAnterior: cuotaMantenimiento,
        suPagoMesAnterior: isOneMonth ? 0.00 : cuotaMantenimiento,
        fechaPagoMesAnterior: isOneMonth ? '' : '08/09/2026',
        capitalPendiente,
        interesesActualizados: mesesAdeudo > 0 ? Number((mesesAdeudo * cuotaMantenimiento * 0.08).toFixed(2)) : 0.00,
        totalDelMes: Number(totalMantenimiento.toFixed(2)),
        mesesAdeudo,
        tagVehicularRestringido: isOverdueTag || isOverdueWater,
        servicioHidraulicoRestringido: isOverdueWater,
        ledger: [
          {
            mes: '2026 SEPTIEMBRE',
            cuota: cuotaMantenimiento,
            pagosEnTiempo: isOneMonth ? 0.00 : cuotaMantenimiento,
            fechasPago: isOneMonth ? '' : '08/09/2026',
            capitalVencidoMes: isOneMonth ? -cuotaMantenimiento : 0.00,
            capitalTotalVencido: isOneMonth ? -cuotaMantenimiento : 0.00,
            interesMes: 0.00,
            sumaIntereses: 0.00,
            saldoParcial: 0.00,
            pagosExtemporaneos: 0.00,
            interesesRemanentes: 0.00,
            peSobrante: 0.00,
            capitalRemanente: 0.00,
            saldo: isOneMonth ? cuotaMantenimiento : 0.00,
          },
          {
            mes: '2026 OCTUBRE',
            cuota: cuotaMantenimiento,
            pagosEnTiempo: 0.00,
            fechasPago: '',
            capitalVencidoMes: 0.00,
            capitalTotalVencido: capitalPendiente,
            interesMes: 0.00,
            sumaIntereses: 0.00,
            saldoParcial: totalMantenimiento,
            pagosExtemporaneos: 0.00,
            interesesRemanentes: 0.00,
            peSobrante: 0.00,
            capitalRemanente: capitalPendiente,
            saldo: totalMantenimiento,
          },
        ],
      },
    });
  }

  return houses;
}

// Acuerdos por Casa Iniciales
export const INITIAL_AGREEMENTS: HouseAgreement[] = [
  {
    id: 'agr-001',
    casaId: 59,
    titulo: 'Ajuste contable por acuerdo de mesa directiva',
    fecha: '10/09/2022',
    descripcion: 'Ajuste por acuerdo con Jorge que no se habia considerado en el corte de mantenimiento del mes.',
    tipo: 'Ajuste de Saldo',
    montoAjuste: 467.00,
    estatus: 'Cumplido',
    autorizadoPor: 'Mesa Directiva (Jorge / Hábitat Condominal)',
  },
  {
    id: 'agr-002',
    casaId: 59,
    titulo: 'Convenio de regularización de pagos extemporáneos',
    fecha: '18/02/2026',
    descripcion: 'Se autoriza aplicación preferente de pagos de $450-$500 mensuales para liquidación acelerada de intereses moratorios al 8%.',
    tipo: 'Convenio de Pago',
    montoAjuste: 0.00,
    estatus: 'Cumplido',
    autorizadoPor: 'Administración Hábitat Condominal',
  },
  {
    id: 'agr-003',
    casaId: 14,
    titulo: 'Convenio de pago diferido por mantenimiento atrasado',
    fecha: '15/07/2026',
    descripcion: 'Pago en 3 exhibiciones quincenales de $400.00 para reactivar controles vehiculares.',
    tipo: 'Convenio de Pago',
    estatus: 'Vigente',
    autorizadoPor: 'Presidente de Asociación',
  },
  {
    id: 'agr-004',
    casaId: 42,
    titulo: 'Acuerdo de verificación de medidor hidráulico',
    fecha: '20/08/2026',
    descripcion: 'Revisión técnica de válvula check y calibración del medidor CEA para descartar fuga interna.',
    tipo: 'Acuerdo Directiva',
    estatus: 'Vigente',
    autorizadoPor: 'Vocal de Vigilancia',
  },
];

// Minutas de Asambleas Iniciales
export const INITIAL_MINUTES: AssemblyMinute[] = [
  {
    id: 'min-001',
    titulo: 'Asamblea General Ordinaria Anual 2026',
    tipo: 'Ordinaria',
    fecha: '24 de Enero de 2026',
    hora: '19:30 hrs',
    lugar: 'Área Común / Terraza Condominio BEIRE',
    quorumPorcentaje: 78.6,
    resumen: 'Presentación del informe financiero 2025, aprobación de presupuesto operativo 2026 y ratificación del comité de vigilancia.',
    acuerdos: [
      'Se aprueba por mayoría calificada la actualización de la cuota ordinaria de mantenimiento a $325.00 MXN mensuales a partir de Febrero 2026.',
      'Se mantiene el interés moratorio del 8% mensual sobre capital vencido a pagos posteriores al día 10 de cada mes.',
      'Se ratifica la regla de restricción de control vehicular remoto a partir de acumular 2 cuotas de mantenimiento vencidas.',
      'Se ratifica la suspensión del suministro hidráulico particular al acumular 6 cuotas vencidas, con cobro de reconexión de $200.00 MXN.',
      'Aprobación de impermeabilización preventiva en caseta de vigilancia y mantenimiento semestral de portón automático.',
    ],
    firmantes: 'Presidente Mesa Directiva, Secretario, Administrador Hábitat Condominal y Escrutadores.',
  },
  {
    id: 'min-002',
    titulo: 'Asamblea Extraordinaria - Medición de Agua y CEA',
    tipo: 'Extraordinaria',
    fecha: '15 de Mayo de 2026',
    hora: '20:00 hrs',
    lugar: 'Palapa Central del Condominio',
    quorumPorcentaje: 69.2,
    resumen: 'Acuerdos tomados respecto a la tarifa oficial de la Comisión Estatal de Aguas (CEA), saneamiento y cuota fija de administración de agua.',
    acuerdos: [
      'Se ratifica el cobro de $25.00 MXN mensuales por concepto de gastos de administración y lectura de la red hidráulica.',
      'Fecha límite de pago de agua fijada estrictamente al último día del mes en curso.',
      'Se instruye a administración a emitir los recibos individuales con desglose del CEA e histórico de 12 meses antes del día 5 de cada mes.',
    ],
    firmantes: 'Mesa Directiva y Administrador en turno.',
  },
];

// Reportes y Sugerencias de Mantenimiento Iniciales
export const INITIAL_REPORTS: MaintenanceReport[] = [
  {
    id: 'rep-101',
    casaId: 59,
    tipo: 'reporte',
    categoria: 'Portón Eléctrico / Acceso',
    titulo: 'Retraso en apertura del portón vehicular izquierdo',
    descripcion: 'Al pasar el tag vehicular o presionar el control, el motor se activa con 10 segundos de retraso y rechina la cremallera.',
    ubicacion: 'Acceso vehicular poniente sobre Av. Puente de la Reina',
    prioridad: 'Media',
    estado: 'En Proceso',
    fechaCreacion: '08/10/2026 14:32',
    fechaActualizacion: '09/10/2026 09:15',
    respuestaAdmin: 'Se programó visita del técnico de motores automatizados para el viernes a las 11:00 am para engrase y ajuste del sensor.',
    atendidoPor: 'Habitat Condominal - Juan Pérez',
  },
  {
    id: 'rep-102',
    casaId: 59,
    tipo: 'sugerencia',
    categoria: 'Sugerencia Asamblea',
    titulo: 'Instalación de luminaria solar en parque infantil',
    descripcion: 'Para mayor seguridad de los niños al anochecer, sugiero colocar un reflector solar led en el área de juegos comunal.',
    ubicacion: 'Área verde central',
    prioridad: 'Baja',
    estado: 'Recibido',
    fechaCreacion: '05/10/2026 18:20',
    fechaActualizacion: '05/10/2026 18:20',
    respuestaAdmin: 'Excelente propuesta. Se agregará a los puntos a evaluar en la siguiente junta ordinaria de directiva.',
    atendidoPor: 'Mesa Directiva',
  },
  {
    id: 'rep-103',
    casaId: 12,
    tipo: 'reporte',
    categoria: 'Fuga de Agua / Tubería',
    titulo: 'Fuga menor en llave de paso de jardín común',
    descripcion: 'Gotea constantemente la llave de riego junto al estacionamiento de visitas.',
    ubicacion: 'Jardín frontal frente a caseta',
    prioridad: 'Alta',
    estado: 'Resuelto',
    fechaCreacion: '02/10/2026 10:00',
    fechaActualizacion: '03/10/2026 12:40',
    respuestaAdmin: 'Se reemplazó el empaque y la válvula esfera por mantenimiento. Fuga reparada al 100%.',
    atendidoPor: 'Plomero de Mantenimiento',
  },
  {
    id: 'rep-104',
    casaId: 88,
    tipo: 'reporte',
    categoria: 'Alumbrado Público',
    titulo: 'Lámpara parpadeante en poste número 4',
    descripcion: 'La luminaria LED de la esquina no enciende por completo y parpadea por las noches.',
    ubicacion: 'Circuito interior oriente, frente a casa 88',
    prioridad: 'Media',
    estado: 'En Revisión',
    fechaCreacion: '09/10/2026 21:10',
    fechaActualizacion: '10/10/2026 08:30',
    respuestaAdmin: 'Electricista revisará balastro o fotocelda en el transcurso del día.',
    atendidoPor: 'Habitat Condominal',
  },
];

// Transacciones de Pagos Registradas
export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-001',
    casaId: 59,
    tipo: 'Agua',
    monto: 360.00,
    fecha: '10/09/2026',
    folioComprobante: 'BB-984210',
    metodo: 'Transferencia BanBajio',
    estatus: 'Aplicado',
    observaciones: 'Pago periodo Septiembre 2026',
  },
  {
    id: 'tx-002',
    casaId: 59,
    tipo: 'Mantenimiento',
    monto: 360.00,
    fecha: '10/09/2026',
    folioComprobante: 'BB-984211',
    metodo: 'Transferencia BanBajio',
    estatus: 'Aplicado',
    observaciones: 'Pago cuota con abono a capital pendiente',
  },
];

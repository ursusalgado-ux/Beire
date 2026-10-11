import * as XLSX from 'xlsx';
import { House, HouseAgreement } from '../types/condo';

export const excelService = {
  /**
   * Genera y descarga el archivo Excel oficial para una casa individual,
   * reproduciendo fielmente las columnas y cálculos del formato original de la Casa 59.
   */
  exportHouseExcel(house: House, agreements: HouseAgreement[] = []) {
    const wb = XLSX.utils.book_new();

    // 1. Hoja de Mantenimiento (Estado de cuenta histórico)
    const mRows: (string | number)[][] = [
      ['ESTADO DE CUENTA POR CASA - ASOCIACIÓN DE CONDÓMINOS BEIRE A.C.'],
      ['Condominio:', 'BEIRE', '', 'Casa / Interior:', house.numeroCasa],
      ['Titular:', house.titular, '', 'Periodo Actual:', house.maintenanceBill.periodo],
      ['% Interés Moratorio Mensual:', '8%', '', 'Fecha de Emisión:', new Date().toLocaleDateString('es-MX')],
      ['Capital acumulado pendiente:', house.maintenanceBill.capitalPendiente, '', 'Total a Pagar:', house.maintenanceBill.totalAPagar],
      ['Total con Letra:', house.maintenanceBill.totalLetra],
      [],
      [
        'MES',
        'CUOTA (mtto + ext)',
        'PAGOS EN TIEMPO',
        'FECHA PAGO',
        'CAPITAL VENCIDO MES',
        'CAPITAL TOTAL VENCIDO',
        'INTERÉS MES (8%)',
        'SUMA INTERESES',
        'SALDO PARCIAL',
        'PAGOS EXTEMPORÁNEOS PE',
        'INTERESES REMANENTES',
        'PE SOBRANTE',
        'CAPITAL REMANENTE',
        'SALDO FINAL',
        'OBSERVACIONES / ACUERDOS',
      ],
    ];

    house.maintenanceBill.ledger.forEach((entry) => {
      mRows.push([
        entry.mes,
        entry.cuota,
        entry.pagosEnTiempo,
        entry.fechasPago || 'N/A',
        entry.capitalVencidoMes,
        entry.capitalTotalVencido,
        entry.interesMes,
        entry.sumaIntereses,
        entry.saldoParcial,
        entry.pagosExtemporaneos,
        entry.interesesRemanentes,
        entry.peSobrante,
        entry.capitalRemanente,
        entry.saldo,
        entry.nota || '',
      ]);
    });

    const wsMantenimiento = XLSX.utils.aoa_to_sheet(mRows);
    wsMantenimiento['!cols'] = [
      { wch: 18 }, // Mes
      { wch: 16 }, // Cuota
      { wch: 16 }, // Pagos tiempo
      { wch: 14 }, // Fecha pago
      { wch: 20 }, // Cap vencido mes
      { wch: 20 }, // Cap total vencido
      { wch: 16 }, // Interes mes
      { wch: 16 }, // Suma intereses
      { wch: 14 }, // Saldo parcial
      { wch: 22 }, // Pagos extemp
      { wch: 20 }, // Intereses remanentes
      { wch: 14 }, // PE sobrante
      { wch: 18 }, // Cap remanente
      { wch: 14 }, // Saldo
      { wch: 45 }, // Observaciones
    ];
    XLSX.utils.book_append_sheet(wb, wsMantenimiento, 'Mantenimiento');

    // 2. Hoja de Agua (Recibo e histórico)
    const wRows: (string | number)[][] = [
      ['RECIBO Y ESTADO DE CUENTA DE AGUA - ASOCIACIÓN DE CONDÓMINOS BEIRE A.C.'],
      ['Folio:', house.waterBill.folio, '', 'Medidor:', house.waterBill.medidor],
      ['Casa:', house.numeroCasa, '', 'Titular:', house.titular],
      ['Periodo:', house.waterBill.periodo, '', 'Fecha Límite:', house.waterBill.fechaLimitePago],
      ['Lectura Anterior:', house.waterBill.lecturaAnterior, '', 'Fecha Lectura Ant.:', house.waterBill.fechaLecturaAnterior],
      ['Lectura Actual:', house.waterBill.lecturaActual, '', 'Fecha Lectura Act.:', house.waterBill.fechaLecturaActual],
      ['Consumo m3:', house.waterBill.consumoM3, '', 'Días Transcurridos:', house.waterBill.diasTranscurridos],
      [],
      ['DESGLOSE DE CARGOS', 'MONTO (MXN)'],
      ['Consumo del periodo (CEA Querétaro):', house.waterBill.consumoPeriodoMonto],
      ['Servicio de administración:', house.waterBill.servicioAdministracion],
      ['Fondo de reserva:', house.waterBill.fondoReserva],
      ['Reconexión:', house.waterBill.reconexion],
      ['Multas:', house.waterBill.multas],
      ['Descuentos:', house.waterBill.descuentos],
      ['Total del Periodo Actual:', house.waterBill.totalPeriodoActual],
      ['Saldo Anterior Pendiente:', house.waterBill.periodoAnteriorPendiente],
      ['TOTAL A PAGAR:', house.waterBill.totalAPagar],
      ['Total con Letra:', house.waterBill.totalLetra],
      [],
      ['HISTÓRICO ÚLTIMOS MESES'],
      ['MES', 'CONSUMO m3', 'TOTAL $ MES', 'ACUMULADO', 'SU PAGO', 'FECHA DE PAGO', 'REMANENTE'],
    ];

    house.waterBill.historico12Meses.forEach((h) => {
      wRows.push([
        h.mes,
        h.consumoM3,
        h.totalMes,
        h.acumulado,
        h.suPago,
        h.fechaPago || 'N/A',
        h.remanente,
      ]);
    });

    const wsAgua = XLSX.utils.aoa_to_sheet(wRows);
    wsAgua['!cols'] = [
      { wch: 30 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
      { wch: 16 },
    ];
    XLSX.utils.book_append_sheet(wb, wsAgua, 'Agua');

    // 3. Hoja de Acuerdos por Casa
    const houseAgreements = agreements.filter((a) => a.casaId === house.id);
    const aRows: (string | number)[][] = [
      ['ACUERDOS Y MINUTAS APLICABLES A LA CASA ' + house.numeroCasa],
      ['Titular:', house.titular],
      [],
      ['FOLIO', 'FECHA', 'TIPO', 'TÍTULO', 'ESTATUS', 'AUTORIZADO POR', 'DESCRIPCIÓN'],
    ];

    if (houseAgreements.length === 0) {
      aRows.push(['Sin convenios especiales vigentes']);
    } else {
      houseAgreements.forEach((a) => {
        aRows.push([
          a.id,
          a.fecha,
          a.tipo,
          a.titulo,
          a.estatus,
          a.autorizadoPor,
          a.descripcion,
        ]);
      });
    }

    const wsAcuerdos = XLSX.utils.aoa_to_sheet(aRows);
    wsAcuerdos['!cols'] = [
      { wch: 12 },
      { wch: 14 },
      { wch: 20 },
      { wch: 35 },
      { wch: 14 },
      { wch: 30 },
      { wch: 50 },
    ];
    XLSX.utils.book_append_sheet(wb, wsAcuerdos, 'Acuerdos_Casa');

    // Descargar archivo Excel
    const fileName = `Estado_de_Cuenta_Casa_${house.numeroCasa}_Condominio_BEIRE.xlsx`;
    XLSX.writeFile(wb, fileName);
  },

  /**
   * Genera el informe global de las 117 casas para uso exclusivo del Administrador
   */
  exportGlobalCondoExcel(houses: House[]) {
    const wb = XLSX.utils.book_new();

    const rows: (string | number)[][] = [
      ['CONDOMINIO BEIRE A.C. - RESUMEN GENERAL DE COBRANZA Y SERVICIOS (117 CASAS)'],
      ['Fecha de Corte:', new Date().toLocaleDateString('es-MX'), '', 'Total Inmuebles:', houses.length],
      ['Banco Receptor:', 'BANBAJIO - Cuenta 4771 1379 0201 - CLABE 0306 8090 0044 4473 97'],
      [],
      [
        'CASA',
        'TITULAR',
        'TELÉFONO',
        'MEDIDOR',
        'MANTENIMIENTO ($)',
        'ESTATUS MANTENIMIENTO',
        'TAG VEHICULAR',
        'CONSUMO AGUA (m3)',
        'AGUA TOTAL ($)',
        'ESTATUS AGUA',
        'TOTAL GENERAL A PAGAR ($)',
      ],
    ];

    let totalMtto = 0;
    let totalAgua = 0;
    let casasAlCorriente = 0;
    let casasRestringidas = 0;

    houses.forEach((h) => {
      const mttoMonto = h.maintenanceBill.totalAPagar;
      const aguaMonto = h.waterBill.totalAPagar;
      totalMtto += mttoMonto;
      totalAgua += aguaMonto;

      let estatusMtto = 'Al Corriente';
      if (h.maintenanceBill.mesesAdeudo >= 6) {
        estatusMtto = 'Adeudo Crítico (>= 6 meses)';
      } else if (h.maintenanceBill.mesesAdeudo >= 2) {
        estatusMtto = 'Moroso (>= 2 meses)';
      } else if (h.maintenanceBill.mesesAdeudo === 1) {
        estatusMtto = '1 Mes Pendiente';
      } else if (h.maintenanceBill.capitalPendiente < 0) {
        estatusMtto = 'Saldo a Favor';
      }

      if (h.tagVehicularActivo) {
        casasAlCorriente++;
      } else {
        casasRestringidas++;
      }

      rows.push([
        h.numeroCasa,
        h.titular,
        h.telefono,
        h.medidor,
        mttoMonto,
        estatusMtto,
        h.tagVehicularActivo ? 'ACTIVO' : 'RESTRINGIDO (BLOQUEADO)',
        h.waterBill.consumoM3,
        aguaMonto,
        h.servicioAguaActivo ? 'ACTIVO' : 'RESTRINGIDO',
        Number((mttoMonto + aguaMonto).toFixed(2)),
      ]);
    });

    // Fila de Totales
    rows.push([]);
    rows.push([
      'TOTALES',
      `${houses.length} CASAS`,
      '',
      '',
      Number(totalMtto.toFixed(2)),
      `Restringidos: ${casasRestringidas}`,
      '',
      '',
      Number(totalAgua.toFixed(2)),
      '',
      Number((totalMtto + totalAgua).toFixed(2)),
    ]);

    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [
      { wch: 8 },  // Casa
      { wch: 32 }, // Titular
      { wch: 18 }, // Teléfono
      { wch: 14 }, // Medidor
      { wch: 18 }, // Mtto
      { wch: 24 }, // Estatus Mtto
      { wch: 24 }, // Tag
      { wch: 18 }, // m3
      { wch: 16 }, // Agua
      { wch: 16 }, // Estatus Agua
      { wch: 22 }, // Total
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Cobranza_117_Casas');
    XLSX.writeFile(wb, 'Condominio_BEIRE_Resumen_General_117_Casas.xlsx');
  },
};

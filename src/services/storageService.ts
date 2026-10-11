import {
  House,
  MaintenanceReport,
  HouseAgreement,
  AssemblyMinute,
  PaymentTransaction,
  UserSession,
} from '../types/condo';
import {
  generateAll117Houses,
  INITIAL_REPORTS,
  INITIAL_AGREEMENTS,
  INITIAL_MINUTES,
  INITIAL_TRANSACTIONS,
} from '../data/mockDatabase';

const STORAGE_KEYS = {
  HOUSES: 'condobeire_houses_v1',
  REPORTS: 'condobeire_reports_v1',
  AGREEMENTS: 'condobeire_agreements_v1',
  MINUTES: 'condobeire_minutes_v1',
  TRANSACTIONS: 'condobeire_transactions_v1',
  SESSION: 'condobeire_session_v1',
};

type Listener = () => void;
const listeners: Set<Listener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export const storageService = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getHouses(): House[] {
    const raw = localStorage.getItem(STORAGE_KEYS.HOUSES);
    if (!raw) {
      const initial = generateAll117Houses();
      this.saveHouses(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      const initial = generateAll117Houses();
      this.saveHouses(initial);
      return initial;
    }
  },

  getHouse(id: number): House | undefined {
    const houses = this.getHouses();
    return houses.find((h) => h.id === id);
  },

  saveHouses(houses: House[]) {
    localStorage.setItem(STORAGE_KEYS.HOUSES, JSON.stringify(houses));
    notifyListeners();
  },

  updateHouse(updatedHouse: House) {
    const houses = this.getHouses();
    const idx = houses.findIndex((h) => h.id === updatedHouse.id);
    if (idx !== -1) {
      houses[idx] = updatedHouse;
      this.saveHouses(houses);
    }
  },

  getReports(): MaintenanceReport[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REPORTS);
    if (!raw) {
      this.saveReports(INITIAL_REPORTS);
      return INITIAL_REPORTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_REPORTS;
    }
  },

  saveReports(reports: MaintenanceReport[]) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
    notifyListeners();
  },

  addReport(report: MaintenanceReport) {
    const reports = this.getReports();
    reports.unshift(report);
    this.saveReports(reports);
  },

  updateReport(reportId: string, partial: Partial<MaintenanceReport>) {
    const reports = this.getReports();
    const idx = reports.findIndex((r) => r.id === reportId);
    if (idx !== -1) {
      reports[idx] = { ...reports[idx], ...partial, fechaActualizacion: new Date().toLocaleString('es-MX') };
      this.saveReports(reports);
    }
  },

  getAgreements(): HouseAgreement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AGREEMENTS);
    if (!raw) {
      this.saveAgreements(INITIAL_AGREEMENTS);
      return INITIAL_AGREEMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AGREEMENTS;
    }
  },

  saveAgreements(agreements: HouseAgreement[]) {
    localStorage.setItem(STORAGE_KEYS.AGREEMENTS, JSON.stringify(agreements));
    notifyListeners();
  },

  addAgreement(agreement: HouseAgreement) {
    const list = this.getAgreements();
    list.unshift(agreement);
    this.saveAgreements(list);
  },

  deleteAgreement(agreementId: string) {
    const list = this.getAgreements().filter((a) => a.id !== agreementId);
    this.saveAgreements(list);
  },

  getMinutes(): AssemblyMinute[] {
    const raw = localStorage.getItem(STORAGE_KEYS.MINUTES);
    if (!raw) {
      this.saveMinutes(INITIAL_MINUTES);
      return INITIAL_MINUTES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_MINUTES;
    }
  },

  saveMinutes(minutes: AssemblyMinute[]) {
    localStorage.setItem(STORAGE_KEYS.MINUTES, JSON.stringify(minutes));
    notifyListeners();
  },

  addMinute(minute: AssemblyMinute) {
    const list = this.getMinutes();
    list.unshift(minute);
    this.saveMinutes(list);
  },

  getTransactions(): PaymentTransaction[] {
    const raw = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (!raw) {
      this.saveTransactions(INITIAL_TRANSACTIONS);
      return INITIAL_TRANSACTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  saveTransactions(txs: PaymentTransaction[]) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
    notifyListeners();
  },

  addTransaction(tx: PaymentTransaction) {
    const list = this.getTransactions();
    list.unshift(tx);
    this.saveTransactions(list);

    // Apply payment directly to house
    const house = this.getHouse(tx.casaId);
    if (house) {
      if (tx.tipo === 'Agua') {
        const remaining = Math.max(0, house.waterBill.totalAPagar - tx.monto);
        house.waterBill.totalAPagar = Number(remaining.toFixed(2));
        if (remaining <= 0) {
          house.waterBill.mesesSinPago = 0;
          house.servicioAguaActivo = true;
        }
      } else {
        const remaining = Math.max(0, house.maintenanceBill.totalAPagar - tx.monto);
        house.maintenanceBill.totalAPagar = Number(remaining.toFixed(2));
        if (remaining <= 0) {
          house.maintenanceBill.mesesAdeudo = 0;
          house.maintenanceBill.tagVehicularRestringido = false;
          house.maintenanceBill.servicioHidraulicoRestringido = false;
          house.tagVehicularActivo = true;
          house.servicioAguaActivo = true;
        }
      }
      this.updateHouse(house);
    }
  },

  getSession(): UserSession {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        // fallback
      }
    }
    // Default session: Residente de Casa 59 (Ursu Alberto Salgado)
    const defaultSession: UserSession = {
      role: 'residente',
      casaId: 59,
      userName: 'Ursu Alberto Salgado (Casa 59)',
    };
    this.saveSession(defaultSession);
    return defaultSession;
  },

  saveSession(session: UserSession) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
    notifyListeners();
  },

  resetAll() {
    localStorage.removeItem(STORAGE_KEYS.HOUSES);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.AGREEMENTS);
    localStorage.removeItem(STORAGE_KEYS.MINUTES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    notifyListeners();
  },
};

import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { excelService } from './services/excelService';
import {
  House,
  UserSession,
  MaintenanceReport,
  HouseAgreement,
  AssemblyMinute,
  PaymentTransaction,
} from './types/condo';
import { Navbar } from './components/Navbar';
import { OverviewSection } from './components/OverviewSection';
import { WaterSection } from './components/WaterSection';
import { MaintenanceSection } from './components/MaintenanceSection';
import { ReportsSection } from './components/ReportsSection';
import { CommunitySection } from './components/CommunitySection';
import { AdminPanel } from './components/AdminPanel';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { OfflineIndicator } from './components/OfflineIndicator';

export default function App() {
  const [houses, setHouses] = useState<House[]>([]);
  const [reports, setReports] = useState<MaintenanceReport[]>([]);
  const [agreements, setAgreements] = useState<HouseAgreement[]>([]);
  const [minutes, setMinutes] = useState<AssemblyMinute[]>([]);
  const [session, setSession] = useState<UserSession>(storageService.getSession());

  const [activeTab, setActiveTab] = useState<string>('resumen');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [paymentModalType, setPaymentModalType] = useState<'Agua' | 'Mantenimiento'>('Mantenimiento');

  // Load and subscribe to storage changes
  useEffect(() => {
    const reloadData = () => {
      setHouses(storageService.getHouses());
      setReports(storageService.getReports());
      setAgreements(storageService.getAgreements());
      setMinutes(storageService.getMinutes());
      setSession(storageService.getSession());
    };

    reloadData();
    const unsubscribe = storageService.subscribe(reloadData);
    return () => unsubscribe();
  }, []);

  // Determine current active house
  const currentHouse =
    houses.find((h) => h.id === session.casaId) ||
    houses.find((h) => h.id === 59) ||
    houses[0];

  // Handlers
  const handleSelectHouse = (houseId: number) => {
    const updatedSession = { ...session, casaId: houseId };
    storageService.saveSession(updatedSession);
    setSession(updatedSession);
  };

  const handleUpdateHouse = (updated: House) => {
    storageService.updateHouse(updated);
  };

  const handleAddReport = (report: MaintenanceReport) => {
    storageService.addReport(report);
  };

  const handleUpdateReport = (reportId: string, partial: Partial<MaintenanceReport>) => {
    storageService.updateReport(reportId, partial);
  };

  const handleAddAgreement = (agr: HouseAgreement) => {
    storageService.addAgreement(agr);
  };

  const handleAddMinute = (min: AssemblyMinute) => {
    storageService.addMinute(min);
  };

  const handleAddTransaction = (tx: PaymentTransaction) => {
    storageService.addTransaction(tx);
  };

  const handleExportExcel = () => {
    if (!currentHouse) return;
    excelService.exportHouseExcel(currentHouse, agreements);
  };

  const handleOpenPayment = (type: 'Agua' | 'Mantenimiento') => {
    setPaymentModalType(type);
    setIsPaymentModalOpen(true);
  };

  const handleResetAll = () => {
    if (confirm('¿Restablecer los datos del condominio a los valores originales de demostración?')) {
      storageService.resetAll();
    }
  };

  if (!currentHouse) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-700">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold">Cargando Condominio BEIRE A.C...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 pb-20 md:pb-12 flex flex-col">
      {/* Navigation Top Header */}
      <Navbar
        currentHouse={currentHouse}
        session={session}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onExportExcel={handleExportExcel}
      />

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 flex-1 w-full">
        {activeTab === 'resumen' && (
          <OverviewSection
            house={currentHouse}
            session={session}
            reports={reports}
            minutes={minutes}
            onNavigateTab={setActiveTab}
            onExportExcel={handleExportExcel}
            onOpenPaymentModal={handleOpenPayment}
          />
        )}

        {activeTab === 'agua' && (
          <WaterSection
            house={currentHouse}
            session={session}
            onExportExcel={handleExportExcel}
            onOpenPaymentModal={handleOpenPayment}
            onUpdateHouse={handleUpdateHouse}
          />
        )}

        {activeTab === 'mantenimiento' && (
          <MaintenanceSection
            house={currentHouse}
            session={session}
            onExportExcel={handleExportExcel}
            onOpenPaymentModal={handleOpenPayment}
            onUpdateHouse={handleUpdateHouse}
          />
        )}

        {activeTab === 'reportes' && (
          <ReportsSection
            reports={reports}
            currentHouse={currentHouse}
            session={session}
            onAddReport={handleAddReport}
            onUpdateReport={handleUpdateReport}
          />
        )}

        {activeTab === 'comunidad' && (
          <CommunitySection
            currentHouse={currentHouse}
            session={session}
            agreements={agreements}
            minutes={minutes}
            onAddAgreement={handleAddAgreement}
            onAddMinute={handleAddMinute}
          />
        )}

        {activeTab === 'admin' && session.role === 'admin' && (
          <AdminPanel
            houses={houses}
            session={session}
            currentHouse={currentHouse}
            onSelectHouse={(id) => {
              handleSelectHouse(id);
              setActiveTab('resumen');
            }}
            onUpdateHouse={handleUpdateHouse}
            onOpenPaymentModal={handleOpenPayment}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      {/* Footer info (Desktop) */}
      <footer className="hidden md:block border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-slate-700">
          <div>
            <strong>Asociación de Condóminos BEIRE A.C.</strong> • Av. Puente de la Reina No. 2042 • Querétaro, Qro.
          </div>
          <div>
            Administrado por <strong>Habitat Condominal</strong> • 117 Casas Registradas
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        session={session}
      />

      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Auth & Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        houses={houses}
        currentSession={session}
        onSaveSession={(s) => {
          storageService.saveSession(s);
          setSession(s);
        }}
      />

      {/* Payment Reporting Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        houses={houses}
        currentHouse={currentHouse}
        session={session}
        defaultType={paymentModalType}
        onAddTransaction={handleAddTransaction}
      />
    </div>
  );
}

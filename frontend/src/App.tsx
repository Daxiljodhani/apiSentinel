import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';

// Layouts & Global Components
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { CommandPalette } from './components/layout/CommandPalette';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApisPage } from './pages/ApisPage';
import { ApiDetailPage } from './pages/ApiDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { EnvironmentsPage } from './pages/EnvironmentsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LogsPage } from './pages/LogsPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { AlertsPage } from './pages/AlertsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { StatusPagesPage } from './pages/StatusPagesPage';
import { PublicStatusPage } from './pages/PublicStatusPage';
import { TeamPage } from './pages/TeamPage';
import { SettingsPage } from './pages/SettingsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { ReportsPage } from './pages/ReportsPage';

const ProtectedLayout: React.FC = () => {
  const { token, isLoading } = useAuth();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-[#07111F] text-slate-400 p-12 text-center">Initializing API Sentinel...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#07111F]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenCommandPalette={() => setIsCommandPaletteOpen(true)} />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Unauthenticated Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/status/:slug" element={<PublicStatusPage />} />

              {/* Protected Workspace Application Routes */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/apis" element={<ApisPage />} />
                <Route path="/apis/:id" element={<ApiDetailPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/environments" element={<EnvironmentsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/logs" element={<LogsPage />} />
                <Route path="/incidents" element={<IncidentsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/status-pages" element={<StatusPagesPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/audit-logs" element={<AuditLogsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

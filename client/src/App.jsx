import React, { useState, useContext } from 'react';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import LodgeComplaint from './pages/LodgeComplaint';
import AdminDashboard from './pages/AdminDashboard';
import ComplaintDetails from './pages/ComplaintDetails';

function AppContent() {
  const { user, currentPage, loading } = useContext(AuthContext);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '80vh', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div className="app-init-spinner" />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Initializing Portal Systems...</span>
          <style>{`
            .app-init-spinner {
              width: 32px;
              height: 32px;
              border: 4px solid var(--border);
              border-radius: 50%;
              border-top-color: var(--primary);
              animation: spin 0.8s linear infinite;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}</style>
        </div>
      );
    }

    switch (currentPage) {
      case 'landing':
        return <Landing />;
      case 'login':
        return <Login />;
      case 'register':
        return <Register />;
      case 'dashboard':
        return user?.role === 'admin' ? <AdminDashboard /> : <CitizenDashboard />;
      case 'lodge-complaint':
        return <LodgeComplaint />;
      case 'complaint-details':
        return <ComplaintDetails />;
      default:
        return <Landing />;
    }
  };

  const hasSidebar = user && (currentPage === 'dashboard' || currentPage === 'lodge-complaint' || currentPage === 'complaint-details');

  return (
    <div className="app-container">
      <Navbar toggleMobileSidebar={toggleMobileSidebar} />
      <div className="main-content" style={{ display: 'flex', flex: 1 }}>
        {hasSidebar && (
          <Sidebar mobileOpen={mobileSidebarOpen} toggleMobileSidebar={toggleMobileSidebar} />
        )}
        <main className="page-container" style={{ flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
      
      {/* Simple Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.5rem',
        borderTop: '1px solid var(--border)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        backgroundColor: '#ffffff',
        zIndex: 10
      }}>
        © {new Date().getFullYear()} CivicTrust Online Complaint Registration (OCR) Portal. All Rights Reserved.
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

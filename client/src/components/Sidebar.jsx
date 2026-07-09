import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FileText, PlusCircle, LogOut, ArrowLeftRight, HelpCircle } from 'lucide-react';

export default function Sidebar({ mobileOpen, toggleMobileSidebar }) {
  const { user, currentPage, navigateTo, logout } = useContext(AuthContext);

  if (!user) return null;

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Console Overview',
      icon: <LayoutDashboard size={18} />,
      roles: ['citizen', 'admin']
    },
    {
      id: 'lodge-complaint',
      label: 'Lodge Grievance',
      icon: <PlusCircle size={18} />,
      roles: ['citizen']
    }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          onClick={toggleMobileSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            zIndex: 90,
            backdropFilter: 'blur(4px)',
            transition: 'var(--transition)'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className="glass"
        style={{
          width: '280px',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem 1rem',
          height: 'calc(100vh - 64px)',
          position: 'sticky',
          top: '64px',
          backgroundColor: '#ffffff',
          transition: 'transform 0.3s ease-in-out',
          zIndex: 100
        }}
        id="sidebar"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '2rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', paddingLeft: '0.75rem' }}>
            Navigation
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
            {filteredItems.map(item => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigateTo(item.id);
                    if (mobileOpen) toggleMobileSidebar();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                    color: isActive ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    textAlign: 'left'
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informational Widget */}
        <div className="card" style={{
          marginTop: 'auto',
          backgroundColor: 'var(--background)',
          padding: '1rem',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)'
        }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <HelpCircle size={14} color="var(--primary)" />
            Need Assistance?
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
            For emergency assistance or immediate public safety concerns, contact the toll-free Civic Helpline at <strong>1800-11-9999</strong>.
          </p>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            padding: '0.75rem 1rem',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'transparent',
            color: 'var(--status-rejected)',
            fontWeight: 500,
            cursor: 'pointer',
            marginTop: '1rem',
            transition: 'var(--transition)',
            textAlign: 'left'
          }}
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </aside>

      <style>{`
        @media (max-width: 1024px) {
          #sidebar {
            position: fixed !important;
            top: 64px;
            left: 0;
            bottom: 0;
            height: calc(100vh - 64px);
            transform: ${mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
        }
      `}</style>
    </>
  );
}

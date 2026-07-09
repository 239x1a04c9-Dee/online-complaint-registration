import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Shield, LogOut, User as UserIcon, Menu } from 'lucide-react';

export default function Navbar({ toggleMobileSidebar }) {
  const { user, logout, navigateTo } = useContext(AuthContext);

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.875rem 2rem',
      borderBottom: '1px solid var(--border)',
      height: '64px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && (
          <button 
            onClick={toggleMobileSidebar}
            className="btn btn-secondary"
            style={{ 
              padding: '0.5rem', 
              display: 'none', 
              borderRadius: 'var(--radius-md)'
            }}
            id="mobile-sidebar-toggle"
          >
            <Menu size={18} />
          </button>
        )}
        <div 
          onClick={() => navigateTo(user ? 'dashboard' : 'landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <Shield size={24} color="var(--primary)" strokeWidth={2.5} />
          <span style={{ 
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--primary) 0%, #1d4ed8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.02em'
          }}>
            CivicTrust <span style={{ fontWeight: 400, fontSize: '1rem', color: 'var(--text-muted)' }}>OCR</span>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
                fontWeight: 600,
                fontSize: '0.875rem'
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>{user.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                  {user.role} {user.department && `(${user.department})`}
                </span>
              </div>
            </div>
            
            <button onClick={logout} className="btn btn-secondary btn-sm" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => navigateTo('login')} className="btn btn-secondary btn-sm">Log In</button>
            <button onClick={() => navigateTo('register')} className="btn btn-primary btn-sm">Register</button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #mobile-sidebar-toggle {
            display: inline-flex !important;
          }
        }
      `}</style>
    </nav>
  );
}

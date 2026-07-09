import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, Building, ArrowRight, AlertCircle } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('citizen');
  const [department, setDepartment] = useState('General');
  const [submitting, setSubmitting] = useState(false);

  const { register, error, setError, navigateTo } = useContext(AuthContext);

  useEffect(() => {
    setError(null);
  }, [role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    const success = await register(name, email, password, role, role === 'admin' ? department : '');
    setSubmitting(false);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)',
      padding: '2rem 0'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '460px',
        boxShadow: 'var(--shadow-lg)',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Join CivicTrust to file and review local grievances</p>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--status-rejected-bg)',
            color: 'var(--status-rejected)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            fontWeight: 500,
            marginBottom: '1.5rem',
            border: '1px solid #fecaca'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Account Role Selector */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Register As</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setRole('citizen')}
                style={{
                  padding: '0.625rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: role === 'citizen' ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: role === 'citizen' ? 'var(--primary-light)' : 'white',
                  color: role === 'citizen' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'var(--transition)'
                }}
              >
                Citizen
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                style={{
                  padding: '0.625rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid',
                  borderColor: role === 'admin' ? 'var(--primary)' : 'var(--border)',
                  backgroundColor: role === 'admin' ? 'var(--primary-light)' : 'white',
                  color: role === 'admin' ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'var(--transition)'
                }}
              >
                Official / Admin
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <User size={16} />
              </div>
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="jane@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {role === 'admin' && (
            <div className="form-group">
              <label className="form-label">Assigned Department</label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '0.875rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                  pointerEvents: 'none',
                  display: 'flex'
                }}>
                  <Building size={16} />
                </div>
                <select
                  className="form-control form-select"
                  style={{ paddingLeft: '2.5rem' }}
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                >
                  <option value="General">General / HQ</option>
                  <option value="Sanitation Department">Sanitation Department</option>
                  <option value="Electricity & Power Board">Electricity & Power Board</option>
                  <option value="Roads & Public Works (PWD)">Roads & Public Works (PWD)</option>
                  <option value="Water Supply Authority">Water Supply Authority</option>
                  <option value="Waste Management">Waste Management</option>
                </select>
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                pointerEvents: 'none',
                display: 'flex'
              }}>
                <Lock size={16} />
              </div>
              <input
                type="password"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.9375rem' }}
            disabled={submitting}
          >
            {submitting ? (
              <span style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                <span className="spinner" />
                Registering...
              </span>
            ) : (
              <span style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                <span>Create Free Account</span>
                <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Already have an account? </span>
          <button 
            onClick={() => navigateTo('login')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--primary)', 
              fontWeight: 600, 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Log in here
          </button>
        </div>
      </div>
      
      <style>{`
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

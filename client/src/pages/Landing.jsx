import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, CheckCircle, Clock, Users, ArrowRight, MessageSquareCode } from 'lucide-react';

export default function Landing() {
  const { navigateTo } = useContext(AuthContext);

  const stats = [
    { label: 'Active Citizens', value: '12,480+', icon: <Users size={20} color="var(--primary)" /> },
    { label: 'Grievances Logged', value: '45,820+', icon: <ShieldAlert size={20} color="#3b82f6" /> },
    { label: 'Resolved Cases', value: '98.4%', icon: <CheckCircle size={20} color="#10b981" /> },
    { label: 'Avg. Response Time', value: '< 24 Hours', icon: <Clock size={20} color="#f59e0b" /> }
  ];

  const features = [
    {
      title: 'Structured Direct Lodging',
      description: 'Quickly lodge issues under sewage blocks, road damages, power problems, or other categories directly to municipal systems.',
      icon: '✍️'
    },
    {
      title: 'Real-time Tracking Milestone',
      description: 'Follow your complaint status step-by-step from Received to Assigned, Under Investigation, and Resolution.',
      icon: '📈'
    },
    {
      title: 'Direct Dialogue Thread',
      description: 'Communicate with assigned department officers directly through message logs, removing double handling.',
      icon: '💬'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '4rem',
        marginTop: '2rem',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.375rem 0.75rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            fontWeight: 600,
            width: 'fit-content'
          }}>
            <MessageSquareCode size={14} />
            <span>Empowering Public Services Transparency</span>
          </div>
          <h1 style={{ fontSize: '3rem', lineHeight: 1.15, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
            Modern Resolution for Civic Grievances
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: 1.6 }}>
            Submit, track, and converse on local complaints seamlessly. Online Complaint Registration (OCR) connects citizens directly with civic officials to resolve public utilities, sanitation, and municipal issues.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigateTo('register')} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              <span>Lodge a Grievance</span>
              <ArrowRight size={18} />
            </button>
            <button onClick={() => navigateTo('login')} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', fontSize: '1rem' }}>
              Portal Login
            </button>
          </div>
        </div>

        {/* Visual Decoration Illustration */}
        <div style={{
          flex: 1,
          minWidth: '320px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,64,175,0.15) 0%, rgba(255,255,255,0) 70%)',
            zIndex: 1
          }} />
          <svg width="340" height="340" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zIndex: 2, filter: 'drop-shadow(var(--shadow-lg))' }}>
            <rect x="20" y="20" width="160" height="160" rx="20" fill="white" stroke="var(--border)" strokeWidth="2" />
            <rect x="35" y="45" width="130" height="16" rx="4" fill="var(--primary-light)" />
            <rect x="35" y="70" width="80" height="8" rx="4" fill="var(--border)" />
            <rect x="35" y="85" width="110" height="8" rx="4" fill="var(--border)" />
            
            {/* Status indicators in visual */}
            <circle cx="45" cy="125" r="10" fill="#ecfdf5" stroke="#10b981" strokeWidth="2" />
            <path d="M42 125l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="65" y="121" width="70" height="8" rx="4" fill="var(--text-main)" />
            
            <circle cx="45" cy="155" r="10" fill="var(--primary-light)" stroke="var(--primary)" strokeWidth="2" />
            <circle cx="45" cy="155" r="3" fill="var(--primary)" />
            <rect x="65" y="151" width="50" height="8" rx="4" fill="var(--text-muted)" />
          </svg>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', padding: '2rem' }}>
        {stats.map((stat, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderRight: i < 3 ? '1px solid var(--border)' : 'none', paddingRight: '1rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--secondary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {stat.icon}
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)', fontFamily: 'var(--font-display)' }}>{stat.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Core Features */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>A Simplified Resolutions Pipeline</h2>
          <p style={{ color: 'var(--text-muted)' }}>CivicTrust OCR streamlines communication to bring clarity and urgency to municipal infrastructure demands.</p>
        </div>

        <div className="grid-3">
          {features.map((feature, i) => (
            <div key={i} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.25rem' }}>{feature.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.5 }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

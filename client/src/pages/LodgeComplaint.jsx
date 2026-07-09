import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, Send, AlertTriangle, AlertCircle } from 'lucide-react';

export default function LodgeComplaint() {
  const { token, navigateTo, API_URL } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('sewage block');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, category, priority })
      });

      if (res.ok) {
        navigateTo('dashboard');
      } else {
        const data = await res.json();
        setError(data.msg || 'Failed to lodge complaint');
      }
    } catch (err) {
      setError('Connection to server failed. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '680px', margin: '0 auto' }}>
      {/* Back Button Link */}
      <button 
        onClick={() => navigateTo('dashboard')} 
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          border: 'none',
          background: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: 500,
          width: 'fit-content'
        }}
      >
        <ArrowLeft size={16} />
        <span>Return to Workspace</span>
      </button>

      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Lodge Public Grievance</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Submit details regarding local infrastructure or public utility issues.</p>
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
          border: '1px solid #fecaca'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid-layout" style={{ gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        {/* Form Card */}
        <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div className="form-group">
            <label className="form-label">Grievance Category *</label>
            <select
              className="form-control form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="sewage block">Sewage Block</option>
              <option value="electricity problem">Electricity Problem</option>
              <option value="roads damage">Roads Damage</option>
              <option value="water supply">Water Supply</option>
              <option value="waste management">Waste Management</option>
              <option value="other">Other Problems</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Subject / Title *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Brief description of the issue (e.g. Sewage water leaking near Park Street)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Incident Priority *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              {['Low', 'Medium', 'High'].map(p => {
                const isActive = priority === p;
                let activeColor = 'var(--primary)';
                let activeBg = 'var(--primary-light)';
                if (p === 'Low') { activeColor = 'var(--priority-low)'; activeBg = 'var(--priority-low-bg)'; }
                if (p === 'High') { activeColor = 'var(--priority-high)'; activeBg = 'var(--priority-high-bg)'; }

                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    style={{
                      padding: '0.625rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid',
                      borderColor: isActive ? activeColor : 'var(--border)',
                      backgroundColor: isActive ? activeBg : 'white',
                      color: isActive ? activeColor : 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                      transition: 'var(--transition)'
                    }}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description *</label>
            <textarea
              className="form-control"
              style={{ minHeight: '120px', resize: 'vertical' }}
              placeholder="Provide exact address landmarks, duration of issue, and specific details to assist assigned official units..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Legal Notice */}
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--priority-medium-bg)',
            color: 'var(--priority-medium)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.75rem',
            lineHeight: 1.4,
            border: '1px solid #fde68a'
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <div>
              <strong>Legal Undertaking:</strong> By submitting, you certify that the described issue is accurate and exists. Filing intentionally false or misleading complaints is a violation of Civic Policy guidelines.
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', gap: '0.5rem', marginTop: '0.5rem' }}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner" />
                Submitting Grievance...
              </>
            ) : (
              <>
                <Send size={16} />
                <span>Submit Complaint</span>
              </>
            )}
          </button>

        </form>
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

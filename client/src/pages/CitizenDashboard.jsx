import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Plus, Filter, Search, FileText, Calendar, ChevronRight, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function CitizenDashboard() {
  const { token, navigateTo, API_URL } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters state
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let queryParams = [];
      if (statusFilter) queryParams.push(`status=${encodeURIComponent(statusFilter)}`);
      if (priorityFilter) queryParams.push(`priority=${encodeURIComponent(priorityFilter)}`);
      if (categoryFilter) queryParams.push(`category=${encodeURIComponent(categoryFilter)}`);
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const res = await fetch(`${API_URL}/complaints${queryString}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    }
    setLoading(false);
  };

  // Stat counting
  const total = complaints.length;
  const active = complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  const categoryMap = {
    'sewage block': 'Sewage Block',
    'electricity problem': 'Electricity Problem',
    'roads damage': 'Roads Damage',
    'water supply': 'Water Supply',
    'waste management': 'Waste Management',
    'other': 'Other'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 600 }}>Citizen Workspace</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track and manage your registered grievances.</p>
        </div>
        <button onClick={() => navigateTo('lodge-complaint')} className="btn btn-primary" style={{ gap: '0.375rem' }}>
          <Plus size={16} />
          <span>Lodge Grievance</span>
        </button>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid-3">
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Registered</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{total}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--status-investigation)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Investigations</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{active}</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--status-resolved)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resolved Grievances</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, marginTop: '0.25rem' }}>{resolved}</div>
        </div>
      </div>

      {/* Filters Control Card */}
      <div className="card" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500 }}>
          <Filter size={16} />
          <span>Filters:</span>
        </div>
        
        {/* Category Filter */}
        <select 
          className="form-control form-select" 
          style={{ width: 'auto', minWidth: '180px', padding: '0.5rem 2rem 0.5rem 0.75rem' }}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="sewage block">Sewage Block</option>
          <option value="electricity problem">Electricity Problem</option>
          <option value="roads damage">Roads Damage</option>
          <option value="water supply">Water Supply</option>
          <option value="waste management">Waste Management</option>
          <option value="other">Other Problems</option>
        </select>

        {/* Priority Filter */}
        <select 
          className="form-control form-select" 
          style={{ width: 'auto', minWidth: '150px', padding: '0.5rem 2rem 0.5rem 0.75rem' }}
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>

        {/* Status Filter */}
        <select 
          className="form-control form-select" 
          style={{ width: 'auto', minWidth: '160px', padding: '0.5rem 2rem 0.5rem 0.75rem' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Received">Received</option>
          <option value="Assigned">Assigned</option>
          <option value="Under Investigation">Under Investigation</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
        
        {(categoryFilter || priorityFilter || statusFilter) && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCategoryFilter('');
              setPriorityFilter('');
              setStatusFilter('');
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Complaints List Container */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '200px', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <div className="dash-spinner" />
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading Grievances...</span>
        </div>
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', borderStyle: 'dashed' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--secondary-light)', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            <FileText size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No grievances found</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            {categoryFilter || priorityFilter || statusFilter 
              ? 'No complaints match the selected filter criteria. Try updating your filters.' 
              : 'You have not registered any grievances yet. Lodge your first municipal issue below to get started.'}
          </p>
          {!categoryFilter && !priorityFilter && !statusFilter && (
            <button onClick={() => navigateTo('lodge-complaint')} className="btn btn-primary">
              <Plus size={16} />
              <span>Lodge Grievance</span>
            </button>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {complaints.map(complaint => (
            <div 
              key={complaint._id}
              className="card card-hover"
              onClick={() => navigateTo('complaint-details', complaint._id)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'pointer',
                padding: '1.25rem 1.5rem',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`badge badge-${complaint.priority.toLowerCase()}`}>
                    {complaint.priority}
                  </span>
                  <span className="badge" style={{ backgroundColor: '#f1f5f9', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {categoryMap[complaint.category] || complaint.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={12} />
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{complaint.title}</h3>
                <p style={{ 
                  color: 'var(--text-muted)', 
                  fontSize: '0.8125rem', 
                  whiteSpace: 'nowrap', 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis',
                  maxWidth: '500px'
                }}>
                  {complaint.description}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                  <span className={`badge badge-${complaint.status === 'Under Investigation' ? 'investigation' : complaint.status.toLowerCase()}`}>
                    {complaint.status}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Dept: {complaint.assignedDepartment}
                  </span>
                </div>
                <ChevronRight size={20} color="var(--text-muted)" />
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .dash-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid var(--border);
          border-radius: 50%;
          border-top-color: var(--primary);
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

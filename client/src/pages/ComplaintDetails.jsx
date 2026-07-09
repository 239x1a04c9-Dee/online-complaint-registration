import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import StatusTimeline from '../components/StatusTimeline';
import { ArrowLeft, Send, User, Building2, Calendar, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function ComplaintDetails() {
  const { token, user, currentComplaintId, navigateTo, API_URL } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Admin Action States
  const [newStatus, setNewStatus] = useState('');
  const [timelineMessage, setTimelineMessage] = useState('');
  const [newDepartment, setNewDepartment] = useState('');
  const [updatingGrievance, setUpdatingGrievance] = useState(false);

  // Chat message state
  const [chatMessage, setChatMessage] = useState('');
  const [sendingChat, setSendingChat] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchComplaintDetails();
  }, [currentComplaintId]);

  useEffect(() => {
    scrollToBottom();
  }, [complaint?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchComplaintDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/complaints/${currentComplaintId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
        setNewStatus(data.status);
        setNewDepartment(data.assignedDepartment);
      } else {
        setError('Failed to fetch complaint details.');
      }
    } catch (err) {
      setError('Connection to server failed.');
    }
    setLoading(false);
  };

  // Submit Admin status update
  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setUpdatingGrievance(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/complaints/${currentComplaintId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          message: timelineMessage,
          assignedDepartment: newDepartment
        })
      });

      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
        setTimelineMessage('');
        alert('Grievance status updated successfully!');
      } else {
        setError('Failed to update status.');
      }
    } catch (err) {
      setError('Connection failure.');
    }
    setUpdatingGrievance(false);
  };

  // Submit direct chat comment
  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    setSendingChat(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/complaints/${currentComplaintId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: chatMessage })
      });

      if (res.ok) {
        const data = await res.json();
        setComplaint(data);
        setChatMessage('');
      } else {
        setError('Failed to send comment.');
      }
    } catch (err) {
      setError('Connection failure.');
    }
    setSendingChat(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '300px', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <div className="detail-spinner" />
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Loading grievance logs...</span>
        <style>{`
          .detail-spinner {
            width: 24px;
            height: 24px;
            border: 3px solid var(--border);
            border-radius: 50%;
            border-top-color: var(--primary);
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <AlertCircle size={32} color="var(--status-rejected)" style={{ marginBottom: '1rem' }} />
        <h3>Grievance Not Found</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>The requested record could not be loaded or you are not authorized to view it.</p>
        <button onClick={() => navigateTo('dashboard')} className="btn btn-secondary btn-sm" style={{ marginTop: '1.5rem' }}>
          Back to Workspace
        </button>
      </div>
    );
  }

  const categoryMap = {
    'sewage block': 'Sewage Block',
    'electricity problem': 'Electricity Problem',
    'roads damage': 'Roads Damage',
    'water supply': 'Water Supply',
    'waste management': 'Waste Management',
    'other': 'Other Problems'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingBottom: '4rem' }}>
      
      {/* Return Navigation */}
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

      {/* Main Details Banner */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className={`badge badge-${complaint.priority.toLowerCase()}`}>{complaint.priority} Priority</span>
            <span className="badge" style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--text-muted)', fontWeight: 500 }}>
              {categoryMap[complaint.category] || complaint.category}
            </span>
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{complaint.title}</h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <User size={14} />
              Citizen: <strong>{complaint.citizenName}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Building2 size={14} />
              Assigned: <strong>{complaint.assignedDepartment}</strong>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Calendar size={14} />
              Logged: <strong>{new Date(complaint.createdAt).toLocaleDateString()}</strong>
            </span>
          </div>
          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            backgroundColor: 'var(--background)', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '0.875rem',
            lineHeight: 1.5,
            border: '1px solid var(--border)'
          }}>
            {complaint.description}
          </div>
        </div>

        {/* Current badge detail info */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Current Status</span>
          <span className={`badge badge-${complaint.status === 'Under Investigation' ? 'investigation' : complaint.status.toLowerCase()}`} style={{ fontSize: '1rem', padding: '0.375rem 1rem' }}>
            {complaint.status}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Grid: Left column handles action log/timeline, Right column handles chat dialogue */}
      <div className="grid-layout" style={{ gridTemplateColumns: '55% 42%', gap: '3%', alignItems: 'flex-start' }}>
        
        {/* Left Side: Status Steps Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Status Timeline Progress Card */}
          <StatusTimeline timeline={complaint.timeline} currentStatus={complaint.status} />

          {/* Admin Management Console Action Card */}
          {user.role === 'admin' && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--primary)" />
                Official Admin Actions
              </h3>
              
              <form onSubmit={handleAdminUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Update Status</label>
                    <select
                      className="form-control form-select"
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <option value="Received">Received</option>
                      <option value="Assigned">Assigned</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Assign Department</label>
                    <select
                      className="form-control form-select"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                    >
                      <option value="Pending Assignment">Pending Assignment</option>
                      <option value="Sanitation Department">Sanitation Department</option>
                      <option value="Electricity & Power Board">Electricity & Power Board</option>
                      <option value="Roads & Public Works (PWD)">Roads & Public Works (PWD)</option>
                      <option value="Water Supply Authority">Water Supply Authority</option>
                      <option value="Waste Management">Waste Management</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Timeline History Log Message</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Provide details about the change (e.g. Dispatched repairs unit)"
                    value={timelineMessage}
                    onChange={(e) => setTimelineMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '0.625rem', marginTop: '0.5rem' }}
                  disabled={updatingGrievance}
                >
                  {updatingGrievance ? 'Applying Changes...' : 'Apply Status Update'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Side: Direct dialogue interactive chat */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '520px', padding: 0 }}>
          
          {/* Chat Header */}
          <div style={{
            padding: '1rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <MessageSquare size={16} color="var(--primary)" />
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Dialogue Portal</h3>
          </div>

          {/* Chat Bubble Container */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: '#f8fafc'
          }}>
            {complaint.messages && complaint.messages.length === 0 ? (
              <div style={{
                display: 'flex',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                textAlign: 'center',
                padding: '2rem'
              }}>
                <MessageSquare size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <span style={{ fontSize: '0.8125rem' }}>No dialogue recorded yet. Message the assigned department directly below.</span>
              </div>
            ) : (
              complaint.messages.map((msg, index) => {
                const isSelf = msg.senderId === user.id;
                return (
                  <div 
                    key={msg._id || index}
                    style={{
                      alignSelf: isSelf ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isSelf ? 'flex-end' : 'flex-start'
                    }}
                  >
                    {/* Meta info header */}
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                      {msg.senderName} ({msg.senderRole}) • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Chat Bubble text */}
                    <div style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: 'var(--radius-lg)',
                      borderTopRightRadius: isSelf ? 'var(--radius-sm)' : 'var(--radius-lg)',
                      borderTopLeftRadius: isSelf ? 'var(--radius-lg)' : 'var(--radius-sm)',
                      backgroundColor: isSelf ? 'var(--primary)' : 'white',
                      color: isSelf ? 'white' : 'var(--text-main)',
                      fontSize: '0.875rem',
                      border: isSelf ? 'none' : '1px solid var(--border)',
                      boxShadow: 'var(--shadow-sm)',
                      wordBreak: 'break-word'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Form Footer input */}
          <form onSubmit={handleSendChat} style={{
            padding: '1rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: 'white'
          }}>
            <input
              type="text"
              className="form-control"
              placeholder="Send message to official..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              disabled={sendingChat}
            />
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.625rem', borderRadius: 'var(--radius-md)' }}
              disabled={sendingChat || !chatMessage.trim()}
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

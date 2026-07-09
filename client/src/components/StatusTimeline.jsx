import React from 'react';
import { CircleDot, CheckCircle2, AlertCircle, Clock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function StatusTimeline({ timeline, currentStatus }) {
  const steps = [
    { label: 'Received', statusKey: 'Received' },
    { label: 'Assigned', statusKey: 'Assigned' },
    { label: 'Investigation', statusKey: 'Under Investigation' },
    { label: 'Resolved', statusKey: 'Resolved' }
  ];

  // Check if status is Rejected
  const isRejected = currentStatus === 'Rejected';

  // Determine current step index
  const getStepIndex = (status) => {
    switch (status) {
      case 'Received': return 0;
      case 'Assigned': return 1;
      case 'Under Investigation': return 2;
      case 'Resolved': return 3;
      case 'Rejected': return 3;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(currentStatus);

  const getStepIcon = (index, isActive) => {
    if (index === 3 && isRejected) {
      return <AlertCircle size={20} color="var(--status-rejected)" />;
    }
    if (isActive) {
      if (index === 3) return <CheckCircle2 size={20} color="var(--status-resolved)" />;
      return <CircleDot size={20} color="var(--primary)" />;
    }
    if (index < currentStep) {
      return <CheckCircle2 size={20} color="var(--status-resolved)" />;
    }
    return <Clock size={20} color="var(--text-muted)" />;
  };

  const getStepColor = (index) => {
    if (index === 3 && isRejected) return 'var(--status-rejected)';
    if (index <= currentStep) {
      if (index === 3) return 'var(--status-resolved)';
      return 'var(--primary)';
    }
    return 'var(--border)';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      {/* Horizontal Progress Bar */}
      <div className="card" style={{ padding: '2rem 1.5rem', overflowX: 'auto' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minWidth: '500px',
          position: 'relative'
        }}>
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = currentStep > index;
            const color = getStepColor(index);
            const labelColor = isRejected && index === 3 ? 'var(--status-rejected)' : (isActive ? 'var(--primary)' : (isCompleted ? 'var(--text-main)' : 'var(--text-muted)'));

            return (
              <React.Fragment key={step.statusKey}>
                {/* Step Item */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  zIndex: 2,
                  position: 'relative',
                  width: '100px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--primary-light)' : (isCompleted ? '#ecfdf5' : '#f1f5f9'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `2px solid ${color}`,
                    transition: 'var(--transition)'
                  }}>
                    {getStepIcon(index, isActive)}
                  </div>
                  <span style={{
                    fontSize: '0.8125rem',
                    fontWeight: isActive || isCompleted ? 600 : 500,
                    color: labelColor,
                    textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}>
                    {index === 3 && isRejected ? 'Rejected' : step.label}
                  </span>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div style={{
                    flex: 1,
                    height: '4px',
                    backgroundColor: currentStep > index ? 'var(--primary)' : 'var(--border)',
                    margin: '0 -10px',
                    transform: 'translateY(-14px)',
                    zIndex: 1,
                    transition: 'var(--transition)'
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Vertical Detailed Log */}
      <div>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Activity History</h3>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          paddingLeft: '1.5rem',
          borderLeft: '2px solid var(--border)'
        }}>
          {timeline && timeline.map((item, index) => {
            const isLast = index === timeline.length - 1;
            return (
              <div key={item._id || index} style={{
                position: 'relative',
                marginBottom: isLast ? 0 : '1.5rem',
              }}>
                {/* Node indicator */}
                <div style={{
                  position: 'absolute',
                  left: 'calc(-1.5rem - 7px)',
                  top: '4px',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: isLast ? 'var(--primary)' : 'var(--text-muted)',
                  border: '2px solid white',
                  boxShadow: 'var(--shadow-sm)'
                }} />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge badge-${item.status === 'Under Investigation' ? 'investigation' : item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.375rem', color: 'var(--text-main)', fontWeight: isLast ? 500 : 400 }}>
                    {item.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

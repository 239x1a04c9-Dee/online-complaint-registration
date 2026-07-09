import React from 'react';

export default function CustomChart({ complaints }) {
  // Count by status
  const statusCounts = complaints.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, { Received: 0, Assigned: 0, 'Under Investigation': 0, Resolved: 0, Rejected: 0 });

  // Count by category
  const categoryCounts = complaints.reduce((acc, c) => {
    const cat = c.category || 'other';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {
    'sewage block': 0,
    'electricity problem': 0,
    'roads damage': 0,
    'water supply': 0,
    'waste management': 0,
    'other': 0
  });

  const totalComplaints = complaints.length;

  // Max value for bar chart scaling
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  // Status mapping for display colors
  const statusColors = {
    Received: 'var(--status-received)',
    Assigned: 'var(--status-assigned)',
    'Under Investigation': 'var(--status-investigation)',
    Resolved: 'var(--status-resolved)',
    Rejected: 'var(--status-rejected)'
  };

  const readableCategories = {
    'sewage block': 'Sewage Block',
    'electricity problem': 'Electricity Problem',
    'roads damage': 'Roads Damage',
    'water supply': 'Water Supply',
    'waste management': 'Waste Management',
    'other': 'Other Problems'
  };

  return (
    <div className="grid-2">
      {/* Category Distribution Bar Chart */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Grievances by Category</h3>
        
        {totalComplaints === 0 ? (
          <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No data to display
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = (count / maxCategoryCount) * 100;
              const actualPct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
              
              return (
                <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 500 }}>
                    <span style={{ textTransform: 'capitalize' }}>{readableCategories[cat] || cat}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{count} ({actualPct}%)</span>
                  </div>
                  <div style={{ 
                    height: '8px', 
                    width: '100%', 
                    backgroundColor: 'var(--secondary-light)', 
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${pct}%`, 
                      backgroundColor: 'var(--primary)', 
                      borderRadius: 'var(--radius-full)',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Breakdown Circle Ring Visualizer */}
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Resolution Status Breakdown</h3>

        {totalComplaints === 0 ? (
          <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            No data to display
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Simple Dynamic SVG Pie Ring */}
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                <circle className="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle>
                <circle className="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f1f5f9" strokeWidth="3"></circle>
                
                {/* Dynamically overlaying segments */}
                {(() => {
                  let accumulatedPercent = 0;
                  return Object.entries(statusCounts).map(([status, count]) => {
                    if (count === 0) return null;
                    const pct = (count / totalComplaints) * 100;
                    const strokeDasharray = `${pct} ${100 - pct}`;
                    const strokeDashoffset = 100 - accumulatedPercent + 25; // start from top
                    accumulatedPercent += pct;

                    return (
                      <circle
                        key={status}
                        cx="21"
                        cy="21"
                        r="15.91549430918954"
                        fill="transparent"
                        stroke={statusColors[status]}
                        strokeWidth="3.5"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                      />
                    );
                  });
                })()}
              </svg>
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}>
                <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{totalComplaints}</span>
                <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</span>
              </div>
            </div>

            {/* Legends */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
              {Object.entries(statusCounts).map(([status, count]) => {
                if (count === 0 && totalComplaints > 0) return null;
                const pct = totalComplaints > 0 ? Math.round((count / totalComplaints) * 100) : 0;
                return (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusColors[status] }} />
                    <span style={{ fontWeight: 500, flex: 1 }}>{status}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

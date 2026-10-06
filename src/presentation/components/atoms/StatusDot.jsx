import React from 'react';

export function StatusDot({ status = 'online', label = null }) {
  const isOnline = status === 'online';
  const dotColor = isOnline ? 'var(--color-success)' : 'var(--color-warning)';

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          animation: isOnline ? 'pulseDot 2s infinite' : 'none',
        }}
      />
      {label && (
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </div>
  );
}

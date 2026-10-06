import React from 'react';

export function Spinner({ size = 24, color = 'var(--color-primary)' }) {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    border: '2.5px solid #e2e8f0',
    borderTopColor: color,
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    display: 'inline-block',
  };

  return <span style={style} />;
}

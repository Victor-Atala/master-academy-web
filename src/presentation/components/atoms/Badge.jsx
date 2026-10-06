import React from 'react';

export function Badge({ children, variant = 'neutral', size = 'md', className = '' }) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    borderRadius: 'var(--radius-full)',
    fontWeight: 600,
    letterSpacing: '0.02em',
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '0.72rem' },
    md: { padding: '3px 10px', fontSize: '0.78rem' },
    lg: { padding: '5px 14px', fontSize: '0.85rem' },
  };

  const variants = {
    primary: { background: 'var(--color-primary-light)', color: 'var(--color-primary)' },
    accent: { background: 'var(--color-accent-light)', color: 'var(--color-accent)' },
    neutral: { background: '#f1f5f9', color: 'var(--color-text-muted)' },
    warning: { background: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    dark: { background: 'rgba(15, 23, 42, 0.75)', color: 'white', backdropFilter: 'blur(4px)' }
  };

  const computedStyle = {
    ...baseStyle,
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <span style={computedStyle} className={className}>
      {children}
    </span>
  );
}

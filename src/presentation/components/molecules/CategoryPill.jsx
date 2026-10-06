import React from 'react';

export function CategoryPill({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={'catalog-category-pill ' + (isActive ? 'active' : '')}
      style={{
        padding: '7px 18px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.84rem',
        fontWeight: isActive ? 700 : 600,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all var(--transition-fast)',
        background: isActive ? 'var(--color-primary)' : 'var(--color-card-bg)',
        color: isActive ? '#ffffff' : 'var(--color-text-muted)',
        border: isActive ? '1px solid var(--color-primary)' : '1px solid var(--color-light-border)',
        boxShadow: isActive ? '0 2px 10px rgba(30, 64, 175, 0.35)' : 'var(--shadow-xs)',
      }}
    >
      {label}
    </button>
  );
}

import React from 'react';

export function FormField({
  label,
  required = false,
  htmlFor,
  hint = null,
  error = null,
  children,
  className = '',
}) {
  return (
    <div className={`form-field-group ${className}`} style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
      {label && (
        <label
          htmlFor={htmlFor}
          style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--color-text-label)',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            letterSpacing: '-0.01em',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-danger)', fontWeight: 800, fontSize: '0.95rem' }}>*</span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.35, marginTop: '2px', fontWeight: 400 }}>
          {hint}
        </span>
      )}
      {error && (
        <span style={{ fontSize: '0.8rem', color: 'var(--color-danger)', fontWeight: 600, marginTop: '2px' }}>
          {error}
        </span>
      )}
    </div>
  );
}

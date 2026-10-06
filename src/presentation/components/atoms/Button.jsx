import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  icon: Icon = null,
  disabled = false,
  isLoading = false,
  fullWidth = false,
  onClick,
  className = '',
  style = {},
  ...props
}) {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-family-body)',
    fontWeight: 600,
    borderRadius: 'var(--radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    width: fullWidth ? '100%' : 'auto',
    lineHeight: 1.2,
  };

  const sizes = {
    xs: { padding: '5px 10px', fontSize: '0.74rem' },
    sm: { padding: '7px 14px', fontSize: '0.82rem' },
    md: { padding: '10px 18px', fontSize: '0.88rem' },
    lg: { padding: '12px 24px', fontSize: '0.96rem' },
  };

  const variants = {
    primary: {
      background: 'var(--color-primary)',
      color: 'var(--color-text-inverse, #ffffff)',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-xs)',
    },
    secondary: {
      background: 'var(--color-secondary-light)',
      color: 'var(--color-text-main)',
      border: '1px solid var(--color-light-border)',
      boxShadow: 'var(--shadow-xs)',
    },
    accent: {
      background: 'var(--color-primary)',
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-xs)',
    },
    warning: {
      background: 'var(--color-warning-light)',
      color: 'var(--color-warning)',
      border: '1px solid var(--color-light-border)',
      boxShadow: 'var(--shadow-xs)',
    },
    outline: {
      background: 'var(--color-card-bg)',
      color: 'var(--color-text-main)',
      border: '1px solid var(--color-light-border)',
      boxShadow: 'var(--shadow-xs)',
    },
    outlineSecondary: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      border: '1px solid var(--color-light-border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--color-text-muted)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'var(--color-danger)',
      color: '#ffffff',
      border: '1px solid transparent',
      boxShadow: 'var(--shadow-xs)',
    },
    dangerSubtle: {
      background: 'var(--color-danger-light)',
      color: 'var(--color-danger)',
      border: '1px solid var(--color-light-border)',
    },
    softPrimary: {
      background: 'var(--color-primary-light)',
      color: 'var(--color-primary)',
      border: '1px solid var(--color-light-border)',
    },
    softSecondary: {
      background: 'var(--color-secondary-light)',
      color: 'var(--color-secondary)',
      border: '1px solid var(--color-light-border)',
    },
    card: {
      background: 'var(--color-card-bg)',
      color: 'var(--color-text-main)',
      border: '1px solid var(--color-light-border)',
      boxShadow: 'var(--shadow-xs)',
    },
  };

  const selectedVariant = variants[variant] || variants.primary;

  const computedStyle = {
    ...baseStyle,
    ...sizes[size],
    ...selectedVariant,
    ...style,
  };

  return (
    <button
      type={type}
      style={computedStyle}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`admin-btn ${className}`}
      {...props}
    >
      {isLoading ? (
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.6s linear infinite',
          }}
        />
      ) : (
        Icon && <Icon size={size === 'xs' ? 13 : size === 'sm' ? 15 : 18} />
      )}
      <span>{children}</span>
    </button>
  );
}

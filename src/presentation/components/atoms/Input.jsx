import React, { useState } from 'react';

export function Input({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  readOnly = false,
  className = '',
  icon: Icon = null,
  style = {},
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const getBorderColor = () => {
    if (readOnly) return 'var(--color-light-border)';
    if (isFocused) return 'var(--color-primary)';
    if (isHovered) return 'var(--color-input-border-hover)';
    return 'var(--color-input-border)';
  };

  const getBgColor = () => {
    if (readOnly) return 'var(--color-light-bg)';
    if (isFocused) return 'var(--color-input-bg-focus)';
    return 'var(--color-input-bg)';
  };

  const inputStyle = {
    width: '100%',
    padding: Icon ? '12px 16px 12px 42px' : '12px 16px',
    fontSize: '0.92rem',
    fontWeight: 500,
    borderRadius: '12px',
    border: `1.5px solid ${getBorderColor()}`,
    backgroundColor: getBgColor(),
    color: 'var(--color-text-main)',
    outline: 'none',
    boxShadow: isFocused 
      ? '0 0 0 3px var(--color-primary-glow)'
      : 'var(--shadow-xs)',
    transition: 'all var(--transition-fast)',
    ...style,
  };

  return (
    <div style={containerStyle}>
      {Icon && (
        <span
          style={{
            position: 'absolute',
            left: '14px',
            color: isFocused ? 'var(--color-primary)' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            transition: 'color var(--transition-fast)',
          }}
        >
          <Icon size={18} />
        </span>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        readOnly={readOnly}
        style={inputStyle}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({
  id,
  name,
  value,
  onChange,
  options = [],
  required = false,
  className = '',
  style = {},
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const wrapStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const getBorderColor = () => {
    if (isFocused) return 'var(--color-primary)';
    if (isHovered) return 'var(--color-input-border-hover)';
    return 'var(--color-input-border)';
  };

  const getBgColor = () => {
    if (isFocused) return 'var(--color-input-bg-focus)';
    return 'var(--color-input-bg)';
  };

  const selectStyle = {
    width: '100%',
    appearance: 'none',
    padding: '12px 40px 12px 16px',
    fontSize: '0.92rem',
    fontWeight: 600,
    borderRadius: '12px',
    border: `1.5px solid ${getBorderColor()}`,
    backgroundColor: getBgColor(),
    color: 'var(--color-text-main)',
    outline: 'none',
    cursor: 'pointer',
    boxShadow: isFocused 
      ? '0 0 0 3px var(--color-primary-glow)'
      : 'var(--shadow-xs)',
    transition: 'all var(--transition-fast)',
    ...style,
  };

  return (
    <div style={wrapStyle}>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={selectStyle}
        className={className}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span
        style={{
          position: 'absolute',
          right: '14px',
          pointerEvents: 'none',
          color: isFocused ? 'var(--color-primary)' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          transition: 'color var(--transition-fast)',
        }}
      >
        <ChevronDown size={18} />
      </span>
    </div>
  );
}

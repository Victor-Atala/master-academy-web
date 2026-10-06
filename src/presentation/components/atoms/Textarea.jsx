import React, { useState } from 'react';

export function Textarea({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  className = '',
  style = {},
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getBorderColor = () => {
    if (isFocused) return 'var(--color-primary)';
    if (isHovered) return 'var(--color-input-border-hover)';
    return 'var(--color-input-border)';
  };

  const getBgColor = () => {
    if (isFocused) return 'var(--color-input-bg-focus)';
    return 'var(--color-input-bg)';
  };

  const textareaStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.92rem',
    fontWeight: 500,
    borderRadius: '12px',
    border: `1.5px solid ${getBorderColor()}`,
    backgroundColor: getBgColor(),
    color: 'var(--color-text-main)',
    outline: 'none',
    resize: 'vertical',
    lineHeight: 1.55,
    boxShadow: isFocused 
      ? '0 0 0 3px var(--color-primary-glow)'
      : 'var(--shadow-xs)',
    transition: 'all var(--transition-fast)',
    ...style,
  };

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      style={textareaStyle}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      {...props}
    />
  );
}

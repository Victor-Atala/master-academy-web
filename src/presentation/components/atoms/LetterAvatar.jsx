import React from 'react';

export const getInitials = (name = '') => {
  if (!name) return 'U';
  const cleanName = name.replace(/^(Dr\.|Dra\.|Ing\.|Prof\.|Lic\.|Mtro\.|Mtra\.)\s+/i, '').trim();
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0] || 'U').slice(0, 1).toUpperCase();
};

export const LetterAvatar = ({
  name = '',
  size = 38,
  fontSize,
  style = {},
  className = '',
  onClick,
  title
}) => {
  const initials = getInitials(name);
  const calculatedFontSize = fontSize || `${Math.max(10, Math.round(size * 0.36))}px`;

  return (
    <div
      className={`letter-avatar ${className}`.trim()}
      onClick={onClick}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        minHeight: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#1b2336',
        color: '#5b75b0',
        fontWeight: 700,
        fontSize: calculatedFontSize,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        letterSpacing: '0.5px',
        flexShrink: 0,
        userSelect: 'none',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      title={title || name}
    >
      {initials}
    </div>
  );
};

export default LetterAvatar;

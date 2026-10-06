import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchInput({ value, onChange, onClear, placeholder = 'Buscar cursos...' }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '420px', display: 'flex', alignItems: 'center' }}>
      <span style={{ position: 'absolute', left: '14px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}>
        <Search size={18} />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '11px 40px 11px 42px',
          fontSize: '0.9rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--color-light-border)',
          backgroundColor: 'var(--color-input-bg)',
          color: 'var(--color-text-main)',
          boxShadow: 'var(--shadow-sm)',
          outline: 'none',
          transition: 'all var(--transition-fast)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--color-primary)';
          e.target.style.boxShadow = '0 0 0 3px var(--color-primary-glow)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--color-light-border)';
          e.target.style.boxShadow = 'var(--shadow-sm)';
        }}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          title="Limpiar búsqueda"
          style={{
            position: 'absolute',
            right: '12px',
            color: 'var(--color-text-muted)',
            display: 'flex',
            alignItems: 'center',
            padding: '4px',
            borderRadius: '50%',
            transition: 'background var(--transition-fast)',
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

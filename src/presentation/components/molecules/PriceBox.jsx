import React from 'react';

export function PriceBox({ price, promotionalPrice }) {
  const hasDiscount = promotionalPrice < price;

  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
      {hasDiscount && (
        <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
          ${Math.round(price)}
        </span>
      )}
      <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.01em' }}>
        ${Math.round(promotionalPrice)} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>MXN</span>
      </span>
    </div>
  );
}

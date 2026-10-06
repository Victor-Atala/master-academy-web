import React from 'react';

export function SectionHeader({
  stepNumber,
  title,
  subtitle,
  actionButton = null,
}) {
  return (
    <div className="section-head">
      <div>
        {stepNumber && <span className="section-step-indicator">{stepNumber}</span>}
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-desc">{subtitle}</p>}
      </div>
      {actionButton && <div>{actionButton}</div>}
    </div>
  );
}

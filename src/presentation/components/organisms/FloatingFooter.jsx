import React from 'react';
import { Send, RotateCcw, Sparkles, Check, X, HardDrive, FileText } from 'lucide-react';
import { Button } from '../atoms/Button';

export function FloatingFooter({
  isSubmitting,
  isEditing = false,
  onReset,
  onCancelEdit,
  onSubmit,
  usedStorageMb = 65.4,
  maxStorageMb = 500,
}) {
  const numericUsed = Number(usedStorageMb) || 0;
  const numericMax = Number(maxStorageMb) || 500;
  const percentage = Math.min(100, Math.round((numericUsed / numericMax) * 100));
  const isNearLimit = percentage >= 85;
  const isOverLimit = percentage >= 100;

  return (
    <div className="floating-action-footer">
      <div className="floating-footer-inner">
        {/* Info Note */}
        <div className="footer-info-note">
          <span style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={18} />
          </span>
          <span>
            {isEditing
              ? 'Al guardar cambios, la actualización se sincronizará de inmediato con la app móvil.'
              : 'Al publicar, el curso estará disponible de inmediato en la app móvil de los alumnos.'}
          </span>
        </div>

        {/* Action Controls & Visual Aid Storage Progress Bar */}
        <div className="footer-buttons-group" style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {isEditing ? (
            <Button
              type="button"
              variant="outline"
              icon={X}
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              Cancelar edición
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              icon={RotateCcw}
              onClick={onReset}
              disabled={isSubmitting}
            >
              Limpiar campos
            </Button>
          )}

          {/* Barra de progreso de ayuda visual (máximo 500 MB por curso: PDF, Excel, etc.) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '6px 14px',
              background: 'var(--color-input-bg)',
              border: isOverLimit ? '1.5px solid var(--color-danger)' : '1px solid var(--color-light-border)',
              borderRadius: '10px',
              boxShadow: 'var(--shadow-xs)',
            }}
            title="Límite máximo de almacenamiento de ayuda visual (PDF, Excel, plantillas, etc.): 500 MB por curso"
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: isOverLimit
                  ? 'rgba(239, 68, 68, 0.15)'
                  : isNearLimit
                  ? 'var(--color-warning-light)'
                  : 'rgba(30, 64, 175, 0.12)',
                color: isOverLimit ? 'var(--color-danger)' : isNearLimit ? 'var(--color-warning)' : 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <HardDrive size={16} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-main)', whiteSpace: 'nowrap' }}>
                  Ayuda visual:
                </span>
                <span
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: isOverLimit ? 'var(--color-danger)' : isNearLimit ? 'var(--color-warning)' : 'var(--color-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {numericUsed} / {numericMax} MB
                </span>
              </div>

              {/* Progress Bar Container */}
              <div
                style={{
                  width: '135px',
                  height: '7px',
                  background: 'var(--color-card-bg)',
                  borderRadius: '999px',
                  overflow: 'hidden',
                  border: '1px solid var(--color-light-border)',
                }}
              >
                <div
                  style={{
                    width: percentage + '%',
                    height: '100%',
                    background: isOverLimit
                      ? 'var(--color-danger)'
                      : isNearLimit
                      ? 'var(--color-warning)'
                      : '#3B82F6',
                    borderRadius: '999px',
                    transition: 'width 300ms ease',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.66rem', color: 'var(--color-text-muted)' }}>
                <span>PDF, Excel, Guías</span>
                <span style={{ fontWeight: 700 }}>{percentage}%</span>
              </div>
            </div>
          </div>

          {/* Botón Principal (Publicar curso / Guardar cambios) */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={isEditing ? Check : Send}
            isLoading={isSubmitting}
            onClick={onSubmit}
            disabled={isOverLimit}
            title={isOverLimit ? 'Has superado el límite de 500 MB de ayuda visual' : ''}
          >
            {isEditing ? 'Guardar cambios' : 'Publicar curso'}
          </Button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { CheckCircle2, KeyRound, Copy, Check, Smartphone, Bell } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ModalPortal } from '../atoms/ModalPortal';

export function SuccessModal({
  isOpen,
  course,
  isEditing = false,
  onClose,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const courseTitle = course?.titulo || course?.title || 'Programa formativo';
  const courseCode = course?.codigo || course?.code || (course?.slug ? ('MA-' + course.slug.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)) : 'MA-CURSO');

  const handleCopyCode = () => {
    if (courseCode && navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(courseCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <ModalPortal isOpen={isOpen}>
      <div
        className="modal-overlay-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className="modal-content-card"
          style={{
            maxWidth: '540px',
            padding: '30px 26px',
            textAlign: 'center',
            background: 'var(--color-modal-card-bg, var(--color-card-bg, #ffffff))',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-light-border)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Animated Success Badge */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-accent-light, rgba(30, 64, 175, 0.15))',
              color: 'var(--color-accent, var(--color-primary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 4px 18px rgba(30, 64, 175, 0.3)',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h3
            style={{
              fontSize: '1.38rem',
              fontWeight: 800,
              color: 'var(--color-text-main)',
              marginBottom: '8px',
            }}
          >
            {isEditing
              ? '¡Curso actualizado con éxito!'
              : '¡Curso y Código Creados con Éxito!'}
          </h3>

          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--color-text-muted)',
              lineHeight: 1.45,
              marginBottom: '22px',
            }}
          >
            {isEditing
              ? `Los cambios aplicados a "${courseTitle}" han sido sincronizados correctamente con la base de datos y la app móvil.`
              : `El programa "${courseTitle}" ha quedado registrado y su código de acceso único ya está activo en el sistema.`}
          </p>

          {/* Featured Course Code Card (Redeemable in Mobile App) */}
          <div
            style={{
              background: 'var(--color-modal-module-header, var(--color-table-header-bg, #f8fafc))',
              border: '2px dashed var(--color-primary, var(--color-primary))',
              borderRadius: 'var(--radius-lg)',
              padding: '18px 20px',
              marginBottom: '20px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'var(--color-primary-light, rgba(30, 64, 175, 0.16))',
                color: 'var(--color-primary, var(--color-primary))',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.76rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
                marginBottom: '10px',
              }}
            >
              <KeyRound size={13} />
              <span>CÓDIGO DE CANJE PARA APP MÓVIL</span>
            </div>

            <div
              style={{
                fontSize: '1.65rem',
                fontWeight: 900,
                letterSpacing: '2.5px',
                color: 'var(--color-text-main)',
                fontFamily: 'monospace, monospace',
                background: 'var(--color-card-bg, #ffffff)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-light-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                margin: '0 auto 12px',
                userSelect: 'all',
              }}
            >
              <span>{courseCode}</span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copiar código al portapapeles"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-primary)',
                  background: copied ? 'var(--color-primary)' : 'transparent',
                  color: copied ? '#ffffff' : 'var(--color-primary)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
            </div>

            <p
              style={{
                fontSize: '0.8rem',
                color: 'var(--color-text-muted)',
                lineHeight: 1.4,
                margin: 0,
              }}
            >
              📱 Este es el código que los alumnos ingresan en la <strong>App Móvil</strong> para inscribirse y adquirir este curso inmediatamente.
            </p>
          </div>

          {/* Real-time Mobile Sync Simulation Box */}
          <div
            style={{
              background: 'var(--color-card-bg, #ffffff)',
              border: '1px solid var(--color-light-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '14px 16px',
              textAlign: 'left',
              marginBottom: '22px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary-light, rgba(30, 64, 175, 0.16))',
                color: 'var(--color-primary, var(--color-primary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Smartphone size={20} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                <Bell size={13} color="var(--color-primary)" />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                  Sincronización móvil activa
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--color-text-main)', margin: '0 0 2px 0' }}>
                {isEditing
                  ? `Actualización propagada: "${courseTitle}"`
                  : `"Nuevo curso disponible: ${courseTitle}"`}
              </p>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Disponible en el catálogo general y listo para canje con el código <strong>{courseCode}</strong>.
              </span>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={onClose} style={{ width: '100%' }}>
            Ver en Mis Cursos y Continuar →
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
}

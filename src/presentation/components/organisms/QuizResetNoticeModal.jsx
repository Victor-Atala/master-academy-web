import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Button } from '../atoms/Button';
import { ModalPortal } from '../atoms/ModalPortal';

export function QuizResetNoticeModal() {
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('ma_student_quiz_reset_notice');
      if (saved) {
        setNotice(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  const handleClose = () => {
    try {
      localStorage.removeItem('ma_student_quiz_reset_notice');
    } catch (e) {}
    setNotice(null);
  };

  if (!notice) return null;

  return (
    <ModalPortal isOpen={Boolean(notice)}>
      <div className="modal-overlay-backdrop" onClick={handleClose}>
        <div
          className="modal-content-card animate-scale-up"
          style={{
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            borderRadius: 'var(--radius-lg, 16px)',
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-light-border)',
            boxShadow: 'var(--shadow-xl)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'var(--color-warning-light)',
              color: 'var(--color-warning)',
              border: '1px solid var(--color-light-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <RotateCcw size={26} />
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)', margin: '0 0 8px 0' }}>
            Aviso de Modificación de Examen
          </h3>

          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
            El examen <strong>"{notice.quizTitle || 'Examen de Certificación'}"</strong> del curso <strong>"{notice.courseTitle || 'Master Academy'}"</strong> ha sido modificado por el instructor.
          </p>

          <div
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-primary-light)',
              border: '1px solid var(--color-light-border)',
              color: 'var(--color-primary)',
              fontSize: '0.86rem',
              fontWeight: 800,
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={18} />
            <span>Intentos restablecidos a 0 / 5</span>
          </div>

          <p style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', margin: '0 0 20px 0' }}>
            * Nota: Si ya habías finalizado y acreditado este examen con anterioridad, tu resultado histórico se mantiene intacto.
          </p>

          <Button variant="primary" fullWidth onClick={handleClose}>
            Entendido y Aceptar
          </Button>
        </div>
      </div>
    </ModalPortal>
  );
}

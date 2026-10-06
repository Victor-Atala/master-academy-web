import React, { useState } from 'react';
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { ModalPortal } from '../components/atoms/ModalPortal';

export function AuthPage({ onLogin, isLoading, error }) {
  // Login form - Acceso de Administrador
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Recovery modal state
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin(email, password);
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) return;
    setRecoveryLoading(true);
    setTimeout(() => {
      setRecoveryLoading(false);
      setRecoverySent(true);
      setRecoveryMessage(`Hemos enviado un enlace seguro de recuperación a ${recoveryEmail}. Por favor revisa tu bandeja de entrada.`);
    }, 700);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--color-light-bg)',
      }}
    >
      <div
        className="admin-card maximalist-section-enter"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-xl)',
          border: '1.5px solid var(--color-light-border)',
          borderRadius: 'var(--radius-xl)',
          background: 'var(--color-card-bg)',
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(30, 64, 175, 0.35)',
            }}
          >
            <ShieldCheck size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-text-main)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
            Master Academy
          </h2>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: 'rgba(30, 64, 175, 0.1)',
              color: 'var(--color-primary)',
              fontSize: '0.74rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            <Building2 size={13} /> Panel de Administración
          </span>
          <p style={{ margin: '10px 0 0', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
            Acceso centralizado para la gestión de cursos, ventas y liquidaciones a creadores.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            style={{
              padding: '12px 16px',
              marginBottom: '20px',
              background: 'var(--color-danger-light)',
              border: '1px solid rgba(240, 101, 72, 0.3)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-danger)',
              fontSize: '0.82rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
              Correo de Administrador
            </label>
            <div className="search-input-wrapper">
              <Mail size={16} className="search-input-icon" />
              <input
                type="email"
                placeholder="tucorreo@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                style={{ fontSize: '0.86rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label" style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem' }}>
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => {
                  setRecoveryEmail(email);
                  setRecoverySent(false);
                  setShowRecoveryModal(true);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-primary)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="search-input-wrapper" style={{ position: 'relative' }}>
              <Lock size={16} className="search-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ fontSize: '0.86rem', paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                }}
              >
                {showPassword ? <EyeOff size={16} color="var(--color-primary)" /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            type="submit"
            fullWidth
            isLoading={isLoading}
            icon={ArrowRight}
            style={{
              marginTop: '8px',
              fontWeight: 800,
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(30, 64, 175, 0.3)',
            }}
          >
            Ingresar al Panel Administrativo
          </Button>
        </form>

        

        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-light-border)' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
            Master Academy • Plataforma de Monetización & Cursos
          </span>
        </div>
      </div>

      {/* Modal Emergente de Recuperación de Contraseña */}
      {showRecoveryModal && (
        <ModalPortal isOpen={showRecoveryModal}>
          <div
            className="modal-overlay-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'rgba(0, 0, 0, 0.65)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowRecoveryModal(false)}
          >
            <div
              className="admin-card maximalist-section-enter"
              style={{
                width: '100%',
                maxWidth: '440px',
                padding: '28px',
                borderRadius: 'var(--radius-xl)',
                background: 'var(--color-card-bg)',
                border: '1.5px solid var(--color-light-border)',
                boxShadow: 'var(--shadow-xl)',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                }}
                title="Cerrar ventana"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <KeyRound size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.18rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                    Recuperar Contraseña
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Administración de Master Academy
                  </span>
                </div>
              </div>

              {recoverySent ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '12px 0' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      margin: '0 auto',
                      borderRadius: '50%',
                      background: 'var(--color-success-light)',
                      color: 'var(--color-success)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle2 size={30} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                      ¡Instrucciones enviadas!
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                      {recoveryMessage}
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => setShowRecoveryModal(false)}
                  >
                    Volver al Inicio de Sesión
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleRecoverySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                  <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
                    Ingresa tu correo institucional de administrador. Te enviaremos un enlace seguro para restablecer tu contraseña.
                  </p>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Correo Electrónico</label>
                    <div className="search-input-wrapper">
                      <Mail size={16} className="search-input-icon" />
                      <input
                        type="email"
                        placeholder="mwcomenius@gmail.com"
                        value={recoveryEmail}
                        onChange={(e) => setRecoveryEmail(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <Button
                      variant="card"
                      size="md"
                      type="button"
                      style={{ flex: 1 }}
                      onClick={() => setShowRecoveryModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      type="submit"
                      style={{ flex: 1.4 }}
                      isLoading={recoveryLoading}
                      icon={Mail}
                    >
                      Enviar Enlace
                    </Button>
                  </div>
                </form>

              )}
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

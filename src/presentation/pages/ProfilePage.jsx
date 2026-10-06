import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  CreditCard,
  Building2,
  Mail,
  Award,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Save,
  FileText,
  BadgeCheck,
  PenTool,
  UploadCloud,
  FileSignature,
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { LetterAvatar } from '../components/atoms/LetterAvatar';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { PERMISSION_DEFINITIONS, INITIAL_INSTRUCTORS } from '../../data/mock/directorSuiteData';
import { instructorFinancialRepository } from '../../data/repositories/instructorFinancialRepository';
import { TENANT_CONFIG } from '../../config/tenantConfig';

export function ProfilePage({
  user,
  onUpdateProfile,
  onLogout,
  isLoading,
  successMessage,
  error,
}) {
  const getCleanName = (rawName, email) => {
    if (!rawName || rawName.toUpperCase() === 'INSTRUCTOR' || rawName.toUpperCase() === 'ADMIN') {
      return email === 'mwcomenius@gmail.com' ? 'MWComenius' : 'Víctor Atala Lagunas';
    }
    return rawName;
  };

  const [name, setName] = useState(() => getCleanName(user?.name || user?.nombre, user?.email));
  const [email, setEmail] = useState(user?.email || 'instructor@masteracademy.mx');
  const [biografia, setBiografia] = useState(
    user?.biografia || 'Instructor titular y consultor en Arquitectura Limpia, Flutter, Dart y Desarrollo Backend con Node/Laravel. Más de 8 años capacitando ingenieros de software en Latinoamérica.'
  );

  // Signature state
  const [digitalSignatureUrl, setDigitalSignatureUrl] = useState(() => {
    try {
      return localStorage.getItem('ma_instructor_digital_signature') || 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Foreman_Signature.png';
    } catch (e) {
      return 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Foreman_Signature.png';
    }
  });
  const [signatureSaved, setSignatureSaved] = useState(false);
  const signatureInputRef = useRef(null);

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setDigitalSignatureUrl(url);
      try {
        localStorage.setItem('ma_instructor_digital_signature', url);
      } catch (err) {}
      setSignatureSaved(true);
      setTimeout(() => setSignatureSaved(false), 3000);
    }
  };

  // Financial card info state
  const [financialSaved, setFinancialSaved] = useState(false);
  const [noAplicaCard, setNoAplicaCard] = useState(() => {
    try {
      const saved = localStorage.getItem('ma_instructor_financial_info');
      if (saved) return JSON.parse(saved).noAplica || false;
    } catch (e) {}
    return false;
  });
  const [financialForm, setFinancialForm] = useState(() => {
    try {
      const saved = localStorage.getItem('ma_instructor_financial_info');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      bank: 'BBVA México',
      cardNumber: '4152 3134 5678 9012',
      clabe: '012180001234567890',
      accountHolder: getCleanName(user?.name || user?.nombre, user?.email),
      rfc: 'AALV901015AB1',
      accountType: 'Débito / Tarjeta',
      noAplicaReason: 'Convenio comercial directo con la dirección',
    };
  });

  useEffect(() => {
    let isMounted = true;
    instructorFinancialRepository
      .getFinancialInfo()
      .then((res) => {
        const data = res?.data || res;
        if (isMounted && data) {
          if (typeof data.noAplica === 'boolean') {
            setNoAplicaCard(data.noAplica);
          }
          setFinancialForm((prev) => ({
            ...prev,
            bank: data.bank || prev.bank,
            cardNumber: data.cardNumber || prev.cardNumber,
            clabe: data.clabe || prev.clabe,
            accountHolder: data.accountHolder || prev.accountHolder,
            rfc: data.rfc || prev.rfc,
            noAplicaReason: data.noAplicaReason || prev.noAplicaReason,
          }));
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFinancialSubmit = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...financialForm,
      noAplica: noAplicaCard,
    };
    try {
      localStorage.setItem('ma_instructor_financial_info', JSON.stringify(dataToSave));
    } catch (err) {}
    instructorFinancialRepository.updateFinancialInfo(dataToSave).catch(() => {});
    setFinancialSaved(true);
    setTimeout(() => setFinancialSaved(false), 3500);
  };

  const handleToggleNoAplica = () => {
    const nextVal = !noAplicaCard;
    setNoAplicaCard(nextVal);
    const dataToSave = {
      ...financialForm,
      noAplica: nextVal,
    };
    try {
      localStorage.setItem('ma_instructor_financial_info', JSON.stringify(dataToSave));
    } catch (err) {}
    instructorFinancialRepository.updateFinancialInfo(dataToSave).catch(() => {});
  };

  // Logout confirm modal
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({ name, email, biografia });
  };

  const isInstructor = user?.instructor !== false;
  const canUploadPhoto = TENANT_CONFIG.permissions.canUploadAvatar.instructor && isInstructor;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Mi Perfil de Instructor</h1>
          <p className="page-subtitle">
            Administra tu información académica, firma digital y datos financieros para liquidaciones.
          </p>
        </div>
      </div>

      {/* Success / Error Alerts */}
      {successMessage && (
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--color-primary-light)',
            border: '1px solid var(--color-light-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-primary)',
            fontSize: '0.86rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Teacher Hero Card */}
      <div
        className="admin-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          padding: '24px 28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <LetterAvatar name={user?.name || 'Usuario'} size={76} fontSize={28} />
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'var(--color-success)',
                border: '3px solid var(--color-card-bg)',
              }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                {getCleanName(user?.name || user?.nombre, user?.email)}
              </h2>
              <span className="badge-pill badge-teal">
                <BadgeCheck size={14} /> Instructor Verificado
              </span>
            </div>
            <div style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              {user?.email} • Instructor Titular
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {canUploadPhoto ? (
                <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓ Permiso habilitado: Puedes actualizar tu foto de perfil.</span>
              ) : (
                <span style={{ color: 'var(--color-warning)', fontWeight: 700 }}>🔒 Restricción: La foto de perfil de directivos y alumnos es administrada institucionalmente.</span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="dangerSubtle"
            size="sm"
            icon={LogOut}
            onClick={() => setShowLogoutConfirm(true)}
          >
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main Grid: Profile Info & Digital Signature */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Personal & Academic Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <User size={18} color="var(--color-primary)" />
              <span>Información Académica y Profesional</span>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                Nombre Completo y Grado Académico
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nombre completo del instructor"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--color-light-bg)',
                  color: 'var(--color-text-main)',
                  border: '1.5px solid var(--color-light-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                Correo Electrónico de Contacto
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@masteracademy.mx"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--color-light-bg)',
                  color: 'var(--color-text-main)',
                  border: '1.5px solid var(--color-light-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
            </div>

            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ fontWeight: 700, fontSize: '0.84rem' }}>
                Biografía y Trayectoria del Instructor
              </label>
              <textarea
                rows={4}
                value={biografia}
                onChange={(e) => setBiografia(e.target.value)}
                placeholder="Describe tu experiencia, especialidad tecnológica y certificaciones..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: 'var(--color-light-bg)',
                  color: 'var(--color-text-main)',
                  border: '1.5px solid var(--color-light-border)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'inherit',
                  fontSize: '0.86rem',
                  lineHeight: '1.5',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
              />
            </div>

            <Button
              variant="primary"
              size="md"
              type="submit"
              icon={Save}
              isLoading={isLoading}
              style={{ marginTop: '4px', alignSelf: 'flex-start' }}
            >
              Guardar Cambios de Perfil
            </Button>
          </form>
        </div>

        {/* Digital Signature Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <FileSignature size={18} color="var(--color-primary)" />
              <span>Firma Digital para Certificados</span>
            </div>
          </div>

          {signatureSaved && (
            <div style={{ padding: '8px 12px', background: 'var(--color-success-light)', color: 'var(--color-success)', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
              ✓ Firma digital cargada y vinculada a tus certificados.
            </div>
          )}

          <p style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 14px 0' }}>
            Esta firma electrónica autógrafa se estampará de forma oficial en la parte inferior de los diplomas emitidos a los alumnos que concluyan tus cursos.
          </p>

          <input
            ref={signatureInputRef}
            type="file"
            accept="image/png"
            onChange={handleSignatureUpload}
            style={{ display: 'none' }}
          />

          <div
            style={{
              padding: '18px',
              borderRadius: 'var(--radius-md)',
              background: '#ffffff',
              border: '2px dashed var(--color-light-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              minHeight: '130px',
            }}
          >
            {digitalSignatureUrl ? (
              <img
                src={digitalSignatureUrl}
                alt="Firma Digital"
                style={{ maxHeight: '70px', maxWidth: '240px', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.82rem' }}>Sin firma registrada</div>
            )}
          </div>

          <div style={{ marginTop: '14px', display: 'flex', gap: '10px' }}>
            <Button
              variant="outline"
              size="sm"
              icon={UploadCloud}
              onClick={() => signatureInputRef.current?.click()}
            >
              Cargar firma autógrafa (PNG transparente)
            </Button>
          </div>
        </div>
      </div>

      {/* Financial & Card Data Form */}
      <div className="admin-card">
        <div className="admin-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div className="admin-card-title">
            <CreditCard size={18} color="var(--color-primary)" />
            <span>Tarjetas y Datos Financieros para Liquidación</span>
          </div>

          <button
            type="button"
            onClick={handleToggleNoAplica}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: noAplicaCard ? '1px solid var(--color-danger)' : '1px solid var(--color-light-border)',
              background: noAplicaCard ? 'var(--color-danger)' : 'var(--color-danger-light)',
              color: noAplicaCard ? '#ffffff' : 'var(--color-danger)',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {noAplicaCard ? '✓ No Aplica (Trato Directo Activo)' : 'No aplica'}
          </button>
        </div>

        {financialSaved && (
          <div
            style={{
              padding: '10px 14px',
              marginBottom: '14px',
              background: 'var(--color-success-light)',
              border: '1px solid var(--color-light-border)',
              borderRadius: '8px',
              color: 'var(--color-success)',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>Datos financieros actualizados correctamente.</span>
          </div>
        )}

        {noAplicaCard ? (
          <div
            style={{
              padding: '20px',
              borderRadius: '10px',
              background: 'var(--color-warning-light)',
              border: '1.5px dashed var(--color-warning)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-warning)' }}>
              <ShieldCheck size={20} />
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800 }}>
                Modalidad Especial: No Aplica Pago por Tarjeta
              </h4>
            </div>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
              Este perfil de instructor tiene configurado un <strong>trato comercial directo o convenio especial</strong> fuera del esquema estándar de liquidación por tarjeta/CLABE. Los pagos y acuerdos se coordinan directamente con la Dirección.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFinancialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                  Institución Bancaria <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={financialForm.bank}
                  onChange={(e) => setFinancialForm({ ...financialForm, bank: e.target.value })}
                  placeholder="Ej. BBVA México, Banorte, Santander"
                  required
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--color-light-bg)', color: 'var(--color-text-main)', border: '1px solid var(--color-light-border)', borderRadius: 'var(--radius-md)', fontSize: '0.86rem' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                  CLABE Interbancaria (18 dígitos) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={financialForm.clabe}
                  onChange={(e) => setFinancialForm({ ...financialForm, clabe: e.target.value })}
                  placeholder="012180001234567890"
                  required
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--color-light-bg)', color: 'var(--color-text-main)', border: '1px solid var(--color-light-border)', borderRadius: 'var(--radius-md)', fontSize: '0.86rem', fontFamily: 'monospace' }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '0.82rem' }}>
                  RFC del Titular
                </label>
                <input
                  type="text"
                  value={financialForm.rfc}
                  onChange={(e) => setFinancialForm({ ...financialForm, rfc: e.target.value.toUpperCase() })}
                  placeholder="AALV901015AB1"
                  style={{ width: '100%', padding: '9px 12px', background: 'var(--color-light-bg)', color: 'var(--color-text-main)', border: '1px solid var(--color-light-border)', borderRadius: 'var(--radius-md)', fontSize: '0.86rem', textTransform: 'uppercase' }}
                />
              </div>
            </div>

            <Button variant="primary" size="md" type="submit" icon={Save} style={{ alignSelf: 'flex-start', marginTop: '6px' }}>
              Guardar Datos de Liquidación
            </Button>
          </form>
        )}
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <ConfirmDialog
          isOpen={showLogoutConfirm}
          title="Cerrar Sesión"
          message="¿Estás seguro de cerrar tu sesión en Master Academy?"
          confirmText="Sí, cerrar sesión"
          confirmVariant="danger"
          onConfirm={() => {
            setShowLogoutConfirm(false);
            if (onLogout) onLogout();
          }}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;

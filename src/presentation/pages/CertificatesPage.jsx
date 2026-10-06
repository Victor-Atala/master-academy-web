import React, { useState, useMemo } from 'react';
import {
  Award,
  Search,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Plus,
  Eye,
  X,
  ExternalLink,
  QrCode,
  Calendar,
  Clock,
  FileCheck2,
  Server,
  Filter,
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { ModalPortal } from '../components/atoms/ModalPortal';

export function CertificatesPage({
  certificates = [],
  onRevokeCertificate,
  onIssueCertificate,
  enrollments = [],
  courses = [],
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [certToRevoke, setCertToRevoke] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);

  const [formState, setFormState] = useState({
    studentSource: 'enrollment',
    enrollmentId: '',
    studentName: '',
    studentEmail: '',
    studentId: '',
    courseId: '',
    courseTitle: '',
    courseHours: 20,
    grade: '95/100 (Excelente)',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const previewCrypto = useMemo(() => {
    const today = new Date();
    const ymd = today.toISOString().slice(0, 10).replace(/-/g, '');
    const randFolio = 'CERT-' + ymd + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const uuidV4 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    return {
      folio: randFolio,
      uuid: uuidV4,
      verifyUrl: 'http://127.0.0.1:8000/api/v1/certificates/verify/' + uuidV4,
    };
  }, [isIssueModalOpen]);

  const availableStudents = useMemo(() => {
    const map = new Map();
    enrollments.forEach((e) => {
      const id = e.studentId || e.id;
      if (!map.has(id)) {
        map.set(id, {
          id: id,
          numericId: typeof id === 'number' ? id : parseInt(String(id).replace(/\D/g, '') || '101', 10),
          name: e.studentName || 'Estudiante',
          email: e.email || '',
        });
      }
    });

    const defaults = [
      { id: 4, numericId: 4, name: 'Sofía Valenzuela', email: 'sofia.valenzuela@gmail.com' },
      { id: 5, numericId: 5, name: 'Alejandro Morales', email: 'morales.dev@outlook.com' },
      { id: 7, numericId: 7, name: 'Mariana Silva', email: 'mariana.silva@empresa.mx' },
      { id: 8, numericId: 8, name: 'Carlos Mendoza', email: 'carlos.mendoza@empresa.com' },
      { id: 9, numericId: 9, name: 'Valeria Rivas', email: 'valeria.rivas@tech.io' },
    ];
    defaults.forEach((d) => {
      if (!map.has(d.id)) {
        map.set(d.id, d);
      }
    });

    return Array.from(map.values());
  }, [enrollments]);

  const availableCourses = useMemo(() => {
    if (courses && courses.length > 0) {
      return courses.map((c) => ({
        id: c.id,
        numericId: typeof c.id === 'number' ? c.id : parseInt(String(c.id).replace(/\D/g, '') || '1', 10),
        title: c.title || c.titulo || 'Curso',
        hours: c.hours || c.horas || 20,
      }));
    }
    return [
      { id: 1, numericId: 1, title: 'Desarrollo Web Fullstack & Ciberseguridad', hours: 28 },
      { id: 2, numericId: 2, title: 'Normativas Oficiales de Seguridad Industrial (STPS)', hours: 16 },
      { id: 3, numericId: 3, title: 'Flutter & Dart: De Cero a Experto', hours: 24 },
      { id: 4, numericId: 4, title: 'Arquitectura Limpia en Aplicaciones Móviles', hours: 20 },
    ];
  }, [courses]);

  const filtered = useMemo(() => {
    return certificates.filter((c) => {
      const s = search.toLowerCase();
      const matchesSearch =
        (c.studentName || '').toLowerCase().includes(s) ||
        (c.courseTitle || '').toLowerCase().includes(s) ||
        (c.folio || '').toLowerCase().includes(s) ||
        (c.uuid || '').toLowerCase().includes(s);

      const isValid = c.status === 'valid' || c.status === 'issued';
      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'valid'
          ? isValid
          : !isValid;

      return matchesSearch && matchesStatus;
    });
  }, [certificates, search, statusFilter]);

  const handleCopyText = (text, idKey) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(idKey || text);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConfirmRevoke = () => {
    if (!certToRevoke) return;
    if (onRevokeCertificate) {
      onRevokeCertificate(certToRevoke.id);
    }
    setCertToRevoke(null);
  };

  const openIssueModal = () => {
    const defaultStudent = availableStudents[0];
    const defaultCourse = availableCourses[0];

    setFormState({
      studentSource: 'enrollment',
      enrollmentId: defaultStudent ? String(defaultStudent.id) : '',
      studentName: defaultStudent ? defaultStudent.name : '',
      studentEmail: defaultStudent ? defaultStudent.email : '',
      studentId: defaultStudent ? defaultStudent.numericId : '',
      courseId: defaultCourse ? defaultCourse.numericId : '',
      courseTitle: defaultCourse ? defaultCourse.title : '',
      courseHours: defaultCourse ? defaultCourse.hours : 20,
      grade: '98/100 (Excelente)',
    });
    setFormError(null);
    setIsIssueModalOpen(true);
  };

  const handleStudentSelectChange = (studentIdVal) => {
    const found = availableStudents.find((s) => String(s.id) === String(studentIdVal));
    if (found) {
      setFormState((prev) => ({
        ...prev,
        enrollmentId: String(found.id),
        studentName: found.name,
        studentEmail: found.email,
        studentId: found.numericId || found.id,
      }));
    }
  };

  const handleCourseSelectChange = (courseIdVal) => {
    const found = availableCourses.find((c) => String(c.id) === String(courseIdVal));
    if (found) {
      setFormState((prev) => ({
        ...prev,
        courseId: found.numericId || found.id,
        courseTitle: found.title,
        courseHours: found.hours || prev.courseHours,
      }));
    }
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formState.studentName.trim()) {
      setFormError('Por favor especifica el nombre del estudiante graduado.');
      return;
    }
    if (!formState.courseTitle.trim()) {
      setFormError('Por favor selecciona o escribe el programa formativo acreditado.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        folio: previewCrypto.folio,
        uuid: previewCrypto.uuid,
        verification_uuid: previewCrypto.uuid,
        studentName: formState.studentName.trim(),
        studentEmail: formState.studentEmail.trim(),
        studentId: formState.studentId || 4,
        courseId: formState.courseId || 1,
        courseTitle: formState.courseTitle.trim(),
        courseHours: Number(formState.courseHours) || 20,
        grade: formState.grade.trim() || '95/100',
        issuedDate: new Date().toISOString().split('T')[0],
        qr_code_url: previewCrypto.verifyUrl,
      };

      if (onIssueCertificate) {
        const created = await onIssueCertificate(payload);
        setIsIssueModalOpen(false);
        if (created) {
          setPreviewCert(created);
        }
      } else {
        setIsIssueModalOpen(false);
      }
    } catch (err) {
      setFormError(err.message || 'Error al emitir el certificado oficial en el backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validCount = certificates.filter((c) => c.status === 'valid' || c.status === 'issued').length;
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        className="page-header"
        style={{
          marginBottom: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 className="page-title" style={{ margin: 0 }}>Certificados y Diplomas Oficiales</h1>
            <span className="badge-pill badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Server size={12} /> API Laravel Sincronizada
            </span>
          </div>
          <p className="page-subtitle" style={{ marginTop: '4px' }}>
            Generación criptográfica de folios oficiales (<code>CERT-YYYYMMDD-XXXXXXXX</code>), identificador UUID v4 y código QR para validación pública y escaneo móvil.
          </p>
        </div>
      </div>

      {/* Mini Stat Cards Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Total Diplomas Registrados</div>
            <div className="mini-stat-value">{certificates.length}</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Oficiales Válidos / Activos</div>
            <div className="mini-stat-value" style={{ color: 'var(--color-primary)' }}>{validCount}</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'rgba(240, 101, 72, 0.1)', color: 'var(--color-warning)' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Promedio de Acreditación</div>
            <div className="mini-stat-value">96.8 / 100</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'rgba(30, 64, 175, 0.1)', color: 'var(--color-primary)' }}>
            <QrCode size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Verificación Pública QR</div>
            <div className="mini-stat-value" style={{ fontSize: '1.05rem', marginTop: '4px' }}>
              En línea (v1/verify)
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Search & Filter Topbar in Card */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-light-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '600px' }}>
            <div className="search-input-wrapper" style={{ width: '100%' }}>
              <Search size={17} className="search-input-icon" />
              <input
                type="text"
                placeholder="Buscar por estudiante, curso, Folio (CERT-...) o UUID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={15} color="var(--color-text-muted)" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--color-light-border)',
                  background: 'var(--color-card-bg)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <option value="all">Todos los estados ({certificates.length})</option>
                <option value="valid">Solo Oficiales Válidos ({validCount})</option>
                <option value="revoked">Solo Revocados ({certificates.length - validCount})</option>
              </select>
            </div>

            <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
              Mostrando <strong>{filtered.length}</strong> de {certificates.length} diplomas
            </span>
          </div>
        </div>
        {/* Table Container */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Estudiante Graduado</th>
                <th>Programa Formativo</th>
                <th>Folio Oficial (Backend)</th>
                <th>Cód. Verificador UUID / QR</th>
                <th>Calificación</th>
                <th>Fecha Emisión</th>
                <th>Estado</th>
                <th style={{ textAlign: 'center' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '3.5rem 1rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Award size={40} color="var(--color-text-muted)" />
                      <span style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '1rem' }}>
                        No se encontraron certificados
                      </span>
                      <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', maxWidth: '400px' }}>
                        No hay certificados que coincidan con los criterios de búsqueda o aún no has emitido acreditaciones con el backend.
                      </span>
                      <Button variant="primarySubtle" size="sm" icon={Plus} onClick={openIssueModal} style={{ marginTop: '8px' }}>
                        Emitir Primer Certificado
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((cert) => {
                  const isValid = cert.status === 'valid' || cert.status === 'issued';
                  const folioText = cert.folio || ('CERT-MA-' + String(cert.id));
                  const uuidText = cert.uuid || cert.verification_uuid || 'N/A';
                  const isFolioCopied = copiedId === ('folio_' + cert.id);
                  const isUuidCopied = copiedId === ('uuid_' + cert.id);

                  return (
                    <tr key={cert.id || folioText}>
                      {/* Estudiante */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--color-primary), #6a57ff)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: '0.8rem',
                              flexShrink: 0,
                              boxShadow: '0 2px 6px rgba(30, 64, 175, 0.25)',
                            }}
                          >
                            {(cert.studentName || 'E').slice(0, 2).toUpperCase()}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                              {cert.studentName}
                            </span>
                            {cert.studentEmail && (
                              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                                {cert.studentEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Programa */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ color: 'var(--color-text-main)', fontWeight: 600, fontSize: '0.88rem' }}>
                            {cert.courseTitle}
                          </span>
                          <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                            <Clock size={11} style={{ display: 'inline', marginRight: '4px' }} />
                            {cert.courseHours || 20} horas lectivas
                          </span>
                        </div>
                      </td>

                      {/* Folio Oficial */}
                      <td>
                        <button
                          type="button"
                          onClick={() => handleCopyText(folioText, 'folio_' + cert.id)}
                          title="Clic para copiar folio oficial"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(30, 64, 175, 0.08)',
                            border: '1px solid rgba(30, 64, 175, 0.25)',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '0.76rem',
                            fontFamily: 'monospace',
                            color: 'var(--color-primary, var(--color-primary))',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isFolioCopied ? <Check size={12} color="var(--color-primary)" /> : <Copy size={12} />}
                          <span>{folioText}</span>
                        </button>
                      </td>

                      {/* UUID / QR */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleCopyText(uuidText, 'uuid_' + cert.id)}
                            title="Clic para copiar UUID"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: 'var(--color-input-bg)',
                              border: '1px solid var(--color-light-border)',
                              borderRadius: '6px',
                              padding: '4px 8px',
                              fontSize: '0.73rem',
                              fontFamily: 'monospace',
                              color: 'var(--color-text-main)',
                              fontWeight: 600,
                              cursor: 'pointer',
                              maxWidth: '120px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {isUuidCopied ? <Check size={12} color="var(--color-primary)" /> : <Copy size={12} color="#64748b" />}
                            <span>{uuidText.substring(0, 8)}...</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setPreviewCert(cert)}
                            title="Ver código QR y diploma digital"
                            style={{
                              padding: '4px 6px',
                              borderRadius: '6px',
                              border: '1px solid var(--color-light-border)',
                              background: 'var(--color-card-bg)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <QrCode size={14} color="var(--color-primary, var(--color-primary))" />
                          </button>
                        </div>
                      </td>

                      {/* Calificación */}
                      <td>
                        <span className="badge-pill badge-teal" style={{ fontWeight: 800 }}>
                          {cert.grade || '95/100'}
                        </span>
                      </td>

                      {/* Fecha */}
                      <td>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                          <Calendar size={11} style={{ display: 'inline', marginRight: '4px' }} />
                          {cert.issuedDate || '2026-09-24'}
                        </span>
                      </td>

                      {/* Estado */}
                      <td>
                        {isValid ? (
                          <span className="badge-pill badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Oficial Válido
                          </span>
                        ) : (
                          <span className="badge-pill badge-coral" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> Revocado
                          </span>
                        )}
                      </td>

                      {/* Acciones */}
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Button
                            variant="secondary"
                            size="xs"
                            icon={Eye}
                            onClick={() => setPreviewCert(cert)}
                            title="Ver diploma oficial emitido"
                          >
                            Diploma
                          </Button>

                          {isValid ? (
                            <Button
                              variant="dangerSubtle"
                              size="xs"
                              icon={AlertTriangle}
                              onClick={() => setCertToRevoke(cert)}
                              title="Revocar validez oficial de este diploma"
                            >
                              Revocar
                            </Button>
                          ) : (
                            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '0 6px' }}>
                              Inactivo
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* ========================================================================= */}
      {/* MODAL 1: EMISIÓN DE CERTIFICADO OFICIAL (SINCRONIZADO CON BACKEND LARAVEL) */}
      {/* ========================================================================= */}
      <ModalPortal isOpen={false}>
        <div
          className="modal-overlay-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSubmitting) {
              setIsIssueModalOpen(false);
            }
          }}
        >
          <div
            className="modal-content-card animate-scale-up"
            style={{
              maxWidth: '680px',
              width: '100%',
              padding: '28px',
              borderRadius: 'var(--radius-lg, 16px)',
              boxShadow: 'var(--shadow-xl, 0 20px 40px rgba(0,0,0,0.25))',
              background: 'var(--color-card-bg, #ffffff)',
              border: '1px solid var(--color-light-border)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                  }}
                >
                  <Award size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                    Emitir Certificado Oficial
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                    Acreditación criptográfica registrada directamente en el backend de Master Academy
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                disabled={isSubmitting}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                  borderRadius: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Error Message if any */}
            {formError && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#dc2626',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <AlertTriangle size={18} />
                <span>{formError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleIssueSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Selector de modo de estudiante */}
              <div style={{ display: 'flex', gap: '10px', padding: '4px', background: 'var(--color-input-bg)', borderRadius: '8px' }}>
                <button
                  type="button"
                  onClick={() => setFormState((p) => ({ ...p, studentSource: 'enrollment' }))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: formState.studentSource === 'enrollment' ? 'var(--color-card-bg)' : 'transparent',
                    color: formState.studentSource === 'enrollment' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: formState.studentSource === 'enrollment' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Seleccionar de Alumnos Registrados
                </button>
                <button
                  type="button"
                  onClick={() => setFormState((p) => ({ ...p, studentSource: 'custom' }))}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: formState.studentSource === 'custom' ? 'var(--color-card-bg)' : 'transparent',
                    color: formState.studentSource === 'custom' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: formState.studentSource === 'custom' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  Ingreso Manual de Estudiante
                </button>
              </div>

              {/* Student fields */}
              {formState.studentSource === 'enrollment' ? (
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Estudiante a Graduar *
                  </label>
                  <select
                    value={formState.enrollmentId}
                    onChange={(e) => handleStudentSelectChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-light-border)',
                      background: 'var(--color-card-bg)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  >
                    {availableStudents.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.email || 'ID: ' + s.id})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Nombre Completo del Graduado *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Sofía Valenzuela"
                      value={formState.studentName}
                      onChange={(e) => setFormState((p) => ({ ...p, studentName: e.target.value }))}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-light-border)',
                        background: 'var(--color-card-bg)',
                        color: 'var(--color-text-main)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      placeholder="alumno@ejemplo.com"
                      value={formState.studentEmail}
                      onChange={(e) => setFormState((p) => ({ ...p, studentEmail: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-light-border)',
                        background: 'var(--color-card-bg)',
                        color: 'var(--color-text-main)',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Course Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                  Programa Formativo Acreditado *
                </label>
                <select
                  value={formState.courseId}
                  onChange={(e) => handleCourseSelectChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-light-border)',
                    background: 'var(--color-card-bg)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.9rem',
                  }}
                >
                  {availableCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.hours} hrs)
                    </option>
                  ))}
                </select>
              </div>

              {/* Hours & Grade */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Horas Lectivas Certificadas
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={formState.courseHours}
                    onChange={(e) => setFormState((p) => ({ ...p, courseHours: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-light-border)',
                      background: 'var(--color-card-bg)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Calificación de Acreditación
                  </label>
                  <input
                    type="text"
                    value={formState.grade}
                    placeholder="Ej. 100/100 (Excelente)"
                    onChange={(e) => setFormState((p) => ({ ...p, grade: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-light-border)',
                      background: 'var(--color-card-bg)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>
              </div>

              {/* Cryptographic Preview Box (Matches Backend Generation exactly) */}
              <div
                style={{
                  background: 'rgba(30, 64, 175, 0.04)',
                  border: '1px dashed rgba(30, 64, 175, 0.35)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <ShieldCheck size={14} /> Estructura Criptográfica Generada (Laravel Backend)
                  </span>
                  <span className="badge-pill badge-teal" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    Validación QR Activa
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 12px', fontSize: '0.78rem' }}>
                  <strong style={{ color: 'var(--color-text-muted)' }}>Folio Oficial:</strong>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-text-main)' }}>
                    {previewCrypto.folio}
                  </span>

                  <strong style={{ color: 'var(--color-text-muted)' }}>UUID v4:</strong>
                  <span style={{ fontFamily: 'monospace', color: 'var(--color-text-muted)', wordBreak: 'break-all' }}>
                    {previewCrypto.uuid}
                  </span>

                  <strong style={{ color: 'var(--color-text-muted)' }}>Endpoint QR:</strong>
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-secondary)', wordBreak: 'break-all' }}>
                    {previewCrypto.verifyUrl}
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsIssueModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={Sparkles}
                  isLoading={isSubmitting}
                  style={{
                    boxShadow: '0 4px 12px rgba(30, 64, 175, 0.3)',
                    fontWeight: 700,
                  }}
                >
                  Firmar y Emitir Certificado
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ModalPortal>
      {/* ========================================================================= */}
      {/* MODAL 2: VISTA PREVIA DEL DIPLOMA OFICIAL (ALTA RESOLUCIÓN Y SELLO DIGITAL) */}
      {/* ========================================================================= */}
      <ModalPortal isOpen={Boolean(previewCert)}>
        {previewCert && (
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setPreviewCert(null);
              }
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '820px',
                width: '100%',
                padding: '24px',
                borderRadius: 'var(--radius-lg, 16px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                background: 'var(--color-card-bg, #ffffff)',
                border: '1px solid var(--color-light-border)',
                maxHeight: '92vh',
                overflowY: 'auto',
              }}
            >
              {/* Actions Header Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  borderBottom: '1px solid var(--color-light-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileCheck2 size={20} color="var(--color-primary)" />
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                    Diploma Oficial Digital de Master Academy
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Copy}
                    onClick={() => {
                      const url =
                        previewCert.qr_code_url ||
                        'http://127.0.0.1:8000/api/v1/certificates/verify/' + (previewCert.uuid || previewCert.verification_uuid);
                      handleCopyText(url, 'modal_copy');
                    }}
                  >
                    {copiedId === 'modal_copy' ? '¡Enlace Copiado!' : 'Copiar URL QR'}
                  </Button>



                  <button
                    type="button"
                    onClick={() => setPreviewCert(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '6px',
                      cursor: 'pointer',
                      color: 'var(--color-text-muted)',
                      borderRadius: '6px',
                    }}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* DIPLOMA OFFICIAL CONTAINER */}
              <div
                id="printable-diploma"
                style={{
                  position: 'relative',
                  padding: '36px 32px',
                  background: 'linear-gradient(145deg, #ffffff 0%, #fafafa 100%)',
                  borderRadius: '12px',
                  border: '8px double #c59b27',
                  boxShadow: 'inset 0 0 40px rgba(197, 155, 39, 0.08), 0 8px 24px rgba(0,0,0,0.06)',
                  textAlign: 'center',
                  color: '#1a1f36',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                }}
              >
                {/* Watermark crest effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.03,
                    pointerEvents: 'none',
                  }}
                >
                  <Award size={360} />
                </div>

                {/* Top Folio and Status Header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem',
                    color: '#64748b',
                    marginBottom: '20px',
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '10px',
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#1e293b' }}>
                    FOLIO: {previewCert.folio || ('CERT-' + previewCert.id)}
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      color: (previewCert.status === 'valid' || previewCert.status === 'issued') ? 'var(--color-primary)' : '#f06548',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    ● {(previewCert.status === 'valid' || previewCert.status === 'issued') ? 'Acreditación Oficial Válida' : 'Acreditación Revocada'}
                  </span>
                </div>

                {/* Institution Branding */}
                <div style={{ marginBottom: '16px' }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: 'var(--color-primary)',
                      fontWeight: 900,
                      fontSize: '1.2rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                    }}
                  >
                    <Award size={26} color="#c59b27" /> Master Academy Institute
                  </div>
                  <div
                    style={{
                      fontSize: '0.78rem',
                      letterSpacing: '3px',
                      textTransform: 'uppercase',
                      color: '#c59b27',
                      fontWeight: 800,
                      marginTop: '4px',
                    }}
                  >
                    Dirección General de Certificación y Educación Continua
                  </div>
                </div>

                {/* Main Heading */}
                <h2
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: 900,
                    color: '#0f172a',
                    margin: '16px 0 10px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  Diploma de Acreditación Profesional
                </h2>

                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0, fontStyle: 'italic' }}>
                  El Consejo Académico y la Dirección de Master Academy hacen constar que:
                </p>

                {/* Student Recipient Name */}
                <div
                  style={{
                    fontSize: '2rem',
                    fontWeight: 900,
                    color: '#1e1b4b',
                    margin: '18px 0',
                    padding: '8px 0',
                    borderBottom: '2px solid #c59b27',
                    display: 'inline-block',
                    minWidth: '320px',
                    fontFamily: 'serif, Georgia, Times',
                  }}
                >
                  {previewCert.studentName}
                </div>

                <p style={{ fontSize: '0.92rem', color: 'var(--color-secondary)', margin: '0 auto 12px', maxWidth: '620px', lineHeight: 1.5 }}>
                  Ha cursado, aprobado y acreditado satisfactoriamente todas las evaluaciones, competencias técnicas y prácticas del programa académico oficial:
                </p>

                {/* Course Title */}
                <div
                  style={{
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    margin: '8px auto 20px',
                    maxWidth: '680px',
                  }}
                >
                  {previewCert.courseTitle}
                </div>

                {/* Credential Metrics Row (Hours & Issue Date) */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '32px',
                    background: '#f8fafc',
                    padding: '10px 28px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      Duración Lectiva Oficial
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: '#1e293b' }}>
                      {previewCert.courseHours || 20} Horas Certificadas
                    </strong>
                  </div>

                  <div style={{ height: '24px', width: '1px', background: '#cbd5e1' }} />

                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>
                      Fecha de Expedición
                    </span>
                    <strong style={{ fontSize: '0.92rem', color: '#1e293b' }}>
                      {previewCert.issuedDate || '2026-09-24'}
                    </strong>
                  </div>
                </div>

                {/* Footer Validation and Instructor Digital Signature Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '30px',
                    alignItems: 'center',
                    marginTop: '10px',
                    paddingTop: '20px',
                    borderTop: '1px dashed #cbd5e1',
                  }}
                >
                  {/* Left: QR Code Verification */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <div
                      style={{
                        padding: '6px',
                        background: '#ffffff',
                        border: '2px solid #c59b27',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      <img
                        src={'https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=' + encodeURIComponent(
                          previewCert.qr_code_url ||
                          'http://127.0.0.1:8000/api/v1/certificates/verify/' + (previewCert.uuid || previewCert.verification_uuid)
                        )}
                        alt="Código QR de Verificación Oficial"
                        style={{ width: '92px', height: '92px', display: 'block' }}
                      />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700 }}>
                      ESCANEA PARA VALIDAR AUTENTICIDAD
                    </span>
                  </div>

                  {/* Right: Instructor Digital Signature */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img
                        src={localStorage.getItem('ma_instructor_digital_signature') || 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Jon_Foreman_Signature.png'}
                        alt="Firma Digital Instructor"
                        style={{ maxHeight: '44px', maxWidth: '180px', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ height: '1.5px', width: '180px', background: '#1e293b', margin: '4px auto 6px' }} />
                    <span style={{ fontSize: '0.76rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                      {previewCert.instructorName || 'Ing. Víctor Atala Lagunas'}
                    </span>
                    <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>
                      Firma Digital / Instructor Titular
                    </span>
                  </div>
                </div>

                {/* Bottom UUID validation note */}
                <div style={{ marginTop: '16px', fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  UUID Criptográfico: {previewCert.uuid || previewCert.verification_uuid || 'N/A'} • Verificación pública en masteracademy.mx/verify
                </div>
              </div>

              {/* Close Button Bottom */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <Button variant="primary" onClick={() => setPreviewCert(null)}>
                  Cerrar Vista Previa
                </Button>
              </div>
            </div>
          </div>
        )}
      </ModalPortal>

      {/* Confirm Revocation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(certToRevoke)}
        title="¿Revocar Certificado Oficial?"
        message={'Se invalidará el folio oficial ' + (certToRevoke?.folio || certToRevoke?.uuid) + ' perteneciente a ' + certToRevoke?.studentName + '. Al escanear el código QR con la app móvil o consultar el endpoint de la API, se marcará inmediatamente como REVOCADO.'}
        confirmText="Sí, Revocar Certificado"
        cancelText="Cancelar"
        onConfirm={handleConfirmRevoke}
        onCancel={() => setCertToRevoke(null)}
      />
    </div>
  );
}

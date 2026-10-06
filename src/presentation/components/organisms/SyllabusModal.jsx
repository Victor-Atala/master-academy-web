import React from 'react';
import { X, PlayCircle, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { Spinner } from '../atoms/Spinner';
import { ModalPortal } from '../atoms/ModalPortal';

export function SyllabusModal({
  course,
  syllabusData = [],
  isLoading,
  error,
  onClose,
}) {
  if (!course) return null;

  return (
    <ModalPortal isOpen={Boolean(course)}>
      <div className="modal-overlay-backdrop" onClick={onClose}>
        <div
          className="modal-content-card"
          style={{
            maxWidth: '680px',
            maxHeight: '88vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'var(--color-modal-card-bg, var(--color-card-bg, #ffffff))',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--color-light-border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div
            style={{
              padding: '20px 24px',
              borderBottom: '1px solid var(--color-light-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              background: 'var(--color-modal-header-bg, var(--color-card-bg, #ffffff))',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: 'var(--color-primary)',
                  }}
                >
                  Estructura Curricular
                </span>
                {course.codigo && (
                  <Badge variant="neutral">
                    {course.codigo}
                  </Badge>
                )}
                {course.categoria && (
                  <Badge variant="primary">
                    {course.categoria}
                  </Badge>
                )}
              </div>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--color-text-main)',
                  margin: 0,
                  lineHeight: 1.3,
                }}
              >
                {course.titulo || course.title}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar ventana"
              style={{
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-muted)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 150ms ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-main)';
                e.currentTarget.style.background = 'var(--color-input-bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <div
            style={{
              padding: '24px',
              overflowY: 'auto',
              flex: 1,
              background: 'var(--color-modal-card-bg, var(--color-card-bg, #ffffff))',
            }}
          >
            {isLoading && (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <Spinner size={36} />
                <p style={{ color: 'var(--color-text-muted)', marginTop: '14px', fontSize: '0.9rem', fontWeight: 500 }}>
                  Cargando módulos y clases formativas...
                </p>
              </div>
            )}

            {!isLoading && error && (
              <div
                style={{
                  padding: '20px',
                  background: 'var(--color-danger-light)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: 'var(--color-danger)',
                  fontSize: '0.88rem',
                  lineHeight: 1.45,
                }}
              >
                <strong>Error al consultar el temario:</strong> {error}
              </div>
            )}

            {!isLoading && !error && syllabusData.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px 16px',
                  color: 'var(--color-text-muted)',
                  fontSize: '0.92rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Layers size={36} color="var(--color-text-muted)" />
                <p>Este curso aún no tiene módulos ni lecciones registrados.</p>
              </div>
            )}

            {!isLoading && !error && syllabusData.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {syllabusData.map((modulo, idx) => {
                  const lessons = modulo.lessons || modulo.lecciones || modulo.children || [];
                  return (
                    <div
                      key={modulo.id || idx}
                      style={{
                        border: '1px solid var(--color-light-border)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        background: 'var(--color-card-bg)',
                        boxShadow: 'var(--shadow-xs)',
                      }}
                    >
                      {/* Module Title Bar */}
                      <div
                        style={{
                          background: 'var(--color-modal-module-header, var(--color-table-header-bg, #222630))',
                          padding: '12px 18px',
                          fontWeight: 700,
                          fontSize: '0.94rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px',
                          color: 'var(--color-text-main)',
                          borderBottom: '1px solid var(--color-light-border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <BookOpen size={18} color="var(--color-primary)" />
                          <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                            {modulo.titulo || modulo.title || `Módulo ${idx + 1}`}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-muted)',
                            fontWeight: 600,
                          }}
                        >
                          {lessons.length} {lessons.length === 1 ? 'lección' : 'lecciones'}
                        </span>
                      </div>

                      {/* Module Lessons List */}
                      <div
                        style={{
                          padding: '14px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          background: 'var(--color-card-bg)',
                        }}
                      >
                        {lessons.length === 0 ? (
                          <span style={{ fontSize: '0.84rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            Sin clases registradas en este módulo.
                          </span>
                        ) : (
                          lessons.map((les, lIdx) => (
                            <div
                              key={les.id || lIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '12px',
                                fontSize: '0.88rem',
                                paddingBottom: lIdx < lessons.length - 1 ? '10px' : '0',
                                borderBottom: lIdx < lessons.length - 1 ? '1px dashed var(--color-light-border)' : 'none',
                              }}
                            >
                              <PlayCircle
                                size={18}
                                color="var(--color-success)"
                                style={{ marginTop: '2px', flexShrink: 0 }}
                              />
                              <div style={{ flex: 1 }}>
                                <p
                                  style={{
                                    fontWeight: 600,
                                    color: 'var(--color-text-main)',
                                    margin: 0,
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {les.titulo || les.title || `Lección ${lIdx + 1}`}
                                </p>
                                {(les.contenido || les.content) && (
                                  <p
                                    style={{
                                      color: 'var(--color-text-muted)',
                                      fontSize: '0.82rem',
                                      margin: '3px 0 0 0',
                                      lineHeight: 1.45,
                                    }}
                                  >
                                    {les.contenido || les.content}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

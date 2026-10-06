import React, { useState } from 'react';
import {
  MessageSquareQuote,
  Send,
  CheckCircle2,
  Clock,
  BookOpen,
  Filter,
  User,
  AlertCircle,
  CornerDownRight,
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { LetterAvatar } from '../components/atoms/LetterAvatar';

export function InquiriesPage({ inquiries = [], onReplyInquiry }) {
  const [selectedInquiryId, setSelectedInquiryId] = useState(inquiries[0]?.id || null);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');

  const selectedInquiry = inquiries.find((i) => i.id === selectedInquiryId) || inquiries[0] || null;

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedInquiry) return;
    onReplyInquiry(selectedInquiry.id, replyText.trim());
    setReplyText('');
  };

  const filtered = inquiries.filter((item) => {
    if (filter === 'pending') return item.status === 'pending';
    if (filter === 'answered') return item.status === 'answered';
    return true;
  });

  const pendingCount = inquiries.filter((i) => i.status === 'pending').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Consultas y Dudas de Estudiantes</h1>
          <p className="page-subtitle">
            Mensajes directos recibidos desde el reproductor móvil y centro de soporte.
          </p>
        </div>
      </div>

      <div className="responsive-split-grid" style={{ minHeight: '620px' }}>
        {/* Sidebar List */}
        <div
          className="admin-card"
          style={{
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Filters Bar */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: '1px solid var(--color-light-border)',
              background: 'var(--color-input-bg)',
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              <Button
                variant={filter === 'all' ? 'primary' : 'card'}
                size="xs"
                onClick={() => setFilter('all')}
                style={{ flex: 1 }}
              >
                Todas ({inquiries.length})
              </Button>
              <Button
                variant={filter === 'pending' ? 'warning' : 'card'}
                size="xs"
                onClick={() => setFilter('pending')}
                style={{ flex: 1 }}
              >
                Pendientes ({pendingCount})
              </Button>
              <Button
                variant={filter === 'answered' ? 'primary' : 'card'}
                size="xs"
                onClick={() => setFilter('answered')}
                style={{ flex: 1 }}
              >
                Respondidas
              </Button>
            </div>
          </div>

          {/* List items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.84rem' }}>
                No hay consultas en este filtro
              </div>
            ) : (
              filtered.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;
                const isPending = inq.status === 'pending';

                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiryId(inq.id)}
                    style={{
                      padding: '14px',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '8px',
                      cursor: 'pointer',
                      border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-light-border)',
                      background: isSelected ? 'var(--color-primary-light)' : 'var(--color-card-bg)',
                      boxShadow: isSelected ? '0 2px 6px rgba(30, 64, 175, 0.15)' : 'var(--shadow-xs)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                        {inq.studentName}
                      </span>
                      {isPending ? (
                        <span className="badge-pill badge-coral">
                          <Clock size={10} /> Pendiente
                        </span>
                      ) : (
                        <span className="badge-pill badge-teal">
                          <CheckCircle2 size={10} /> Respondida
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.78rem', color: 'var(--color-secondary)', fontWeight: 600, marginBottom: '6px' }}>
                      {inq.courseTitle}
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8rem',
                        color: 'var(--color-text-muted)',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {inq.question}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      <span>Lección: {inq.lessonTitle}</span>
                      <span>{inq.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Detail & Reply Panel */}
        <div
          className="admin-card"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {selectedInquiry ? (
            <>
              {/* Question Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '14px', borderBottom: '1px solid var(--color-light-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LetterAvatar name={selectedInquiry.studentName} size={44} />
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                      {selectedInquiry.studentName}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                        {selectedInquiry.courseTitle}
                      </span>
                      <span style={{ color: '#cbd5e1' }}>•</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        {selectedInquiry.lessonTitle}
                      </span>
                    </div>
                  </div>
                </div>

                <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                  {selectedInquiry.timestamp}
                </span>
              </div>

              {/* Student's Question Bubble */}
              <div
                style={{
                  background: 'var(--color-input-bg)',
                  border: '1px solid var(--color-light-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <MessageSquareQuote size={16} color="var(--color-secondary)" />
                  <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Pregunta del Estudiante
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                  {selectedInquiry.question}
                </p>
              </div>

              {/* Teacher's Existing Reply */}
              {selectedInquiry.reply && (
                <div
                  style={{
                    background: 'var(--color-primary-light)',
                    border: '1px solid rgba(30, 64, 175, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <CheckCircle2 size={16} color="var(--color-primary)" />
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Tu Respuesta Enviada
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
                    {selectedInquiry.reply}
                  </p>
                </div>
              )}

              {/* Reply Editor Form */}
              <form onSubmit={handleSendReply} style={{ marginTop: 'auto', paddingTop: '10px' }}>
                <label className="form-label" style={{ marginBottom: '8px' }}>
                  {selectedInquiry.status === 'answered'
                    ? 'Actualizar respuesta al estudiante:'
                    : 'Escribe tu respuesta al estudiante:'}
                </label>
                <textarea
                  rows={4}
                  placeholder="Explica la solución o adjunta pasos para resolver su inquietud en Flutter..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  style={{ width: '100%', marginBottom: '12px', resize: 'vertical' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" icon={Send} type="submit" disabled={!replyText.trim()}>
                    Enviar Respuesta al Alumno
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-text-muted)' }}>
              Selecciona una consulta para ver los detalles y responder
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

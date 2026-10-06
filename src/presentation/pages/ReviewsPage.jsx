import React, { useState } from 'react';
import { Star, MessageSquare, Check, X, ShieldCheck, Filter, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { LetterAvatar } from '../components/atoms/LetterAvatar';

export function ReviewsPage({ reviews = [] }) {
  const [selectedRatingFilter, setSelectedRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reviewList, setReviewList] = useState(() =>
    reviews.map((r, i) => ({
      ...r,
      status: i % 4 === 0 ? 'hidden' : 'approved', // Estado inicial de moderación
    }))
  );

  const handleToggleStatus = (id, newStatus) => {
    setReviewList((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filtered = reviewList.filter((r) => {
    if (selectedRatingFilter === '5' && r.rating !== 5) return false;
    if (selectedRatingFilter === '4' && r.rating !== 4) return false;
    if (statusFilter === 'approved' && r.status !== 'approved') return false;
    if (statusFilter === 'hidden' && r.status !== 'hidden') return false;
    return true;
  });

  const avgRating = (
    reviewList.reduce((acc, r) => acc + r.rating, 0) / (reviewList.length || 1)
  ).toFixed(1);

  const approvedCount = reviewList.filter((r) => r.status === 'approved').length;
  const hiddenCount = reviewList.filter((r) => r.status === 'hidden').length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Moderación y Aprobación de Reseñas</h1>
          <p className="page-subtitle">
            Acepta o rechaza comentarios enviados por alumnos antes de su publicación en el catálogo del curso.
          </p>
        </div>

        {/* Global Rating Score */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            background: 'var(--color-card-bg)',
            padding: '12px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-light-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={24} fill="var(--color-warning)" color="var(--color-warning)" />
            <span style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1 }}>
              {avgRating}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Calificación General
            </span>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
              {approvedCount} de {reviewList.length} visibles públicamente
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'card'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            Todas las reseñas ({reviewList.length})
          </Button>
          <Button
            variant={statusFilter === 'approved' ? 'primary' : 'card'}
            size="sm"
            icon={Eye}
            onClick={() => setStatusFilter('approved')}
          >
            Públicas / Aprobadas ({approvedCount})
          </Button>
          <Button
            variant={statusFilter === 'hidden' ? 'primary' : 'card'}
            size="sm"
            icon={EyeOff}
            onClick={() => setStatusFilter('hidden')}
          >
            Ocultas / En Revisión ({hiddenCount})
          </Button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Estrellas:</span>
          <button
            type="button"
            onClick={() => setSelectedRatingFilter('all')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-light-border)',
              background: selectedRatingFilter === 'all' ? 'var(--color-primary)' : 'var(--color-card-bg)',
              color: selectedRatingFilter === 'all' ? '#fff' : 'var(--color-text-main)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Todas
          </button>
          <button
            type="button"
            onClick={() => setSelectedRatingFilter('5')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-light-border)',
              background: selectedRatingFilter === '5' ? 'var(--color-primary)' : 'var(--color-card-bg)',
              color: selectedRatingFilter === '5' ? '#fff' : 'var(--color-text-main)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            5 ★
          </button>
          <button
            type="button"
            onClick={() => setSelectedRatingFilter('4')}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--color-light-border)',
              background: selectedRatingFilter === '4' ? 'var(--color-primary)' : 'var(--color-card-bg)',
              color: selectedRatingFilter === '4' ? '#fff' : 'var(--color-text-main)',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            4 ★
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="admin-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'var(--color-card-bg)',
              border: rev.status === 'hidden' ? '1.5px dashed var(--color-warning)' : '1px solid var(--color-light-border)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              opacity: rev.status === 'hidden' ? 0.85 : 1,
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LetterAvatar name={rev.userName} size={44} />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: 0, color: 'var(--color-text-main)' }}>
                      {rev.userName}
                    </h4>
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                      {rev.courseTitle}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 9px',
                    borderRadius: '9999px',
                    background: rev.status === 'approved' ? 'var(--color-success-light)' : 'var(--color-warning-light)',
                    color: rev.status === 'approved' ? 'var(--color-success)' : 'var(--color-warning)',
                    border: '1px solid var(--color-light-border)',
                  }}
                >
                  {rev.status === 'approved' ? '✓ Pública' : '⚠ Oculta / Rechazada'}
                </span>
              </div>

              {/* Star Rating + Score Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      fill={i < rev.rating ? 'var(--color-warning)' : 'rgba(148, 163, 184, 0.15)'}
                      color={i < rev.rating ? 'var(--color-warning)' : 'var(--color-light-border)'}
                      strokeWidth={i < rev.rating ? 0 : 1.5}
                    />
                  ))}
                </div>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-warning)' }}>
                  {rev.rating}.0
                </span>
              </div>

              {/* Review Text Quote */}
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--color-text-main)',
                  lineHeight: 1.65,
                  margin: '0 0 16px 0',
                  fontStyle: 'italic',
                }}
              >
                "{rev.reviewText}"
              </p>
            </div>

            {/* Moderation Controls Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                paddingTop: '14px',
                borderTop: '1px solid var(--color-light-border)',
                marginTop: 'auto',
              }}
            >
              <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                {rev.createdAt}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {rev.status === 'hidden' ? (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(rev.id, 'approved')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: 'var(--color-success-light)',
                      color: 'var(--color-success)',
                      border: '1px solid var(--color-light-border)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Check size={14} /> Aprobar / Mostrar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(rev.id, 'hidden')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: 'var(--color-warning-light)',
                      color: 'var(--color-warning)',
                      border: '1px solid var(--color-light-border)',
                      fontSize: '0.76rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <EyeOff size={14} /> Ocultar / Rechazar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;

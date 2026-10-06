import React, { useState } from 'react';
import {
  TicketPercent,
  Plus,
  Trash2,
  Calendar,
  Tag,
  CheckCircle2,
  AlertCircle,
  Clock,
  Percent,
  Sparkles,
  ShieldAlert,
  Users,
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';

export function CouponsPage({ coupons = [], onCreateCoupon, onDeleteCoupon }) {
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(25);
  const [maxUses, setMaxUses] = useState(50);
  const [expiryDate, setExpiryDate] = useState('');
  const [courseTitle, setCourseTitle] = useState('Todos los cursos de la academia');
  const [couponToDelete, setCouponToDelete] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!code.trim() || !expiryDate || !maxUses) return;

    onCreateCoupon({
      id: `coup_${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountPercentage: Number(discountPercentage),
      maxUses: Number(maxUses),
      currentUses: 0,
      expiryDate,
      courseTitle,
      isActive: true,
    });

    setCode('');
    setDiscountPercentage(25);
    setMaxUses(50);
    setExpiryDate('');
  };

  const handleConfirmDelete = () => {
    if (!couponToDelete) return;
    onDeleteCoupon(couponToDelete.id);
    setCouponToDelete(null);
  };

  const totalRedemptions = coupons.reduce((acc, c) => acc + (c.currentUses || 0), 0);
  const activeCount = coupons.filter((c) => {
    const isPast = c.expiryDate && new Date(c.expiryDate) < new Date();
    const isFull = c.maxUses && c.currentUses >= c.maxUses;
    return c.isActive && !isPast && !isFull;
  }).length;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Cupones y Descuentos Promocionales</h1>
          <p className="page-subtitle">
            Crea códigos con doble condicional (Límite de Usos + Fecha de Expiración) para canje en la app móvil.
          </p>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
        }}
      >
        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <TicketPercent size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Cupones Válidos</div>
            <div className="mini-stat-value">{activeCount}</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
            <Tag size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Total Canjes</div>
            <div className="mini-stat-value">{totalRedemptions}</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <Percent size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Descuento Promedio</div>
            <div className="mini-stat-value">
              {coupons.length > 0
                ? `${Math.round(coupons.reduce((a, b) => a + b.discountPercentage, 0) / coupons.length)}%`
                : '0%'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Container - Full Width Horizontal Form Stacked On Top */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
        {/* Creation Form Card - Horizontal Full-Width Layout */}
        <div className="admin-card" style={{ width: '100%' }}>
          <div className="admin-card-header">
            <div className="admin-card-title">
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Plus size={16} />
              </div>
              <span>Nuevo Código Promocional</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Evaluación Doble Condicional (Límite de Cupos + Fecha de Vencimiento)
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Banner Doble Condicional */}
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-warning-light)',
                border: '1px solid var(--color-light-border)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'var(--color-warning)',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              <ShieldAlert size={16} style={{ flexShrink: 0 }} />
              <span>Doble Condicional Obligatoria: Requiere tanto Límite Máximo de Cupos (Usos) como Fecha de Vencimiento válidos para su activación.</span>
            </div>

            {/* Horizontal Grid of Inputs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                alignItems: 'flex-end',
              }}
            >
              {/* Campo 1: Código */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Código del Cupón <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ej. MASTERPRO2026"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  style={{ fontWeight: 700, letterSpacing: '0.06em', width: '100%' }}
                  required
                />
              </div>

              {/* Campo 2: % Descuento */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Porcentaje de Descuento (%) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Campo 3: Condicional 1 - Límite de Usos */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Límite de Cupos (Usos) <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="Ej. 50"
                  value={maxUses}
                  onChange={(e) => setMaxUses(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Campo 4: Condicional 2 - Fecha de Expiración */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">
                  Fecha de Expiración <span style={{ color: 'var(--color-danger)' }}>*</span>
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  style={{ width: '100%' }}
                  required
                />
              </div>

              {/* Campo 5: Alcance */}
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Aplica para</label>
                <select
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Todos los cursos de la academia">Todos los cursos de la academia</option>
                  <option value="Ciberseguridad Defensiva y Análisis Forense">Ciberseguridad Defensiva</option>
                  <option value="Gestión Financiera y Rentabilidad">Gestión Financiera</option>
                  <option value="Primeros Auxilios y Brigadas">Primeros Auxilios</option>
                </select>
              </div>

              {/* Action Submit Button */}
              <div>
                <Button
                  variant="primary"
                  icon={Plus}
                  type="submit"
                  fullWidth
                  style={{ height: '40px', fontWeight: 800 }}
                >
                  Generar Cupón
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Coupons Table Card - Full Width Below */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden', width: '100%' }}>
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--color-light-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
              Cupones Registrados ({coupons.length})
            </div>
            <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              Evaluación Doble Condicional
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descuento</th>
                  <th>Usos (Max)</th>
                  <th>Expiración</th>
                  <th>Estado (Doble Condición)</th>
                  <th style={{ textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                      No hay cupones registrados.
                    </td>
                  </tr>
                ) : (
                  coupons.map((c) => {
                    const isPast = c.expiryDate && new Date(c.expiryDate) < new Date();
                    const isFull = c.maxUses && c.currentUses >= c.maxUses;
                    const isValid = c.isActive && !isPast && !isFull;

                    return (
                      <tr key={c.id}>
                        <td>
                          <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
                            {c.code}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {c.courseTitle}
                          </div>
                        </td>
                        <td>
                          <span className="badge-pill badge-teal" style={{ fontWeight: 800 }}>
                            -{c.discountPercentage}% OFF
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isFull ? 'var(--color-danger)' : 'var(--color-text-main)' }}>
                            {c.currentUses || 0} / {c.maxUses}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                            {isFull ? 'Límite alcanzado' : 'Disponibles'}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem', color: isPast ? 'var(--color-danger)' : 'var(--color-text-main)', fontWeight: 600 }}>
                            {c.expiryDate}
                          </div>
                        </td>
                        <td>
                          {isValid ? (
                            <span className="badge-pill badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <CheckCircle2 size={12} /> Activo (Doble Válido)
                            </span>
                          ) : (
                            <span className="badge-pill" style={{ background: 'var(--color-danger-light)', color: 'var(--color-danger)', border: '1px solid var(--color-light-border)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                              <AlertCircle size={12} /> {isPast ? 'Expirado por Fecha' : isFull ? 'Agotado por Cupos' : 'Inactivo'}
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            type="button"
                            onClick={() => setCouponToDelete(c)}
                            className="action-icon-btn"
                            title="Eliminar cupón"
                            style={{ color: 'var(--color-danger)' }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Confirmación Borrar */}
      {couponToDelete && (
        <ConfirmDialog
          isOpen={!!couponToDelete}
          title="Eliminar Cupón Promocional"
          message={`¿Estás seguro de eliminar el código ${couponToDelete.code}? Los alumnos no podrán seguir canjeándolo.`}
          confirmText="Sí, eliminar"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setCouponToDelete(null)}
        />
      )}
    </div>
  );
}

import React, { useState } from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  ArrowUpRight,
  Star,
  MessageSquareQuote,
  PlusCircle,
  CreditCard,
  CheckCircle2,
  FileText,
  Download,
  Receipt,
  ExternalLink,
  BookOpen,
  PieChart,
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { ModalPortal } from '../components/atoms/ModalPortal';
import { INITIAL_SETTLEMENT_HISTORY } from '../../data/mock/directorSuiteData';

export function AnalyticsDashboardPage({
  stats,
  recentOrders = [],
  pendingInquiriesCount = 0,
  onNavigate,
}) {
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const metrics = [
    {
      title: 'INGRESOS TOTALES',
      value: `$${stats?.totalEarnings || '18,450.00'}`,
      change: '+18.2% vs mes anterior',
      icon: DollarSign,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)',
    },
    {
      title: 'VENTAS DE CURSOS',
      value: stats?.totalSales || '482',
      change: '+12.5% este mes',
      icon: ShoppingBag,
      color: 'var(--color-secondary)',
      bg: 'var(--color-secondary-light)',
    },
    {
      title: 'ALUMNOS ACTIVOS',
      value: stats?.activeStudents || '1,290',
      change: '+24.1% activos',
      icon: Users,
      color: 'var(--color-primary)',
      bg: 'var(--color-primary-light)',
    },
    {
      title: 'TASA DE GRADUACIÓN',
      value: `${stats?.graduationRate || '78'}%`,
      change: '+4.3% egresados',
      icon: TrendingUp,
      color: 'var(--color-success)',
      bg: 'var(--color-success-light)',
    },
  ];

  // Desglose de Ventas por Curso del Instructor
  const courseSalesBreakdown = [
    { title: 'Especialidad en Ciberseguridad Defensiva y Análisis Forense', sales: 142, revenue: 70858, commission: 42514.8 },
    { title: 'Gestión Financiera y Rentabilidad para PyMEs', sales: 98, revenue: 48902, commission: 29341.2 },
    { title: 'Desarrollo Web Fullstack & Ciberseguridad', sales: 84, revenue: 41916, commission: 25149.6 },
    { title: 'Primeros Auxilios y Brigadas de Emergencia', sales: 78, revenue: 27222, commission: 16333.2 },
    { title: 'Normativas Oficiales de Seguridad Industrial (STPS)', sales: 80, revenue: 39920, commission: 23952.0 },
  ];

  // Historial de liquidaciones recibidas con comprobantes subidos por la Dirección
  const settlementHistory = INITIAL_SETTLEMENT_HISTORY || [
    {
      id: 'DISP-2026-Q3-01',
      date: '2026-09-15',
      instructorName: 'Víctor Atala Lagunas',
      amount: 42514.8,
      status: 'LIQUIDADO',
      bank: 'BBVA México',
      clabe: '012180001234567890',
      receiptFileName: 'comprobante_spei_sep2026_q1.pdf',
    },
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Panel de Control del Instructor</h1>
          <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
            Rendimiento general, métricas de estudiantes, desglose de ventas por curso y comprobantes de liquidación.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="outline"
            icon={HelpCircle}
            onClick={() => onNavigate('inquiries')}
            title="Soporte y Atención a Clientes"
          >
            Atención a clientes
          </Button>
          <Button
            variant="secondary"
            icon={MessageSquareQuote}
            onClick={() => onNavigate('inquiries')}
          >
            Dudas y Q&A ({pendingInquiriesCount})
          </Button>
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => onNavigate('create')}
          >
            Nuevo Curso
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.title}
              className="dashboard-stat-card"
              style={{
                background: 'var(--color-card-bg)',
                padding: '1.25rem',
                borderRadius: '12px',
                border: '1px solid var(--color-light-border)',
                boxShadow: 'var(--shadow-xs)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
                  {m.title}
                </span>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: m.bg,
                    color: m.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={18} />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.2 }}>
                  {m.value}
                </div>
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: 'var(--color-success)',
                    fontWeight: 600,
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                  }}
                >
                  <ArrowUpRight size={13} /> {m.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desglose de Ventas Mensuales por Curso */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <PieChart size={18} color="var(--color-primary)" />
            <span>Desglose de Ventas y Comisiones del Mes por Curso</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Comisión del Instructor: 60%
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Curso / Programa Formativo</th>
                <th>Ventas del Mes</th>
                <th>Facturación Bruta</th>
                <th>Tu Comisión (60%)</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {courseSalesBreakdown.map((item) => (
                <tr key={item.title}>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--color-text-main)' }}>
                      {item.title}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {item.sales} alumnos
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-muted)' }}>
                      ${item.revenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--color-success)', fontSize: '0.92rem' }}>
                      ${item.commission.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </td>
                  <td>
                    <span className="badge-pill badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> En Acumulación
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historial de Liquidaciones Recibidas & Comprobantes SPEI */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">
            <Receipt size={18} color="var(--color-primary)" />
            <span>Historial de Liquidaciones Recibidas y Comprobantes SPEI</span>
          </div>
          <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Emitidos por Dirección General
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Folio Dispersión</th>
                <th>Fecha de Pago</th>
                <th>Monto Depositado</th>
                <th>Banco & Cuenta</th>
                <th>Comprobante de Evidencia SPEI</th>
              </tr>
            </thead>
            <tbody>
              {settlementHistory.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                    {s.id}
                  </td>
                  <td style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>
                    {s.date}
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: 'var(--color-success)', fontSize: '0.92rem' }}>
                      ${s.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {s.bank}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                      CLABE: {s.clabe}
                    </div>
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      size="xs"
                      icon={Download}
                      onClick={() => setSelectedReceipt(s)}
                      title="Ver y descargar comprobante oficial emitido por la dirección"
                    >
                      Ver Comprobante
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Ventas Recientes & Dudas Pendientes */}
      <div className="responsive-split-grid">
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">
              <ShoppingBag size={18} color="var(--color-primary)" />
              <span>Inscripciones Recientes de Alumnos</span>
            </div>
            <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
              Sincronizadas con App Móvil
            </span>
          </div>

          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Orden</th>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>Monto</th>
                  <th>Pago</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {ord.id}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {ord.studentName}
                    </td>
                    <td style={{ color: 'var(--color-secondary)', fontWeight: 600 }}>
                      {ord.courseTitle}
                    </td>
                    <td style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
                      ${ord.amount}
                    </td>
                    <td>
                      <span className="badge-pill badge-gray">
                        <CreditCard size={11} /> {ord.paymentMethod}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                      {ord.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Highlights / Status Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            className="dashboard-highlight-card"
            style={{
              background: 'var(--color-card-bg)',
              color: 'var(--color-text-main)',
              borderRadius: '12px',
              padding: '1.4rem',
              border: '1px solid var(--color-light-border)',
              boxShadow: 'var(--shadow-xs)',
              position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MessageSquareQuote size={20} color="var(--color-primary)" />
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)' }}>Atención a Alumnos</h4>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.5, margin: '0 0 16px 0' }}>
              Tienes <strong>{pendingInquiriesCount} consultas pendientes</strong> de responder en tus lecciones y bandeja privada.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={MessageSquareQuote}
              onClick={() => onNavigate('inquiries')}
              title="Ir al panel de consultas"
            >
              Responder Consultas Ahora
            </Button>
          </div>
        </div>
      </div>

      {/* Modal Visualizador de Comprobante SPEI */}
      {selectedReceipt && (
        <ModalPortal isOpen={Boolean(selectedReceipt)}>
          <div className="modal-overlay-backdrop" onClick={() => setSelectedReceipt(null)}>
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '520px',
                width: '100%',
                padding: '24px',
                borderRadius: 'var(--radius-lg, 16px)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid var(--color-light-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  <Receipt size={20} color="var(--color-primary)" />
                  <span>Comprobante Oficial de Dispersión SPEI</span>
                </div>
                <button type="button" onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.86rem' }}>
                <div style={{ padding: '12px', background: 'var(--color-success-light)', borderRadius: '8px', border: '1px solid var(--color-light-border)', color: 'var(--color-success)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={18} />
                  <span>Transferencia SPEI Confirmada y Auditada</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'var(--color-light-bg)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-light-border)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Folio SPEI</span>
                    <strong style={{ fontFamily: 'monospace', color: 'var(--color-primary)' }}>{selectedReceipt.id}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Monto Dispersado</span>
                    <strong style={{ color: 'var(--color-success)', fontSize: '0.96rem' }}>${selectedReceipt.amount?.toLocaleString()} MXN</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Banco Destino</span>
                    <strong>{selectedReceipt.bank}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>Fecha de Emisión</span>
                    <strong>{selectedReceipt.date}</strong>
                  </div>
                </div>

                <div style={{ padding: '12px', background: 'var(--color-card-bg)', border: '1px solid var(--color-light-border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={18} color="var(--color-primary)" />
                    <span style={{ fontWeight: 600, fontSize: '0.82rem' }}>{selectedReceipt.receiptFileName || 'comprobante_spei_oficial.pdf'}</span>
                  </div>
                  <Button variant="primary" size="xs" icon={Download} onClick={() => alert('Descargando archivo comprobante SPEI oficial...')}>
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

export default AnalyticsDashboardPage;

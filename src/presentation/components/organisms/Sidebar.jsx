import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  TrendingUp,
  DollarSign,
  UserCheck,
  PlusCircle,
  BookOpen,
  MessageSquareQuote,
  Users,
  Award,
  Star,
  TicketPercent,
  Sun,
  Moon,
  Menu,
} from 'lucide-react';
import { isDirector } from '../../../core/utils/roleUtils';
import { LetterAvatar } from '../atoms/LetterAvatar';

export function Sidebar({
  activeView,
  onTabChange,
  coursesCount = 0,
  quizzesCount = 0,
  pendingInquiriesCount = 0,
  pendingCourseRequestsCount = 0,
  pendingSettlementsCount = 0,
  theme = 'light',
  toggleTheme,
  user,
  onSwitchRole,
  isCollapsed = false,
  onToggleSidebar,
}) {
  const isDirectorUser = isDirector(user);
  const isDark = theme === 'dark';

  // 1. Navegación EXCLUSIVA para Directivos / Alta Dirección
  const directorNavSections = [
    {
      label: 'NEGOCIO Y VENTAS',
      items: [
        { id: 'executive', label: 'Panel de Ventas', icon: LayoutDashboard },
        { id: 'executive-financial', label: 'Ingresos y Facturación', icon: TrendingUp },
      ],
    },
    {
      label: 'CREADORES E INSTRUCTORES',
      items: [
        { id: 'executive-instructors', label: 'Instructores y Comisiones', icon: Users },
        { id: 'executive-requests', label: 'Solicitudes de Cursos', icon: ClipboardCheck, badgeCount: pendingCourseRequestsCount },
        { id: 'executive-permissions', label: 'Permisos de Venta & RBAC', icon: ShieldCheck },
      ],
    },
    {
      label: 'LIQUIDACIONES Y CONTROL',
      items: [
        { id: 'executive-audit', label: 'Liquidaciones y Pagos', icon: DollarSign, badgeCount: pendingSettlementsCount },
      ],
    },
  ];

  // 2. Navegación EXCLUSIVA para Instructores / Profesores Titulares
  const instructorNavSections = [
    {
      label: 'PRINCIPAL',
      items: [
        { id: 'analytics', label: 'Dashboard', icon: TrendingUp },
        { id: 'profile', label: 'Mi Perfil', icon: UserCheck },
      ],
    },
    {
      label: 'GESTIÓN ACADÉMICA',
      items: [
        { id: 'create', label: 'Crear nuevo curso', icon: PlusCircle },
        { id: 'catalog', label: 'Mis Cursos', icon: BookOpen, count: coursesCount },
      ],
    },
    {
      label: 'ALUMNOS Y COMUNIDAD',
      items: [
        {
          id: 'inquiries',
          label: 'Dudas y Q&A',
          icon: MessageSquareQuote,
          badgeCount: pendingInquiriesCount,
        },
        { id: 'students', label: 'Alumnos y Progreso', icon: Users },
        { id: 'certificates', label: 'Certificados', icon: Award },
        { id: 'reviews', label: 'Reseñas de Cursos', icon: Star },
      ],
    },
    {
      label: 'PROMOCIÓN Y VENTAS',
      items: [
        { id: 'coupons', label: 'Cupones de Descuento', icon: TicketPercent },
      ],
    },
  ];

  // Segregación estricta: NUNCA se combinan opciones
  const navSections = isDirectorUser ? directorNavSections : instructorNavSections;

  const userName = isDirectorUser
    ? (user?.name || 'MWComenius')
    : (user?.name || user?.nombre || 'Prof. Instructor');

  const userRole = isDirectorUser
    ? 'Directora General de Operaciones'
    : (user?.roles?.[0]?.name || (user?.instructor !== false ? 'Instructor Titular' : 'Docente'));

  const userAvatar = isDirectorUser
    ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120'
    : (user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120');

  return (
    <aside className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Section */}
      <div
        className="sidebar-brand-wrapper"
        onClick={(e) => {
          if (isCollapsed && onToggleSidebar) {
            e.stopPropagation();
            onToggleSidebar();
          } else if (onTabChange) {
            onTabChange(isDirectorUser ? 'executive' : 'analytics');
          }
        }}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'space-between',
          padding: isCollapsed ? '14px 8px' : '16px 18px',
          flexDirection: isCollapsed ? 'column' : 'row',
          gap: isCollapsed ? '10px' : '12px',
        }}
        title={isCollapsed ? "Hacer clic para expandir el menú lateral" : "Master Academy"}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            className="brand-logo-badge"
            style={
              isDirectorUser
                ? { background: 'linear-gradient(135deg, #1e3a8a, var(--color-primary))' }
                : {}
            }
          >
            <GraduationCap size={22} color="#ffffff" />
          </div>
          {!isCollapsed && (
            <div className="brand-meta">
              <span className="brand-name">Master Academy</span>
              {isDirectorUser ? (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 58, 138, 0.08)',
                    color: isDark ? '#60a5fa' : '#1e3a8a',
                    border: isDark ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(30, 58, 138, 0.25)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    width: 'fit-content',
                    marginTop: '2px',
                  }}
                >
                  Dirección General
                </span>
              ) : (
                <span className="brand-role-chip">Instructor Studio</span>
              )}
            </div>
          )}
        </div>

        {onToggleSidebar && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSidebar();
            }}
            title={isCollapsed ? "Expandir menú lateral" : "Contraer menú lateral"}
            style={{
              background: isCollapsed ? 'var(--color-primary-light)' : 'transparent',
              border: isCollapsed ? '1px solid var(--color-light-border)' : 'none',
              color: isCollapsed ? 'var(--color-primary)' : 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)',
            }}
          >
            <Menu size={18} />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="sidebar-nav-container">
        {navSections.map((sec) => (
          <div key={sec.label} className="sidebar-nav-group">
            <span
              className="sidebar-group-title"
              style={
                isDirectorUser
                  ? { color: 'var(--color-text-muted)', fontSize: '0.68rem', letterSpacing: '0.06em' }
                  : {}
              }
            >
              {sec.label}
            </span>
            <div className="sidebar-group-items">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  activeView === item.id ||
                  (item.id === 'catalog' && activeView === 'exams');

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    className={'sidebar-nav-item ' + (isActive ? 'active' : '')}
                    style={
                      isDirectorUser && isActive
                        ? {
                          background: isDark
                            ? 'rgba(59, 130, 246, 0.16)'
                            : 'rgba(30, 58, 138, 0.08)',
                          color: isDark ? '#60a5fa' : '#1e3a8a',
                          borderColor: isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(30, 58, 138, 0.3)',
                          fontWeight: 700,
                        }
                        : {}
                    }
                  >
                    <Icon
                      size={18}
                      className="sidebar-item-icon"
                      color={isDirectorUser && isActive ? (isDark ? '#60a5fa' : '#1e3a8a') : undefined}
                    />
                    <span className="sidebar-item-label">{item.label}</span>

                    {item.count !== undefined && !isDirectorUser && (
                      <span className="sidebar-counter-badge">{item.count}</span>
                    )}

                    {item.badgeCount > 0 && (
                      <span
                        className="sidebar-alert-badge"
                        style={isDirectorUser ? { background: 'var(--color-accent)', color: '#ffffff', fontWeight: 800 } : {}}
                      >
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Profile & Theme Shortcut */}
      <div
        className={
          'sidebar-footer-profile ' +
          ((isDirectorUser && activeView === 'executive') || (!isDirectorUser && activeView === 'profile')
            ? 'active-profile'
            : '')
        }
        onClick={() => {
          onTabChange(isDirectorUser ? 'executive' : 'profile');
        }}
        style={{ cursor: 'pointer' }}
        title={
          isDirectorUser
            ? 'Ir al Panel de Ventas'
            : 'Ver y editar mi perfil de instructor'
        }
      >
        <div className="sidebar-avatar-wrapper">
          <LetterAvatar name={userName} size={38} />
          <span
            className="sidebar-status-dot"
            style={isDirectorUser ? { background: 'var(--color-accent)' } : {}}
          />
        </div>
        <div className="sidebar-user-info">
          <span className="sidebar-user-name" title={userName}>
            {userName}
          </span>
          <span
            className="sidebar-user-role"
            style={isDirectorUser ? { color: isDark ? '#60a5fa' : '#1e3a8a', fontWeight: 700 } : {}}
          >
            {userRole}
          </span>
        </div>

        {toggleTheme && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
            }}
            className="action-icon-btn"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            style={{ marginLeft: 'auto' }}
          >
            {isDark ? <Sun size={15} color="var(--color-accent)" /> : <Moon size={15} color="var(--color-warning)" />}
          </button>
        )}
      </div>
    </aside>
  );
}

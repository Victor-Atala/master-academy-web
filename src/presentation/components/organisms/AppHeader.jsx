import React from 'react';
import { Sparkles, Sun, Moon, LogOut, Briefcase, GraduationCap, Menu } from 'lucide-react';
import { Button } from '../atoms/Button';
import { LetterAvatar } from '../atoms/LetterAvatar';
import { isDirector } from '../../../core/utils/roleUtils';

export function AppHeader({
  activeView,
  onFillDemo,
  theme = 'light',
  toggleTheme,
  user,
  onNavigate,
  onLogout,
  onSwitchRole,
  onToggleSidebar,
}) {
  const isDark = theme === 'dark';
  const isDirectorUser = isDirector(user);

  const userName = isDirectorUser
    ? (user?.name || 'MWComenius')
    : (user?.name || user?.nombre || 'Prof. Instructor');

  return (
    <header className="topbar-header">
      <div className="topbar-inner">
        {/* Left Role Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isDirectorUser ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '9999px',
                background: isDark
                  ? 'rgba(59, 130, 246, 0.12)'
                  : 'rgba(30, 58, 138, 0.08)',
                border: isDark
                  ? '1px solid rgba(59, 130, 246, 0.3)'
                  : '1px solid rgba(30, 58, 138, 0.25)',
                color: isDark ? '#60a5fa' : '#1e3a8a',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.03em',
              }}
            >
              <Briefcase size={14} color={isDark ? '#60a5fa' : '#1e3a8a'} /> Dirección General
            </span>
          ) : (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 14px',
                borderRadius: '9999px',
                background: 'rgba(30, 64, 175, 0.08)',
                border: '1px solid rgba(30, 64, 175, 0.22)',
                color: 'var(--color-primary)',
                fontSize: '0.74rem',
                fontWeight: 700,
              }}
            >
              <GraduationCap size={14} color="var(--color-primary)" /> Profesorado & Docencia
            </span>
          )}
        </div>

        {/* Right Tools & Actions */}
        <div
          className="topbar-tools-section"
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}
        >
          {/* Autocomplete demo button ONLY for instructors on course creation */}
          {!isDirectorUser && activeView === 'create' && (
            <Button
              variant="outline"
              size="sm"
              icon={Sparkles}
              onClick={onFillDemo}
              title="Autocompletar con datos demo de alta calidad"
            >
              Cargar ejemplo
            </Button>
          )}

          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label="Alternar tema claro y oscuro"
          >
            <div className="theme-toggle-icon-wrap">
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </div>
            <span className="theme-toggle-label">{isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
          </button>

          {/* Header Profile Identity Chip */}
          {user && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 12px 4px 4px',
                background: 'var(--color-table-header-bg)',
                border: '1px solid var(--color-light-border)',
                borderRadius: '9999px',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
              }}
              onClick={() => {
                if (onNavigate) {
                  onNavigate(isDirectorUser ? 'executive' : 'profile');
                }
              }}
              title={
                isDirectorUser
                  ? 'Ir al Panel de Ventas'
                  : 'Ir a Mi Perfil de Docente'
              }
            >
              <LetterAvatar name={userName} size={30} />
              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: 'var(--color-text-main)',
                  maxWidth: '150px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {userName}
              </span>
            </div>
          )}

          {/* Header Logout Action */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Cerrar sesión"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                border: '1px solid var(--color-light-border)',
                background: 'var(--color-table-header-bg)',
                color: 'var(--color-text-muted)',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              <LogOut size={14} color="var(--color-text-muted)" />
              <span>Cerrar Sesión</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

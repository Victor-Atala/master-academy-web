import React, { useState } from 'react';
import { Users, Search, CheckCircle, Clock, BookOpen, GraduationCap, ArrowUpRight } from 'lucide-react';
import { LetterAvatar } from '../components/atoms/LetterAvatar';

export function StudentsPage({ enrollments = [] }) {
  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');

  const courses = Array.from(new Set(enrollments.map((e) => e.courseTitle)));

  const filtered = enrollments.filter((e) => {
    const matchesSearch =
      e.studentName.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(search.toLowerCase());

    const matchesCourse =
      selectedCourseFilter === 'all' || e.courseTitle === selectedCourseFilter;

    return matchesSearch && matchesCourse;
  });

  const totalGraduated = enrollments.filter((e) => e.isGraduated).length;
  const avgProgress = Math.round(
    enrollments.reduce((acc, e) => acc + (e.progressPercentage || 0), 0) / (enrollments.length || 1)
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Gestión de Estudiantes</h1>
          <p className="page-subtitle">
            Alumnos matriculados, métricas de avance y lecciones completadas desde la app móvil.
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
            <Users size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Total Alumnos</div>
            <div className="mini-stat-value">{enrollments.length}</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Egresados</div>
            <div className="mini-stat-value">{totalGraduated}</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'rgba(240, 101, 72, 0.1)', color: 'var(--color-warning)' }}>
            <ArrowUpRight size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Progreso Promedio</div>
            <div className="mini-stat-value">{avgProgress}%</div>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Search and Filters Bar */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-light-border)',
            display: 'flex',
            gap: '14px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div className="search-input-wrapper" style={{ flex: 1, minWidth: '260px' }}>
            <Search size={17} className="search-input-icon" />
            <input
              type="text"
              placeholder="Buscar alumno por nombre, correo o programa formativo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '260px' }}>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
            >
              <option value="all">Todos los cursos</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Curso Inscrito</th>
                <th>Progreso</th>
                <th>Lecciones</th>
                <th>Fecha Inicio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No se encontraron estudiantes coincidentes con el criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    {/* Estudiante */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <LetterAvatar name={item.studentName} size={36} />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                            {item.studentName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                            {item.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Curso */}
                    <td>
                      <span style={{ fontWeight: 600, color: 'var(--color-secondary)', fontSize: '0.82rem' }}>
                        {item.courseTitle}
                      </span>
                    </td>

                    {/* Progreso */}
                    <td style={{ minWidth: '150px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--color-text-main)' }}>
                            {item.progressPercentage}%
                          </span>
                          <span style={{ color: 'var(--color-text-muted)' }}>completado</span>
                        </div>
                        <div
                          style={{
                            width: '100%',
                            height: '6px',
                            background: '#e9ebec',
                            borderRadius: '9999px',
                            overflow: 'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${item.progressPercentage}%`,
                              height: '100%',
                              background: item.isGraduated ? 'var(--color-primary)' : 'var(--color-secondary)',
                              borderRadius: '9999px',
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Lecciones */}
                    <td>
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-main)' }}>
                        <strong>{item.completedLessons}</strong> / {item.totalLessons}
                      </span>
                    </td>

                    {/* Fecha */}
                    <td>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                        {item.enrolledDate}
                      </span>
                    </td>

                    {/* Estado */}
                    <td>
                      {item.isGraduated ? (
                        <span className="badge-pill badge-teal">
                          <CheckCircle size={12} /> Egresado
                        </span>
                      ) : (
                        <span className="badge-pill badge-indigo">
                          <Clock size={12} /> En aprendizaje
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

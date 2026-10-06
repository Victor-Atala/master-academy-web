import React from 'react';
import { CourseCard } from './CourseCard';
import { SearchInput } from '../molecules/SearchInput';
import { CategoryPill } from '../molecules/CategoryPill';
import { Spinner } from '../atoms/Spinner';
import { Button } from '../atoms/Button';
import { RotateCw, AlertCircle, BookX } from 'lucide-react';

export function CourseGrid({
  courses = [],
  isLoading,
  error,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  onRefresh,
  onViewSyllabus,
  onEditCourse,
  onDeleteCourse,
  onViewExams = null,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Search and Category Filter Bar */}
      <div className="search-filter-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
            placeholder="Buscar por nombre, tema o instructor..."
          />
          <Button variant="outline" size="sm" icon={RotateCw} onClick={onRefresh} isLoading={isLoading}>
            Actualizar
          </Button>
        </div>

        <div className="catalog-pills-row">
          <CategoryPill
            label="Todas las áreas"
            isActive={selectedCategory === 'all'}
            onClick={() => onCategoryChange('all')}
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat.id}
              label={cat.name}
              isActive={selectedCategory.toLowerCase() === cat.name.toLowerCase()}
              onClick={() => onCategoryChange(cat.name)}
            />
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{ padding: '60px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
          <Spinner size={32} />
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>Cargando catálogo de cursos...</p>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div
          style={{
            padding: '32px',
            background: 'var(--color-danger-light)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <AlertCircle size={32} color="var(--color-danger)" />
          <h4 style={{ color: 'var(--color-danger)', fontWeight: 700 }}>No se pudo conectar con el catálogo</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem' }}>{error}</p>
          <Button variant="danger" size="sm" onClick={onRefresh}>
            Reintentar
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && courses.length === 0 && (
        <div
          style={{
            padding: '60px 20px',
            textAlign: 'center',
            background: 'var(--color-card-bg)',
            color: 'var(--color-text-main)',
            borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--color-light-border)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <BookX size={42} color="var(--color-text-muted)" />
          <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>No se encontraron cursos</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', maxWidth: '380px' }}>
            Prueba ajustando los filtros de búsqueda o categoría, o crea un nuevo curso desde la pestaña superior.
          </p>
        </div>
      )}

      {/* Grid of Courses */}
      {!isLoading && !error && courses.length > 0 && (
        <div className="courses-grid-layout">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onViewSyllabus={onViewSyllabus}
              onEdit={onEditCourse}
              onDelete={onDeleteCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
}

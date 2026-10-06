import React from 'react';
import { Clock, BookOpen, User, Trash2, ListChecks, Edit3, ClipboardCheck } from 'lucide-react';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { PriceBox } from '../molecules/PriceBox';

export function CourseCard({
  course,
  onViewSyllabus,
  onEdit,
  onDelete,
  onViewExams,
  isHighlighted = false,
}) {
  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: 'var(--radius-lg)',
        border: isHighlighted ? '2px solid var(--color-primary)' : '1px solid var(--color-light-border)',
        boxShadow: isHighlighted ? '0 0 0 4px rgba(30, 64, 175, 0.25), var(--shadow-md)' : 'var(--shadow-sm)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all var(--transition-base)',
      }}
      className="course-card-item"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        e.currentTarget.style.borderColor = 'var(--color-border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
        e.currentTarget.style.borderColor = 'var(--color-light-border)';
      }}
    >
      {/* Cover Image & Overlay Badges */}
      <div style={{ position: 'relative', height: '170px', background: 'var(--color-light-bg)' }}>
        {isHighlighted && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              zIndex: 10,
              background: 'var(--color-primary)',
              color: '#ffffff',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.74rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            ✨ ¡Recién Creado!
          </div>
        )}
        <img
          src={course.coverUrl}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Badge variant="dark">{course.categoryName}</Badge>
          <div style={{ display: 'flex', gap: '6px' }}>
            {course.codigo && (
              <span
                style={{
                  background: 'rgba(0, 0, 0, 0.65)',
                  color: '#ffffff',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  backdropFilter: 'blur(4px)',
                }}
                title="Código de canje móvil"
              >
                {course.codigo}
              </span>
            )}
            <Badge variant="primary">{course.level}</Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            marginBottom: '6px',
            color: 'var(--color-text-main)',
            lineHeight: 1.35,
          }}
        >
          {course.title}
        </h3>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.45,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {course.summary || course.description}
        </p>

        {/* Metadata Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            fontSize: '0.8rem',
            color: 'var(--color-text-muted)',
            paddingTop: '10px',
            borderTop: '1px solid var(--color-light-border)',
            marginBottom: '14px',
            marginTop: 'auto',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} /> {course.hours}h
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <BookOpen size={14} /> {course.lessonsCount} clases
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={14} /> {course.instructorName ? course.instructorName.split(' ')[0] : 'Profesor'}
          </span>
        </div>

        {/* Bottom Actions & Price */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
          <PriceBox price={course.price} promotionalPrice={course.promotionalPrice} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => onEdit(course)}
              title="Editar este curso en Mis Cursos"
            >
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              icon={ListChecks}
              onClick={() => onViewSyllabus(course)}
              title="Ver estructura y temario"
            >
              Temario
            </Button>

            <Button
              variant="dangerSubtle"
              size="sm"
              icon={Trash2}
              onClick={() => onDelete(course)}
              title="Dar de baja curso"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

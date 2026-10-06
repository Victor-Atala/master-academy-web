import React from 'react';
import { Trash2, Video, FileText } from 'lucide-react';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { LessonResourcesManager } from './LessonResourcesManager';

export function LessonItem({
  lessonNumber,
  lesson,
  onChange,
  onRemove,
  canRemove = true,
}) {
  return (
    <div
      style={{
        background: 'var(--color-card-bg)',
        borderRadius: '16px',
        border: '1.5px solid var(--color-light-border)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: 'var(--shadow-xs)',
        transition: 'all 200ms ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-primary)';
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--color-light-border)';
        e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
      }}
    >
      {/* Lesson Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              padding: '3px 10px',
              borderRadius: '9999px',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Clase {String(lessonNumber).padStart(2, '0')}
          </span>
          <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Contenido multimedia & guía de estudio
          </span>
        </div>

        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Eliminar lección"
            style={{
              color: 'var(--color-danger)',
              background: 'var(--color-danger-light)',
              border: '1px solid var(--color-light-border)',
              padding: '5px 9px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 150ms ease',
            }}
          >
            <Trash2 size={14} />
            <span>Quitar</span>
          </button>
        )}
      </div>

      {/* Inputs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-label)', marginBottom: '5px' }}>
            Nombre de la lección <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <Input
            placeholder="Ej. Introducción a los modelos de lenguaje..."
            value={lesson.titulo}
            onChange={(e) => onChange('titulo', e.target.value)}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-label)', marginBottom: '5px' }}>
            Enlace de video (MP4 / Streaming) <span style={{ color: 'var(--color-danger)' }}>*</span>
          </label>
          <Input
            type="url"
            icon={Video}
            placeholder="https://.../video.mp4"
            value={lesson.video}
            onChange={(e) => onChange('video', e.target.value)}
            required
          />
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Formatos URL soportados:</span>
            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'var(--color-info-light)', color: 'var(--color-info)', borderRadius: '4px', fontWeight: 700 }}>YouTube</span>
            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: '4px', fontWeight: 700 }}>Vimeo</span>
            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'var(--color-warning-light)', color: 'var(--color-warning)', borderRadius: '4px', fontWeight: 700 }}>Google Drive</span>
            <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'var(--color-secondary-light)', color: 'var(--color-secondary)', borderRadius: '4px', fontWeight: 700 }}>MP4 / HLS Stream</span>
          </div>
        </div>
      </div>

      {/* Multiline Textarea for Detailed Lesson Description */}
      <div>
        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-label)', marginBottom: '5px' }}>
          Descripción extendida e instrucciones de la lección
        </label>
        <Textarea
          rows={3}
          placeholder="Añade aquí la información detallada, guías de lectura, objetivos de la clase y notas complementarias para los estudiantes..."
          value={lesson.contenido}
          onChange={(e) => onChange('contenido', e.target.value)}
        />
      </div>

      {/* Downloadable Resources Manager */}
      <LessonResourcesManager
        resources={lesson.resources || []}
        onAddResource={(res) => {
          const current = Array.isArray(lesson.resources) ? lesson.resources : [];
          onChange('resources', [...current, res]);
        }}
        onRemoveResource={(resId) => {
          const current = Array.isArray(lesson.resources) ? lesson.resources : [];
          onChange('resources', current.filter(r => r.id !== resId));
        }}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Paperclip, Plus, Trash2, FileText, ExternalLink, Download, FileSpreadsheet, FileArchive, FileCode } from 'lucide-react';
import { Button } from '../atoms/Button';

export function LessonResourcesManager({
  resources = [],
  onAddResource,
  onRemoveResource,
}) {
  const [name, setName] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [type, setType] = useState('pdf');
  const [customMb, setCustomMb] = useState('');

  const defaultSizes = {
    pdf: 14.5,
    excel: 8.2,
    zip: 42.0,
    doc: 6.5,
    link: 0.1,
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim() || !fileUrl.trim()) return;

    const sizeMb = Number(customMb) > 0 ? Number(customMb) : (defaultSizes[type] || 12.0);

    const newResource = {
      id: 'res_' + Date.now(),
      name: name.trim(),
      fileUrl: fileUrl.trim(),
      type,
      sizeMb,
    };

    onAddResource(newResource);
    setName('');
    setFileUrl('');
    setCustomMb('');
  };

  const getFileIcon = (resType) => {
    if (resType === 'excel') return <FileSpreadsheet size={13} color="var(--color-success)" />;
    if (resType === 'zip') return <FileArchive size={13} color="var(--color-warning)" />;
    return <FileText size={13} color="var(--color-secondary)" />;
  };

  return (
    <div
      style={{
        marginTop: '10px',
        padding: '12px 14px',
        background: 'var(--color-light-bg)',
        borderRadius: '12px',
        border: '1px dashed var(--color-light-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Paperclip size={15} color="var(--color-primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Material de ayuda visual y recursos para esta clase ({resources.length})
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
          PDF, Excel, guías (máx. 500 MB en total por curso)
        </span>
      </div>

      {/* Formulario rápido para añadir recurso */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.6fr 110px 75px auto',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="Nombre (ej. Ejercicio Práctico)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '7px 10px',
            fontSize: '0.8rem',
            border: '1px solid var(--color-input-border)',
            borderRadius: '6px',
            outline: 'none',
            background: 'var(--color-input-bg)',
            color: 'var(--color-text-main)',
          }}
        />

        <input
          type="url"
          placeholder="URL o enlace del archivo"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          style={{
            padding: '7px 10px',
            fontSize: '0.8rem',
            border: '1px solid var(--color-input-border)',
            borderRadius: '6px',
            outline: 'none',
            background: 'var(--color-input-bg)',
            color: 'var(--color-text-main)',
          }}
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{
            padding: '7px 6px',
            fontSize: '0.78rem',
            border: '1px solid var(--color-input-border)',
            borderRadius: '6px',
            outline: 'none',
            background: 'var(--color-input-bg)',
            fontWeight: 600,
            color: 'var(--color-text-main)',
          }}
        >
          <option value="pdf">PDF (.pdf)</option>
          <option value="excel">Excel (.xlsx)</option>
          <option value="zip">ZIP / Paquete</option>
          <option value="doc">Word (.docx)</option>
          <option value="link">Enlace web</option>
        </select>

        <input
          type="number"
          placeholder="MB"
          min="0.1"
          step="0.5"
          value={customMb}
          onChange={(e) => setCustomMb(e.target.value)}
          title="Tamaño en Megabytes (MB)"
          style={{
            padding: '7px 8px',
            fontSize: '0.8rem',
            border: '1px solid var(--color-input-border)',
            borderRadius: '6px',
            outline: 'none',
            background: 'var(--color-input-bg)',
            color: 'var(--color-text-main)',
            textAlign: 'center',
          }}
        />

        <Button
          type="button"
          size="sm"
          variant="secondary"
          icon={Plus}
          onClick={handleAdd}
          disabled={!name.trim() || !fileUrl.trim()}
        >
          Adjuntar
        </Button>
      </div>

      {/* Lista de recursos añadidos a la lección */}
      {resources.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {resources.map((res) => {
            const sizeLabel = res.sizeMb ? (res.sizeMb + ' MB') : (defaultSizes[res.type] + ' MB');
            return (
              <div
                key={res.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  background: 'var(--color-card-bg)',
                  border: '1px solid var(--color-light-border)',
                  borderRadius: '8px',
                  fontSize: '0.76rem',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                {getFileIcon(res.type)}
                <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{res.name}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '1px 6px',
                    borderRadius: '4px',
                    background: res.type === 'excel' ? 'var(--color-success-light)' : '#f1f5f9',
                    color: res.type === 'excel' ? 'var(--color-success)' : '#64748b',
                  }}
                >
                  {res.type} • {sizeLabel}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveResource(res.id)}
                  title="Quitar recurso"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

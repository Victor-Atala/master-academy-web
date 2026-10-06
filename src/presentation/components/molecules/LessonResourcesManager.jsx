import React, { useState, useRef } from 'react';
import { Paperclip, Plus, Trash2, FileText, UploadCloud, FileSpreadsheet, FileArchive } from 'lucide-react';
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
  const fileInputRef = useRef(null);

  const defaultSizes = {
    pdf: 14.5,
    excel: 8.2,
    zip: 42.0,
    doc: 6.5,
    link: 0.1,
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = Number((file.size / (1024 * 1024)).toFixed(1)) || 1.0;
    const fileName = file.name;
    const ext = fileName.split('.').pop()?.toLowerCase() || '';

    let detectedType = 'pdf';
    if (['xls', 'xlsx', 'csv'].includes(ext)) detectedType = 'excel';
    else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) detectedType = 'zip';
    else if (['doc', 'docx'].includes(ext)) detectedType = 'doc';
    else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) detectedType = 'video';

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result || URL.createObjectURL(file);
      const newResource = {
        id: 'res_' + Date.now(),
        name: fileName,
        fileUrl: dataUrl,
        type: detectedType,
        sizeMb,
      };

      if (onAddResource) {
        onAddResource(newResource);
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    if (e.target) e.target.value = '';
  };

  const handleAddManual = (e) => {
    if (e) e.preventDefault();
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Paperclip size={15} color="var(--color-primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Material de ayuda visual y recursos adjuntos ({resources.length})
          </span>
        </div>
        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
          PDF, Excel, guías, paquetes ZIP (máx. 500 MB en total por curso)
        </span>
      </div>

      {/* Selector directo de archivos desde la computadora */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.xlsx,.xls,.doc,.docx,.zip,.rar,.png,.jpg,.jpeg,.mp4"
        style={{ display: 'none' }}
      />

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button
          type="button"
          variant="primarySubtle"
          size="sm"
          icon={UploadCloud}
          onClick={() => fileInputRef.current?.click()}
          style={{ fontWeight: 700 }}
        >
          Adjuntar archivo desde tu equipo (PDF, Excel, ZIP)
        </Button>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
          o ingresa un enlace web / URL externa a continuación:
        </span>
      </div>

      {/* Formulario rápido para añadir por URL o enlace */}
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
          type="text"
          placeholder="URL o enlace (ej. https://.../archivo.pdf)"
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
          onClick={handleAddManual}
          disabled={!name.trim() || !fileUrl.trim()}
        >
          Adjuntar URL
        </Button>
      </div>

      {/* Lista de recursos añadidos a la lección */}
      {resources.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {resources.map((res) => {
            const sizeLabel = res.sizeMb ? (res.sizeMb + ' MB') : ((defaultSizes[res.type] || 10) + ' MB');
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

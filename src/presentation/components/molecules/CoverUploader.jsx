import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, HardDrive } from 'lucide-react';
import { TENANT_CONFIG } from '../../../config/tenantConfig';

export function CoverUploader({ value, onChange, currentStorageMb = 45 }) {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');
  const [fileSizeMb, setFileSizeMb] = useState(0);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeInMb = Number((file.size / (1024 * 1024)).toFixed(2));
      if (sizeInMb > TENANT_CONFIG.maxCoverSizeMB) {
        alert(`La imagen de portada excede el peso máximo permitido (${TENANT_CONFIG.maxCoverSizeMB} MB).`);
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setFileName(file.name);
      setFileSizeMb(sizeInMb);
      onChange(previewUrl);
    }
  };

  const totalUsedMb = Number((currentStorageMb + fileSizeMb).toFixed(1));
  const maxStorageMb = TENANT_CONFIG.maxCourseStorageMB;
  const storagePercentage = Math.min(100, Math.round((totalUsedMb / maxStorageMb) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '180px 1fr',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {/* Preview Box */}
        <div
          style={{
            width: '180px',
            height: '110px',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            backgroundColor: 'var(--color-secondary-light)',
            border: '1px solid var(--color-light-border)',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {value ? (
            <img
              src={value}
              alt="Vista previa de portada"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
              }}
            />
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: '10px' }}>
              <ImageIcon size={28} />
              <div style={{ fontSize: '0.72rem', marginTop: '4px' }}>Sin portada</div>
            </div>
          )}
        </div>

        {/* Real Upload Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '14px 18px',
              border: '2px dashed var(--color-light-border)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--color-card-bg)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'all var(--transition-fast)',
            }}
          >
            <UploadCloud size={24} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                {fileName ? fileName : 'Seleccionar imagen de portada desde tu equipo'}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                Dimensiones requeridas en px: <strong>{TENANT_CONFIG.recommendedCoverDimensions}</strong> (Máx {TENANT_CONFIG.maxCoverSizeMB} MB)
              </div>
            </div>
          </div>

          {/* Storage Meter per Course */}
          <div
            style={{
              background: 'var(--color-secondary-light)',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--color-light-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              fontSize: '0.76rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
              <HardDrive size={14} color="var(--color-primary)" />
              <span>Cuota de almacenamiento del curso:</span>
            </div>
            <div style={{ fontWeight: 800, color: 'var(--color-primary)' }}>
              {totalUsedMb} MB / {maxStorageMb} MB ({storagePercentage}%)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

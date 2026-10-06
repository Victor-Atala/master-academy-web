import React, { useState } from 'react';
import { SectionHeader } from '../molecules/SectionHeader';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Select } from '../atoms/Select';
import { TENANT_CONFIG } from '../../../config/tenantConfig';
import { TicketPercent, AlertCircle } from 'lucide-react';

export function PricingSection({
  category_id,
  category_name,
  nivel,
  horas,
  precio,
  idioma,
  categories = [],
  onUpdate,
}) {
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryText, setCustomCategoryText] = useState('');

  // Combinar categorías predeterminadas del tenant con las provistas
  const availableCategories = TENANT_CONFIG.defaultCategories.map((name, index) => ({
    id: index + 1,
    name: name,
  }));

  const categoryOptions = [
    ...availableCategories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
    { value: 'OTHER_CUSTOM', label: '➕ Otra (Solicitar nueva categoría al Directivo)' },
  ];

  const levelOptions = [
    { value: 'Básico', label: 'Básico' },
    { value: 'Intermedio', label: 'Intermedio' },
    { value: 'Avanzado', label: 'Avanzado' },
  ];

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === 'OTHER_CUSTOM') {
      setIsCustomCategory(true);
      onUpdate('requested_new_category', customCategoryText);
    } else {
      setIsCustomCategory(false);
      onUpdate('category_id', Number(val));
    }
  };

  const handleCustomCategoryChange = (e) => {
    const val = e.target.value;
    setCustomCategoryText(val);
    onUpdate('requested_new_category', val);
  };

  return (
    <div className="form-card">
      <SectionHeader
        stepNumber="Paso 2"
        title="Categoría y precio"
        subtitle="Segmenta el contenido y fija los montos oficiales de inscripción."
      />

      <div className="form-grid grid-3">
        <FormField label="Área de especialidad / Categoría" required htmlFor="category_id">
          <Select
            id="category_id"
            value={isCustomCategory ? 'OTHER_CUSTOM' : String(category_id || 1)}
            onChange={handleCategorySelect}
            options={categoryOptions}
            required
          />
        </FormField>

        {isCustomCategory && (
          <FormField
            label="Especificar nueva categoría"
            required
            htmlFor="custom_category"
            hint="Será enviada al panel del Directivo para su aprobación."
          >
            <Input
              id="custom_category"
              placeholder="Ej. Inteligencia Artificial y Machine Learning..."
              value={customCategoryText}
              onChange={handleCustomCategoryChange}
              required
            />
          </FormField>
        )}

        <FormField label="Nivel académico" htmlFor="nivel">
          <Select
            id="nivel"
            value={nivel}
            onChange={(e) => onUpdate('nivel', e.target.value)}
            options={levelOptions}
          />
        </FormField>

        <FormField label="Horas lectivas estimadas" htmlFor="horas">
          <Input
            id="horas"
            type="number"
            min="1"
            step="1"
            value={horas}
            onChange={(e) => onUpdate('horas', e.target.value)}
          />
        </FormField>

        <FormField label="Precio único del curso ($ MXN)" required htmlFor="precio">
          <Input
            id="precio"
            type="number"
            min="0"
            step="10"
            value={precio}
            onChange={(e) => onUpdate('precio', e.target.value)}
            required
          />
        </FormField>

        {/* Mensaje Informativo: No existe precio con descuento directo */}
        <div
          style={{
            gridColumn: isCustomCategory ? 'span 2' : 'span 2',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-warning-light)',
            border: '1px solid var(--color-light-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--color-warning)',
            fontSize: '0.82rem',
            fontWeight: 600,
          }}
        >
          <TicketPercent size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Gestión de Ofertas:</strong> El precio del curso es único. Los descuentos se gestionan exclusivamente a través del módulo de <strong>Cupones de Descuento</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}

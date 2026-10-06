import React, { useMemo } from 'react';
import { GeneralInfoSection } from '../components/organisms/GeneralInfoSection';
import { PricingSection } from '../components/organisms/PricingSection';
import { SyllabusEditorSection } from '../components/organisms/SyllabusEditorSection';
import { QuizEditorSection } from '../components/organisms/QuizEditorSection';
import { FloatingFooter } from '../components/organisms/FloatingFooter';
import { SuccessModal } from '../components/organisms/SuccessModal';
import { ArrowLeft, AlertCircle, Edit, X } from 'lucide-react';
import { Button } from '../components/atoms/Button';

export function CreateCoursePage({
  formState,
  categories = [],
}) {
  const {
    formData,
    isSubmitting,
    errorMessage,
    createdCourse,
    showSuccessModal,
    isEditing,
    cancelEdit,
    isLoadingCourseDetails,
    updateField,
    resetForm,
    addModule,
    updateModuleTitle,
    removeModule,
    addLesson,
    updateLesson,
    removeLesson,
    updateFinalQuiz,
    updateModuleQuiz,
    removeModuleQuiz,
    submitCourse,
    closeSuccessModal,
  } = formState;

  // Cálculo dinámico del almacenamiento de ayuda visual (PDF, Excel, guías, portadas) en tiempo real con límite de 500 MB
  const totalVisualAidMb = useMemo(() => {
    let sum = 0;

    // Peso de la imagen de portada si se cargó un archivo personalizado
    if (formData.portada_file_size_mb) {
      sum += Number(formData.portada_file_size_mb) || 0;
    } else if (formData.portada_path && formData.portada_path.startsWith('data:')) {
      sum += Number((formData.portada_path.length / (1024 * 1024)).toFixed(2));
    }

    // Peso acumulado de recursos adjuntos en lecciones (PDF, Excel, Zip, etc.)
    (formData.modulos || []).forEach(m => {
      (m.lecciones || []).forEach(l => {
        (l.resources || l.recursos || []).forEach(r => {
          sum += Number(r.sizeMb || r.size_mb) || (r.type === 'excel' ? 8.2 : r.type === 'zip' ? 42.0 : r.type === 'doc' ? 6.5 : 14.5);
        });
      });
    });

    return Number(sum.toFixed(1));
  }, [formData.modulos, formData.portada_path, formData.portada_file_size_mb]);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {isEditing && (
            <button
              type="button"
              onClick={cancelEdit}
              title="Volver al catálogo de Mis Cursos"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-xs)',
                transition: 'all 150ms ease',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={16} />
              <span>Volver a Mis Cursos</span>
            </button>
          )}

          <div>
            <h1 className="page-title" style={{ margin: 0 }}>
              {isEditing ? `Editar: "${formData.titulo || 'Programa formativo'}"` : 'Nuevo programa de formación'}
            </h1>
            <p className="page-subtitle" style={{ margin: '4px 0 0 0' }}>
              {isEditing
                ? 'Modifica la información académica, precios y estructura de módulos del curso.'
                : 'Define la información académica, precios y estructura de módulos para tus alumnos.'}
            </p>
          </div>
        </div>
      </div>

      {isLoadingCourseDetails && (
        <div style={{ padding: '20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
          Cargando estructura y temario del curso...
        </div>
      )}

      {errorMessage && (
        <div
          style={{
            padding: '14px 18px',
            background: 'var(--color-danger-light)',
            color: 'var(--color-danger)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            marginBottom: '20px',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={submitCourse} noValidate>
        {/* Step 1: General Info */}
        <GeneralInfoSection
          titulo={formData.titulo}
          resumen={formData.resumen}
          descripcion={formData.descripcion}
          portada_path={formData.portada_path}
          onUpdate={updateField}
        />

        {/* Step 2: Categorization & Pricing */}
        <PricingSection
          category_id={formData.category_id}
          nivel={formData.nivel}
          horas={formData.horas}
          precio={formData.precio}
          precio_promocional={formData.precio_promocional}
          idioma={formData.idioma}
          categories={categories}
          onUpdate={updateField}
        />

        {/* Step 3: Temario Modular con Exámenes de Módulo y Último Módulo de Certificación Global */}
        <SyllabusEditorSection
          modulos={formData.modulos}
          onAddModule={addModule}
          onUpdateModuleTitle={updateModuleTitle}
          onRemoveModule={removeModule}
          onAddLesson={addLesson}
          onUpdateLesson={updateLesson}
          onRemoveLesson={removeLesson}
          onUpdateModuleQuiz={updateModuleQuiz}
          onRemoveModuleQuiz={removeModuleQuiz}
          finalQuiz={formData.evaluacionFinal}
          onUpdateFinalQuiz={updateFinalQuiz}
        />
        {/* Bottom Floating Bar */}
        <FloatingFooter
          isSubmitting={isSubmitting}
          isEditing={isEditing}
          onReset={resetForm}
          onCancelEdit={cancelEdit}
          onSubmit={submitCourse}
          usedStorageMb={totalVisualAidMb}
          maxStorageMb={500}
        />
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        course={createdCourse}
        isEditing={isEditing}
        onClose={closeSuccessModal}
      />
    </div>
  );
}

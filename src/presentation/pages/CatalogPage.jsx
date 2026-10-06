import React, { useState } from 'react';
import { CourseGrid } from '../components/organisms/CourseGrid';
import { SyllabusModal } from '../components/organisms/SyllabusModal';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { QuizzesPage } from './QuizzesPage';
import { CreateCoursePage } from './CreateCoursePage';
import { Button } from '../components/atoms/Button';
import { ArrowLeft, X, Sparkles } from 'lucide-react';

export function CatalogPage({
  coursesState,
  categories = [],
  onEditCourse,
  quizzesState,
  formState = null,
  highlightedCourseId = null,
}) {
  const {
    filteredCourses,
    courses = [],
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    fetchCourses,
    deleteCourse,
    selectedCourseForSyllabus,
    syllabusData,
    isLoadingSyllabus,
    syllabusError,
    openSyllabusModal,
    closeSyllabusModal,
  } = coursesState;

  // Estado para el curso específico seleccionado desde su Card
  const [selectedCourseForExams, setSelectedCourseForExams] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    await deleteCourse(courseToDelete.id);
    setIsDeleting(false);
    setCourseToDelete(null);
  };

  // Al presionar el botón "Gestión de Exámenes" de la Card:
  const handleViewExamsForCourse = (course) => {
    if (quizzesState?.setFilterCourseId) {
      quizzesState.setFilterCourseId(course.id);
    }
    setSelectedCourseForExams(course);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

    // 1. Modo Edición in-place en Mis Cursos (Usa el encabezado limpio de CreateCoursePage)
  if (formState && formState.isEditing) {
    return (
      <div className="animate-fade-in">
        <CreateCoursePage formState={formState} categories={categories} />
      </div>
    );
  }

  // 2. Modo Gestión de Exámenes exclusiva del curso seleccionado en su Card
  if (selectedCourseForExams && quizzesState) {
    return (
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <QuizzesPage
          quizzesState={quizzesState}
          courses={courses}
          selectedCourse={selectedCourseForExams}
          onBackToCourses={() => {
            setSelectedCourseForExams(null);
            if (quizzesState?.setFilterCourseId) {
              quizzesState.setFilterCourseId('all');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  // 3. Vista principal de Catálogo de Cursos (Sin pestañas superiores redundantes)
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div>
          <h1 className="page-title">Catálogo de cursos</h1>
          <p className="page-subtitle">
            Listado de programas formativos actualmente registrados en la academia.
          </p>
        </div>
      </div>

      {highlightedCourseId && (
        <div
          className="animate-fade-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            background: 'rgba(30, 64, 175, 0.12)',
            border: '1.5px solid var(--color-primary)',
            borderRadius: 'var(--radius-lg)',
            marginBottom: '16px',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.3rem' }}>🎉</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.94rem', color: 'var(--color-primary)' }}>
                ¡Tu curso ha sido registrado exitosamente en Master Academy!
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Ya se encuentra visible para tus alumnos y destacado en la primera posición de tu catálogo.
              </div>
            </div>
          </div>
        </div>
      )}

      <CourseGrid
        courses={filteredCourses}
        isLoading={isLoading}
        error={error}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        onRefresh={fetchCourses}
        onViewSyllabus={openSyllabusModal}
        onEditCourse={onEditCourse}
        onDeleteCourse={(course) => setCourseToDelete(course)}
        onViewExams={handleViewExamsForCourse}
        highlightedCourseId={highlightedCourseId}
      />

      {/* Modal de Temario */}
      <SyllabusModal
        course={selectedCourseForSyllabus}
        syllabusData={syllabusData}
        isLoading={isLoadingSyllabus}
        error={syllabusError}
        onClose={closeSyllabusModal}
      />

      {/* Diálogo de Confirmación para Eliminar Curso */}
      <ConfirmDialog
        isOpen={Boolean(courseToDelete)}
        title="¿Eliminar curso del catálogo?"
        message={`Esta acción eliminará de forma permanente el curso "${courseToDelete?.title || ''}" junto con todas sus lecciones asociadas. Los alumnos perderán el acceso.`}
        confirmText="Eliminar curso"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setCourseToDelete(null)}
      />
    </div>
  );
}

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  ClipboardCheck,
  Plus,
  Trash2,
  Edit3,
  Award,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  BookOpen,
  Users,
  PlayCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ChevronRight,
  X,
  FileQuestion,
  Percent,
  Check,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { Input } from '../components/atoms/Input';
import { ConfirmDialog } from '../components/molecules/ConfirmDialog';
import { QuizEditorSection } from '../components/organisms/QuizEditorSection';
import { ModalPortal } from '../components/atoms/ModalPortal';

export function QuizzesPage({ quizzesState, courses = [], selectedCourse = null, onNavigateToCreate = null, onBackToCourses = null }) {
  const {
    quizzes,
    attempts,
    filteredQuizzes,
    stats,
    searchQuery,
    setSearchQuery,
    filterCourseId,
    setFilterCourseId,
    filterType,
    setFilterType,
    saveQuiz,
    deleteQuiz,
    startAttempt,
    submitAttempt,
    resetToDemo,
  } = quizzesState;

  // Sincronizar filtro cuando se pasa un curso específico
  useEffect(() => {
    if (selectedCourse && setFilterCourseId) {
      setFilterCourseId(selectedCourse.id);
    }
  }, [selectedCourse, setFilterCourseId]);

  // Active filtered course (if any)
  const activeFilteredCourse = useMemo(() => {
    if (selectedCourse) return selectedCourse;
    if (filterCourseId === 'all') return null;
    return courses.find((c) => String(c.id) === String(filterCourseId)) || null;
  }, [courses, filterCourseId, selectedCourse]);

  // Quizzes específicos para el curso seleccionado o listado filtrado
  const displayedQuizzes = useMemo(() => {
    let list = selectedCourse
      ? quizzes.filter((q) => String(q.courseId) === String(selectedCourse.id))
      : filteredQuizzes;

    if (selectedCourse) {
      if (filterType === 'final') list = list.filter((q) => q.isFinal);
      if (filterType === 'module') list = list.filter((q) => !q.isFinal);
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        list = list.filter(
          (q) =>
            (q.title || '').toLowerCase().includes(query) ||
            (q.moduleTitle || '').toLowerCase().includes(query) ||
            (q.description || '').toLowerCase().includes(query)
        );
      }
    }
    return list;
  }, [quizzes, filteredQuizzes, selectedCourse, filterType, searchQuery]);

  // Intentos específicos del curso seleccionado
  const displayedAttempts = useMemo(() => {
    let list = selectedCourse
      ? attempts.filter((a) => String(a.courseId) === String(selectedCourse.id))
      : attempts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (a) =>
          (a.studentName || '').toLowerCase().includes(query) ||
          (a.quizTitle || '').toLowerCase().includes(query)
      );
    }
    return list;
  }, [attempts, selectedCourse, searchQuery]);

  // Estadísticas del curso seleccionado
  const displayedStats = useMemo(() => {
    if (!selectedCourse) return stats;
    const courseQuizzes = quizzes.filter((q) => String(q.courseId) === String(selectedCourse.id));
    const total = courseQuizzes.length;
    const finalCount = courseQuizzes.filter((q) => Boolean(q.isFinal)).length;
    const moduleCount = total - finalCount;
    const courseAtts = attempts.filter((a) => String(a.courseId) === String(selectedCourse.id));
    const passedAtts = courseAtts.filter((a) => Boolean(a.isPassed)).length;
    const passRate = courseAtts.length > 0 ? Math.round((passedAtts / courseAtts.length) * 100) : 0;
    return {
      totalQuizzes: total,
      finalQuizzesCount: finalCount,
      moduleQuizzesCount: moduleCount,
      totalAttempts: courseAtts.length,
      passedAttempts: passedAtts,
      passRate,
    };
  }, [quizzes, attempts, selectedCourse, stats]);

  // Tabs: 'quizzes' | 'attempts'
  const [activeTab, setActiveTab] = useState('quizzes');

  // Modal: Create / Edit Quiz
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Form State inside Editor Modal
  const [formCourseId, setFormCourseId] = useState('');
  const [formCourseTitle, setFormCourseTitle] = useState('');
  const [formIsFinal, setFormIsFinal] = useState(false);
  const [formModuleTitle, setFormModuleTitle] = useState('');
  const [formQuizData, setFormQuizData] = useState({
    title: '',
    description: '',
    passingScore: 70,
    questions: [],
  });

  // Modal: Interactive Simulation
  const [simulationQuiz, setSimulationQuiz] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [simulationAnswers, setSimulationAnswers] = useState({});
  const [simulationResult, setSimulationResult] = useState(null);

  // Modal: Delete Confirmation
  const [quizToDelete, setQuizToDelete] = useState(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Open Editor for Creating
  const handleOpenCreate = () => {
    const defaultCourse = activeFilteredCourse || (courses.length > 0 ? courses[0] : null);
    setEditingQuiz(null);
    setFormCourseId(defaultCourse ? defaultCourse.id : 1);
    setFormCourseTitle(defaultCourse ? defaultCourse.title : 'Curso General');
    setFormIsFinal(false);
    setFormModuleTitle('Módulo 1');
    setFormQuizData({
      id: 'quiz_' + Date.now(),
      title: 'Evaluación de Módulo: ',
      description: 'Evaluación formativa opcional para afianzar conceptos del módulo antes de continuar.',
      passingScore: 60,
      questions: [
        {
          id: 'q_' + Date.now() + '_1',
          text: '',
          weightPoints: 50,
          options: [
            { id: 'opt_' + Date.now() + '_1', text: '', isCorrect: true },
            { id: 'opt_' + Date.now() + '_2', text: '', isCorrect: false },
            { id: 'opt_' + Date.now() + '_3', text: '', isCorrect: false },
          ],
        },
      ],
    });
    setIsEditorOpen(true);
  };

  // Open Editor for Editing
  const handleOpenEdit = (quiz) => {
    setEditingQuiz(quiz);
    setFormCourseId(quiz.courseId || (courses.length > 0 ? courses[0].id : ''));
    setFormCourseTitle(quiz.courseTitle || '');
    setFormIsFinal(Boolean(quiz.isFinal));
    setFormModuleTitle(quiz.moduleTitle || '');
    setFormQuizData({
      id: quiz.id,
      title: quiz.title || '',
      description: quiz.description || '',
      passingScore: quiz.passingScore || 70,
      questions: JSON.parse(JSON.stringify(quiz.questions || quiz.question || [])),
    });
    setIsEditorOpen(true);
  };

  // Save Quiz Form
  const handleSaveQuiz = (e) => {
    e.preventDefault();

    if (!formQuizData.title.trim()) {
      alert('Por favor especifica un título para la evaluación.');
      return;
    }

    if (!formQuizData.questions || formQuizData.questions.length === 0) {
      alert('Debes agregar al menos una pregunta al examen.');
      return;
    }

    // Verify all questions have at least 1 correct answer
    for (let i = 0; i < formQuizData.questions.length; i++) {
      const q = formQuizData.questions[i];
      if (!q.text.trim()) {
        alert('La pregunta #' + (i + 1) + ' no tiene enunciado.');
        return;
      }
      const hasCorrect = (q.options || []).some((opt) => opt.isCorrect);
      if (!hasCorrect) {
        alert('Debes seleccionar una opción correcta para la pregunta #' + (i + 1) + '.');
        return;
      }
    }

    const selectedCourse = courses.find((c) => String(c.id) === String(formCourseId));
    const courseTitle = selectedCourse ? selectedCourse.title : (formCourseTitle || 'Curso');

    const payload = {
      id: editingQuiz ? editingQuiz.id : (formQuizData.id || ('quiz_' + Date.now())),
      courseId: formCourseId,
      courseTitle: courseTitle,
      moduleId: formIsFinal ? 'final' : (formQuizData.moduleId || 1),
      moduleTitle: formIsFinal ? 'Módulo Final: Examen de Certificación Global' : formModuleTitle,
      title: formQuizData.title.trim(),
      description: formQuizData.description.trim(),
      isFinal: formIsFinal,
      passingScore: Number(formQuizData.passingScore) || 70,
      questions: formQuizData.questions,
    };

    saveQuiz(payload);
    setIsEditorOpen(false);
    showToast(editingQuiz ? '¡Evaluación actualizada con éxito!' : '¡Nueva evaluación creada con éxito!');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!quizToDelete) return;
    deleteQuiz(quizToDelete.id);
    setQuizToDelete(null);
    showToast('Evaluación eliminada correctamente.');
  };

  // Start Simulation
  const handleStartSimulation = (quiz) => {
    try {
      const attempt = startAttempt(quiz.id);
      setSimulationQuiz(quiz);
      setSimulationData(attempt);
      setSimulationAnswers({});
      setSimulationResult(null);
    } catch (err) {
      alert(err.message || 'Error al iniciar simulación');
    }
  };

  // Submit Simulation
  const handleSubmitSimulation = () => {
    if (!simulationQuiz) return;
    const result = submitAttempt({
      quizId: simulationQuiz.id,
      studentId: 'usr_instructor_test',
      studentName: 'Prof. Simulador (Instructor)',
      answers: simulationAnswers,
    });
    setSimulationResult(result);
    showToast('Simulación de examen calificada.');
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'var(--color-primary)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {selectedCourse && onBackToCourses && (
            <Button
              variant="outline"
              size="sm"
              icon={ArrowLeft}
              onClick={onBackToCourses}
              style={{ fontWeight: 700 }}
            >
              Volver a Mis Cursos
            </Button>
          )}
          <div>
            <h1 className="page-title">
              {selectedCourse ? `Gestión de Exámenes • ${selectedCourse.title}` : 'Gestión de Exámenes y Evaluaciones'}
            </h1>
            <p className="page-subtitle">
              {selectedCourse
                ? 'Exámenes formativos de módulo y evaluación final de certificación exclusivos de este curso.'
                : 'Evaluaciones formativas dentro de cada módulo y Módulo Final de Certificación Global.'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={RotateCcw}
            onClick={() => {
              if (window.confirm('¿Restablecer los exámenes e intentos iniciales de demostración?')) {
                resetToDemo();
                showToast('Datos demo de evaluaciones restablecidos.');
              }
            }}
            title="Restablecer datos demo"
          >
            Restablecer Demo
          </Button>
        </div>
      </div>

      {/* Active Course Filter Banner */}
      {activeFilteredCourse && !selectedCourse && (
        <div
          style={{
            padding: '14px 20px',
            background: 'var(--color-primary-light, rgba(30, 64, 175, 0.14))',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-primary-glow, rgba(30, 64, 175, 0.3))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(30, 64, 175, 0.35)',
              }}
            >
              <ClipboardCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Gestión de Evaluaciones Exclusivas del Curso
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                {activeFilteredCourse.title}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Mostrando únicamente los exámenes formativos y de certificación de esta materia ({filteredQuizzes.length} {filteredQuizzes.length === 1 ? 'evaluación registrada' : 'evaluaciones registradas'}).
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {onBackToCourses && (
              <button
                type="button"
                onClick={onBackToCourses}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-light-border)',
                  background: 'var(--color-card-bg)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                }}
              >
                <ArrowLeft size={16} />
                <span>Volver a Mis Cursos</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setFilterCourseId('all')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: 'var(--color-primary)',
                color: '#ffffff',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 150ms ease',
              }}
            >
              <span>Ver Todas las Materias</span>
            </button>
          </div>
        </div>
      )}

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
            <ClipboardCheck size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Total Evaluaciones</div>
            <div className="mini-stat-value">{displayedStats.totalQuizzes}</div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'rgba(234, 179, 8, 0.15)', color: '#eab308' }}>
            <Award size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Módulo Final: Certificación Global</div>
            <div className="mini-stat-value">
              {displayedStats.finalQuizzesCount} <span style={{ fontSize: '0.72rem', color: '#a16207', fontWeight: 600 }}>Requisito Diploma</span>
            </div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-secondary-light)', color: 'var(--color-secondary)' }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Exámenes de Módulos</div>
            <div className="mini-stat-value">
              {displayedStats.moduleQuizzesCount} <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>(Formativos)</span>
            </div>
          </div>
        </div>

        <div className="mini-stat-card">
          <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="mini-stat-label">Tasa de Alumnos Aptos</div>
            <div className="mini-stat-value">
              {displayedStats.passRate}% <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>({stats.totalAttempts} intentos)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav Tabs & Controls Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          background: 'var(--color-card-bg)',
          padding: '12px 18px',
          borderRadius: '12px',
          border: '1px solid var(--color-light-border)',
        }}
      >
        {/* View Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'quizzes' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'quizzes' ? '#fff' : 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <BookOpen size={16} />
            <span>Catálogo de Evaluaciones por Módulo</span>
            <span
              style={{
                fontSize: '0.72rem',
                background: activeTab === 'quizzes' ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-input-bg)',
                padding: '2px 7px',
                borderRadius: '999px',
              }}
            >
              {filteredQuizzes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('attempts')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'attempts' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'attempts' ? '#fff' : 'var(--color-text-muted)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 150ms ease',
            }}
          >
            <Users size={16} />
            <span>Historial de Intentos y Alumnos Aptos</span>
            <span
              style={{
                fontSize: '0.72rem',
                background: activeTab === 'attempts' ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-input-bg)',
                padding: '2px 7px',
                borderRadius: '999px',
              }}
            >
              {attempts.length}
            </span>
          </button>
        </div>

        {/* Filters */}
        {activeTab === 'quizzes' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--color-text-muted)',
                }}
              />
              <input
                type="text"
                placeholder="Buscar examen o curso..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 32px',
                  borderRadius: '8px',
                  background: 'var(--color-input-bg)',
                  border: '1px solid var(--color-input-border)',
                  color: 'var(--color-text-main)',
                  fontSize: '0.82rem',
                }}
              />
            </div>

            {!selectedCourse && (
            <select
              value={filterCourseId}
              onChange={(e) => setFilterCourseId(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'var(--color-input-bg)',
                border: '1px solid var(--color-input-border)',
                color: 'var(--color-text-main)',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <option value="all">Todos los cursos</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '8px',
                background: 'var(--color-input-bg)',
                border: '1px solid var(--color-input-border)',
                color: 'var(--color-text-main)',
                fontSize: '0.82rem',
                cursor: 'pointer',
              }}
            >
              <option value="all">Todos los niveles</option>
              <option value="final">⭐ Módulo Final: Certificación Global</option>
              <option value="module">📘 Exámenes dentro de Módulo (Opcionales)</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Catálogo de Evaluaciones */}
      {activeTab === 'quizzes' && (
        <>
          {displayedQuizzes.length === 0 ? (
            <div
              style={{
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <ClipboardCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                No se encontraron evaluaciones
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', maxWidth: '460px', margin: '0 auto 20px' }}>
                {searchQuery || filterCourseId !== 'all' || filterType !== 'all'
                  ? 'No hay evaluaciones que coincidan con los filtros seleccionados.'
                  : 'Aún no has registrado ningún módulo de examen o evaluación final.'}
              </p>
              {onNavigateToCreate ? (
                <Button variant="primary" icon={BookOpen} onClick={onNavigateToCreate}>
                  Ir al Editor de Cursos
                </Button>
              ) : (
                <span style={{ fontSize: '0.84rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                  Los exámenes se agregan dentro de cada curso en el temario
                </span>
              )}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {displayedQuizzes.map((quiz) => {
                const questionsList = quiz.questions || quiz.question || [];
                const totalPoints = questionsList.reduce((acc, q) => acc + (Number(q.weightPoints) || 0), 0);
                const quizAttempts = attempts.filter((a) => String(a.quizId) === String(quiz.id));

                return (
                  <div
                    key={quiz.id}
                    style={{
                      background: 'var(--color-card-bg)',
                      border: quiz.isFinal ? '2px solid rgba(234, 179, 8, 0.4)' : '1px solid var(--color-light-border)',
                      borderLeft: quiz.isFinal ? '6px solid #eab308' : '6px solid var(--color-primary)',
                      borderRadius: '14px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: quiz.isFinal ? '0 4px 14px rgba(234, 179, 8, 0.12)' : 'var(--shadow-sm)',
                      transition: 'all 200ms ease',
                      position: 'relative',
                    }}
                  >
                    <div>
                      {/* Top Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '12px' }}>
                        {quiz.isFinal ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'rgba(234, 179, 8, 0.15)',
                              color: '#a16207',
                              fontWeight: 800,
                              fontSize: '0.74rem',
                              padding: '5px 12px',
                              borderRadius: '8px',
                              boxShadow: '0 1px 3px rgba(234, 179, 8, 0.2)',
                            }}
                          >
                            <Award size={14} /> MÓDULO FINAL • CERTIFICACIÓN GLOBAL (OBLIGATORIO)
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: 'var(--color-secondary-light)',
                              color: 'var(--color-secondary)',
                              fontWeight: 700,
                              fontSize: '0.74rem',
                              padding: '4px 10px',
                              borderRadius: '6px',
                            }}
                          >
                            <Layers size={13} /> EXAMEN DE MÓDULO (OPCIONAL)
                          </span>
                        )}

                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            background: quiz.isFinal ? 'rgba(234, 179, 8, 0.2)' : 'var(--color-input-bg)',
                            color: quiz.isFinal ? '#a16207' : 'var(--color-text-main)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: quiz.isFinal ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid var(--color-light-border)',
                          }}
                        >
                          Mín. {quiz.passingScore}%
                        </span>
                      </div>

                      {/* Badge de Regla de Intentos */}
                      <div style={{ marginBottom: '10px' }}>
                        {quiz.isFinal ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: 'rgba(220, 38, 38, 0.12)',
                              color: '#dc2626',
                              fontWeight: 800,
                              fontSize: '0.72rem',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(220, 38, 38, 0.3)',
                            }}
                          >
                            🔒 Límite: 5 intentos (Reinicio de curso al reprobar)
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              background: 'var(--color-success-light)',
                              color: 'var(--color-success)',
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              padding: '3px 10px',
                              borderRadius: '6px',
                              border: '1px solid rgba(5, 150, 105, 0.3)',
                            }}
                          >
                            🔄 Reintentos formativos ilimitados
                          </span>
                        )}
                      </div>

                      {/* Course / Module context */}
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                        {quiz.courseTitle || 'Curso'} {quiz.moduleTitle ? (' • ' + quiz.moduleTitle) : ''}
                      </div>

                      {/* Title */}
                      <h3
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 800,
                          color: 'var(--color-text-main)',
                          marginBottom: '8px',
                          lineHeight: 1.35,
                        }}
                      >
                        {quiz.title}
                      </h3>

                      {/* Pedagogical Description */}
                      <p
                        style={{
                          fontSize: '0.83rem',
                          color: 'var(--color-text-muted)',
                          marginBottom: '16px',
                          lineHeight: 1.45,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {quiz.description || (quiz.isFinal
                          ? 'Evaluación global obligatoria para determinar si el estudiante es apto para la certificación oficial del curso.'
                          : 'Evaluación formativa opcional de repaso temático.')}
                      </p>

                      {/* Stat Pills */}
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap',
                          padding: '10px 12px',
                          background: quiz.isFinal ? 'rgba(234, 179, 8, 0.08)' : 'var(--color-input-bg)',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          fontSize: '0.78rem',
                          color: 'var(--color-text-main)',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <FileQuestion size={13} color="var(--color-primary)" />
                          {questionsList.length} preguntas
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <Percent size={13} color="var(--color-success)" />
                          {totalPoints} pts ponderados
                        </span>
                        <span>•</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                          <Users size={13} color="var(--color-text-muted)" />
                          {quizAttempts.length} intentos
                        </span>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        paddingTop: '12px',
                        borderTop: '1px solid var(--color-light-border)',
                      }}
                    >
                      <Button
                        variant={quiz.isFinal ? 'primary' : 'secondary'}
                        size="sm"
                        icon={PlayCircle}
                        onClick={() => handleStartSimulation(quiz)}
                        title="Probar este examen en vivo como alumno"
                        style={quiz.isFinal ? { background: 'linear-gradient(135deg, #eab308, #ca8a04)', border: 'none', color: '#fff' } : {}}
                      >
                        Simular Examen
                      </Button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Edit3}
                          onClick={() => handleOpenEdit(quiz)}
                          title="Editar preguntas y ponderación"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="dangerSubtle"
                          size="sm"
                          icon={Trash2}
                          onClick={() => setQuizToDelete(quiz)}
                          title="Eliminar examen"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Historial de Intentos y Alumnos Aptos */}
      {activeTab === 'attempts' && (
        <div
          style={{
            background: 'var(--color-card-bg)',
            border: '1px solid var(--color-light-border)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {displayedAttempts.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
              Aún no hay intentos registrados por parte de los alumnos.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr
                    style={{
                      background: 'var(--color-input-bg)',
                      borderBottom: '1px solid var(--color-light-border)',
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      fontSize: '0.72rem',
                      letterSpacing: '0.5px',
                    }}
                  >
                    <th style={{ padding: '14px 18px' }}>Estudiante</th>
                    <th style={{ padding: '14px 18px' }}>Módulo / Evaluación</th>
                    <th style={{ padding: '14px 18px' }}>Calificación</th>
                    <th style={{ padding: '14px 18px' }}>Estatus de Aptitud (Diploma)</th>
                    <th style={{ padding: '14px 18px' }}>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((att, index) => {
                    const dateFormatted = att.completedAt
                      ? new Date(att.completedAt).toLocaleString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Reciente';

                    return (
                      <tr
                        key={att.id || index}
                        style={{
                          borderBottom: '1px solid var(--color-light-border)',
                          transition: 'background 150ms ease',
                        }}
                      >
                        <td style={{ padding: '14px 18px', fontWeight: 600, color: 'var(--color-text-main)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: att.isPassed ? 'var(--color-success-light)' : 'rgba(239, 68, 68, 0.15)',
                                color: att.isPassed ? 'var(--color-success)' : 'var(--color-danger)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                              }}
                            >
                              {(att.studentName || 'A').charAt(0)}
                            </div>
                            <div>
                              <div>{att.studentName || 'Alumno'}</div>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{att.studentId}</span>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '14px 18px', color: 'var(--color-text-main)' }}>
                          <div style={{ fontWeight: 700 }}>{att.quizTitle || att.quizId}</div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            Curso #{att.courseId} • {att.isFinal ? 'Módulo Final de Certificación' : 'Módulo Formativo'}
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px', fontWeight: 800, fontSize: '0.98rem' }}>
                          <span style={{ color: att.isPassed ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            {att.score}%
                          </span>
                        </td>

                        <td style={{ padding: '14px 18px' }}>
                          {att.isFinal ? (
                            att.isPassed ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: 'var(--color-success-light)',
                                  color: 'var(--color-success)',
                                  padding: '5px 12px',
                                  borderRadius: '999px',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                }}
                              >
                                <Award size={14} /> APTO PARA CERTIFICACIÓN (Intento {att.attemptNumber || 1}/5)
                              </span>
                            ) : (
                              (att.courseReset || (att.attemptNumber && att.attemptNumber >= 5)) ? (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: 'rgba(220, 38, 38, 0.16)',
                                    color: '#dc2626',
                                    padding: '5px 12px',
                                    borderRadius: '999px',
                                    fontSize: '0.74rem',
                                    fontWeight: 800,
                                    border: '1px solid rgba(220, 38, 38, 0.4)',
                                  }}
                                >
                                  <AlertCircle size={14} /> CURSO REINICIADO (5/5 intentos agotados - Requiere recompra)
                                </span>
                              ) : (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    background: 'rgba(217, 119, 6, 0.14)',
                                    color: '#b45309',
                                    padding: '5px 12px',
                                    borderRadius: '999px',
                                    fontSize: '0.74rem',
                                    fontWeight: 800,
                                  }}
                                >
                                  <AlertCircle size={14} /> NO APTO (Intento {att.attemptNumber || 1}/5 - {att.remainingAttempts ?? (5 - (att.attemptNumber || 1))} restantes)
                                </span>
                              )
                            )
                          ) : (
                            att.isPassed ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: 'var(--color-primary-light)',
                                  color: '#0284c7',
                                  padding: '4px 10px',
                                  borderRadius: '999px',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                }}
                              >
                                <CheckCircle2 size={13} /> Aprobado (Formativo ilimitado)
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  background: 'var(--color-input-bg)',
                                  color: 'var(--color-text-muted)',
                                  padding: '4px 10px',
                                  borderRadius: '999px',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                }}
                              >
                                En Progreso (Reintentos ilimitados)
                              </span>
                            )
                          )}
                        </td>

                        <td style={{ padding: '14px 18px', color: 'var(--color-text-muted)', fontSize: '0.78rem' }}>
                          {dateFormatted}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal: Editor de Evaluación */}
      {isEditorOpen && (
        <ModalPortal isOpen={isEditorOpen}>
          <div className="modal-overlay-backdrop" style={{ zIndex: 1000000, overflowY: 'auto', padding: '24px 12px' }} onClick={(e) => { if (e.target === e.currentTarget) setIsEditorOpen(false); }}>
          <div
            className="modal-content-card"
            style={{
              maxWidth: '920px',
              width: '100%',
              margin: 'auto',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  {editingQuiz ? 'Editar Evaluación' : 'Crear Nueva Evaluación'}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Configura exámenes formativos dentro de módulos o el <strong>Módulo Final de Certificación Global</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                  padding: '6px',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Context Row: Curso Asociado */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-label)' }}>
                  Curso Asociado *
                </label>
                <select
                  value={formCourseId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setFormCourseId(id);
                    const crs = courses.find((c) => String(c.id) === String(id));
                    if (crs) setFormCourseTitle(crs.title);
                  }}
                  required
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--color-input-bg)',
                    border: '1px solid var(--color-input-border)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.85rem',
                  }}
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                  {courses.length === 0 && <option value="1">Curso General / Demo</option>}
                </select>
              </div>

              {/* Selector de Nivel de Evaluación */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-label)' }}>
                  Ubicación y Función de la Evaluación *
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '12px' }}>
                  {/* Opción 1: Examen dentro de Módulo Formativo */}
                  <div
                    onClick={() => {
                      setFormIsFinal(false);
                      setFormQuizData(prev => ({
                        ...prev,
                        title: prev.title.includes('Certificación') ? 'Evaluación de Repaso: Módulo ' + formModuleTitle : prev.title,
                        passingScore: 60
                      }));
                    }}
                    style={{
                      border: !formIsFinal ? '2px solid var(--color-primary)' : '1px solid var(--color-light-border)',
                      background: !formIsFinal ? 'var(--color-primary-light)' : 'var(--color-input-bg)',
                      padding: '16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Layers size={18} color="var(--color-primary)" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-primary)' }}>
                        Dentro de un Módulo Temático (Opcional)
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      Evaluación formativa para que el estudiante autoevalúe su progreso en un módulo temático específico.
                    </p>
                  </div>

                  {/* Opción 2: Módulo Final de Certificación Global */}
                  <div
                    onClick={() => {
                      setFormIsFinal(true);
                      setFormQuizData(prev => ({
                        ...prev,
                        title: 'Evaluación Final de Certificación Global',
                        description: 'Evaluación global obligatoria para determinar si el estudiante es apto para la emisión de su certificado oficial.',
                        passingScore: 75
                      }));
                    }}
                    style={{
                      border: formIsFinal ? '2px solid #eab308' : '1px solid var(--color-light-border)',
                      background: formIsFinal ? 'rgba(234, 179, 8, 0.12)' : 'var(--color-input-bg)',
                      padding: '16px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <Award size={18} color="#ca8a04" />
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#a16207' }}>
                        Como ÚLTIMO MÓDULO del Curso (Certificación Oficial)
                      </span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      Examen global obligatorio. El alumno debe aprobarlo con la nota mínima requerida para ser <strong>APTO</strong> para recibir el diploma.
                    </p>
                  </div>
                </div>
              </div>

              {/* Si es de módulo: Título o número del módulo */}
              {!formIsFinal && (
                <div style={{ background: 'var(--color-input-bg)', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-light-border)' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-label)' }}>
                    Módulo Perteneciente *
                  </label>
                  <Input
                    value={formModuleTitle}
                    onChange={(e) => setFormModuleTitle(e.target.value)}
                    placeholder="Ej. Módulo 2: State Management y Arquitectura"
                    required={!formIsFinal}
                  />
                  <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                    Indica a qué módulo del curso se integrará esta evaluación formativa.
                  </span>
                </div>
              )}

              {/* Título y Descripción del Examen */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-label)' }}>
                    Título de la Evaluación *
                  </label>
                  <Input
                    value={formQuizData.title}
                    onChange={(e) => setFormQuizData((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="Ej. Examen de Certificación Global: Arquitectura y Desarrollo Avanzado"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-label)' }}>
                    Descripción o Instrucciones
                  </label>
                  <textarea
                    value={formQuizData.description}
                    onChange={(e) => setFormQuizData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe las instrucciones para el alumno al rendir este examen..."
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: 'var(--color-input-bg)',
                      border: '1px solid var(--color-input-border)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.85rem',
                      fontFamily: 'inherit',
                      resize: 'vertical',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-label)' }}>
                    Nota Mínima Aprobatoria (%) {formIsFinal ? '• Requisito de Aptitud para Diploma *' : '*'}
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={formQuizData.passingScore}
                      onChange={(e) => setFormQuizData((prev) => ({ ...prev, passingScore: Number(e.target.value) }))}
                      style={{
                        width: '90px',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-input-bg)',
                        border: formIsFinal ? '2px solid #eab308' : '1px solid var(--color-input-border)',
                        color: 'var(--color-text-main)',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        textAlign: 'center',
                      }}
                    />
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {formIsFinal
                        ? '% mínimo requerido para declarar al alumno como APTO para recibir el certificado oficial.'
                        : '% de respuestas correctas requeridas para aprobar este módulo.'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quiz Editor Component (Questions, Points, Options) */}
              <div style={{ marginTop: '10px' }}>
                <QuizEditorSection
                  quiz={formQuizData}
                  onChange={(updated) => setFormQuizData(updated)}
                  isFinal={formIsFinal}
                  stepNumber={null}
                />
              </div>

              {/* Modal Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px',
                  marginTop: '20px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--color-light-border)',
                }}
              >
                <Button variant="secondary" onClick={() => setIsEditorOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" icon={CheckCircle2} type="submit">
                  {editingQuiz ? 'Guardar Cambios' : 'Registrar Examen'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Modal: Interactive Simulation (Vista Alumno con Verificación de Aptitud) */}
      {simulationQuiz && simulationData && (
        <ModalPortal isOpen={Boolean(simulationQuiz && simulationData)}>
          <div className="modal-overlay-backdrop" style={{ zIndex: 1000000, overflowY: 'auto', padding: '24px 12px' }} onClick={(e) => { if (e.target === e.currentTarget) closeSimulation(); }}>
          <div
            className="modal-content-card"
            style={{
              maxWidth: '760px',
              width: '100%',
              margin: 'auto',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
              borderRadius: '16px',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span
                  style={{
                    background: simulationQuiz.isFinal ? 'rgba(234, 179, 8, 0.2)' : 'var(--color-primary-light)',
                    color: simulationQuiz.isFinal ? '#a16207' : 'var(--color-primary)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  {simulationQuiz.isFinal
                    ? '⭐ SIMULADOR: MÓDULO FINAL DE CERTIFICACIÓN GLOBAL'
                    : '📘 SIMULADOR: EXAMEN FORMATIVO DE MÓDULO'}
                </span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginTop: '6px' }}>
                  {simulationData.title}
                </h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  Nota mínima requerida: <strong>{simulationData.passingScore}%</strong> • Total de preguntas: {simulationData.questions.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSimulationQuiz(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* If result already calculated */}
            {simulationResult ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'center', padding: '16px 0' }}>
                <div
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    background: simulationResult.isPassed ? 'var(--color-success-light)' : 'rgba(239, 68, 68, 0.15)',
                    color: simulationResult.isPassed ? 'var(--color-success)' : 'var(--color-danger)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    fontSize: '2rem',
                    fontWeight: 900,
                  }}
                >
                  {simulationResult.score}%
                </div>

                <div>
                  {simulationQuiz.isFinal ? (
                    simulationResult.isPassed ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--color-success-light)', color: 'var(--color-success)', padding: '6px 16px', borderRadius: '999px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
                        <Award size={18} /> ¡APTO PARA CERTIFICACIÓN OFICIAL! (Intento {simulationResult.attemptNumber || 1}/5)
                      </div>
                    ) : (
                      simulationResult.courseReset ? (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(220, 38, 38, 0.18)', color: '#dc2626', padding: '8px 18px', borderRadius: '999px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px', border: '1px solid rgba(220, 38, 38, 0.4)' }}>
                          <AlertCircle size={18} /> 🚨 CURSO REINICIADO (5 de 5 Intentos Agotados)
                        </div>
                      ) : (
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-danger)', padding: '6px 16px', borderRadius: '999px', fontWeight: 800, fontSize: '0.9rem', marginBottom: '8px' }}>
                          <AlertCircle size={18} /> NO APTO (Intento {simulationResult.attemptNumber || 1} de 5 - {simulationResult.remainingAttempts ?? 4} restantes)
                        </div>
                      )
                    )
                  ) : (
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: simulationResult.isPassed ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {simulationResult.isPassed ? '¡Evaluación de Módulo Superada! (Formativo)' : 'Evaluación de Módulo No Aprobada (Reintentos ilimitados)'}
                    </div>
                  )}

                  <p style={{ color: 'var(--color-text-main)', fontSize: '0.9rem', marginTop: '8px', maxWidth: '520px', margin: '8px auto 0', lineHeight: 1.45 }}>
                    {simulationResult.message}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
                  <Button
                    variant="secondary"
                    icon={RotateCcw}
                    onClick={() => {
                      handleStartSimulation(simulationQuiz);
                    }}
                  >
                    Reintentar Simulación
                  </Button>
                  <Button variant="primary" onClick={() => setSimulationQuiz(null)}>
                    Finalizar y Cerrar
                  </Button>
                </div>
              </div>
            ) : (
              /* Questions taking flow */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {simulationData.questions.map((q, qIdx) => (
                  <div
                    key={q.id}
                    style={{
                      background: 'var(--color-input-bg)',
                      border: '1px solid var(--color-light-border)',
                      borderRadius: '12px',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                        PREGUNTA #{qIdx + 1}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                        {q.weightPoints} pts
                      </span>
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {q.text}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {q.options.map((opt) => {
                        const isSelected = simulationAnswers[q.id] === opt.id;
                        return (
                          <label
                            key={opt.id}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              background: isSelected ? 'var(--color-primary-light)' : 'var(--color-card-bg)',
                              border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-input-border)',
                              cursor: 'pointer',
                              transition: 'all 150ms ease',
                            }}
                          >
                            <input
                              type="radio"
                              name={'sim_q_' + q.id}
                              checked={isSelected}
                              onChange={() => {
                                setSimulationAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: opt.id,
                                }));
                              }}
                              style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)' }}
                            />
                            <span style={{ fontSize: '0.88rem', color: 'var(--color-text-main)', fontWeight: isSelected ? 600 : 400 }}>
                              {opt.text}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    marginTop: '10px',
                    paddingTop: '16px',
                    borderTop: '1px solid var(--color-light-border)',
                  }}
                >
                  <Button variant="secondary" onClick={() => setSimulationQuiz(null)}>
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    icon={Check}
                    onClick={handleSubmitSimulation}
                    disabled={Object.keys(simulationAnswers).length === 0}
                  >
                    Calificar Examen
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        </ModalPortal>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(quizToDelete)}
        title="¿Eliminar evaluación?"
        message={'¿Estás seguro de que deseas eliminar la evaluación "' + (quizToDelete?.title || '') + '"? Esta acción borrará las preguntas asociadas.'}
        confirmText="Eliminar Evaluación"
        cancelText="Cancelar"
        onConfirm={handleConfirmDelete}
        onCancel={() => setQuizToDelete(null)}
      />
    </div>
  );
}

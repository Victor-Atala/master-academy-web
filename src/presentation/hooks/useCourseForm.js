export function scrollToPageTop(behavior = 'smooth') {
  try {
    window.scrollTo({ top: 0, left: 0, behavior });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
    const container = document.querySelector('.admin-main-container');
    if (container) container.scrollTop = 0;
    const viewport = document.querySelector('.admin-main-viewport');
    if (viewport) viewport.scrollTop = 0;
  } catch (e) {
    window.scrollTo(0, 0);
  }
}

import { useState, useCallback } from 'react';
import { CreateCourseUseCase } from '../../application/usecases/CreateCourseUseCase';
import { UpdateCourseUseCase } from '../../application/usecases/UpdateCourseUseCase';
import { GetCourseSyllabusUseCase } from '../../application/usecases/GetCourseSyllabusUseCase';
import { CourseRepositoryImpl } from '../../data/repositories/CourseRepositoryImpl';
import { QuizRepository } from '../../data/repositories/QuizRepository';
import { DEMO_COURSE_DATA } from '../../core/constants/presets.constants';

const courseRepository = new CourseRepositoryImpl();
const createCourseUseCase = new CreateCourseUseCase(courseRepository);
const updateCourseUseCase = new UpdateCourseUseCase(courseRepository);
const getCourseSyllabusUseCase = new GetCourseSyllabusUseCase(courseRepository);

const INITIAL_FORM_STATE = {
  titulo: '',
  resumen: '',
  descripcion: '',
  portada_path: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
  category_id: 1,
  nivel: 'Intermedio',
  horas: 16,
  precio: 450,
  precio_promocional: 349,
  idioma: 'Español',
  modulos: [
    {
      id: 'mod-1',
      titulo: 'Módulo 1: Fundamentos y Conceptos Clave',
      evaluacion: null,
      lecciones: [
        {
          id: 'les-1',
          titulo: 'Lección 1: Introducción y Metodología',
          contenido: 'Visión general del curso y preparación del entorno de trabajo.',
          video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        }
      ]
    }
  ],
  evaluacionFinal: {
    title: 'Evaluación Final de Certificación',
    passingScore: 75,
    questions: [
      {
        id: 'q_default_1',
        text: '¿Cuál es la función principal de la arquitectura modular definida para este curso?',
        weightPoints: 50,
        options: [
          { id: 'opt_d1', text: 'Garantizar escalabilidad, desacoplamiento y alta mantenibilidad en producción.', isCorrect: true },
          { id: 'opt_d2', text: 'Reducir el tamaño de las pantallas en dispositivos móviles sin optimizar código.', isCorrect: false },
          { id: 'opt_d3', text: 'Evitar el uso de pruebas unitarias o de integración en el proyecto.', isCorrect: false },
          { id: 'opt_d4', text: 'Eliminar la necesidad de utilizar bases de datos o servicios remotos.', isCorrect: false }
        ]
      },
      {
        id: 'q_default_2',
        text: 'En una evaluación de opción múltiple ponderada, ¿qué asegura el peso de cada pregunta?',
        weightPoints: 50,
        options: [
          { id: 'opt_d5', text: 'Que cada pregunta contribuya con su puntaje proporcional a la nota global de 0 a 100%.', isCorrect: true },
          { id: 'opt_d6', text: 'Que todas las preguntas valgan siempre cero puntos en el sistema.', isCorrect: false },
          { id: 'opt_d7', text: 'Que el examen no requiera ninguna calificación mínima para el certificado.', isCorrect: false },
          { id: 'opt_d8', text: 'Que las respuestas correctas no puedan ser verificadas por el evaluador.', isCorrect: false }
        ]
      }
    ]
  }
};

export function useCourseForm({ onCourseCreated, onCourseUpdated, onModalClosed } = {}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [createdCourse, setCreatedCourse] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [isLoadingCourseDetails, setIsLoadingCourseDetails] = useState(false);

  const updateField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const fillDemoData = useCallback(() => {
    setFormData({
      ...DEMO_COURSE_DATA,
      modulos: JSON.parse(JSON.stringify(DEMO_COURSE_DATA.modulos)),
      evaluacionFinal: JSON.parse(JSON.stringify(DEMO_COURSE_DATA.evaluacionFinal))
    });
    setErrorMessage(null);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setIsEditing(false);
    setEditingCourseId(null);
    setErrorMessage(null);
  }, []);

  const cancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  // Load an existing course into the form for editing
  const loadCourseForEdit = useCallback(async (course) => {
    setIsLoadingCourseDetails(true);
    setIsEditing(true);
    setEditingCourseId(course.id);
    setErrorMessage(null);

    let modulos = [];
    try {
      const syllabusList = await getCourseSyllabusUseCase.execute(course.id);
      if (Array.isArray(syllabusList) && syllabusList.length > 0) {
        modulos = syllabusList.map((m, mIdx) => {
          const children = m.children || m.lecciones || m.lessons || [];
          return {
            id: `mod-${m.id || mIdx}-${Date.now()}`,
            titulo: m.title || m.titulo || `Módulo ${mIdx + 1}`,
            lecciones: children.length > 0
              ? children.map((l, lIdx) => ({
                  id: `les-${l.id || lIdx}-${Date.now()}`,
                  titulo: l.title || l.titulo || `Lección ${lIdx + 1}`,
                  contenido: l.content || l.contenido || '',
                  video: l.video || 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
                }))
              : [
                  {
                    id: `les-default-${Date.now()}`,
                    titulo: 'Lección 1: Clase Inicial',
                    contenido: 'Contenido introductorio.',
                    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
                  }
                ]
          };
        });
      }
    } catch (e) {
      console.warn('Could not load detailed syllabus for editing:', e);
    } finally {
      setIsLoadingCourseDetails(false);
    }

    if (modulos.length === 0) {
      modulos = JSON.parse(JSON.stringify(INITIAL_FORM_STATE.modulos));
    }

    setFormData({
      titulo: course.title || '',
      resumen: course.summary || '',
      descripcion: course.description || '',
      portada_path: course.coverUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600',
      category_id: course.categoryId || 1,
      nivel: course.level || 'Intermedio',
      horas: course.hours || 16,
      precio: course.price || 450,
      precio_promocional: course.promotionalPrice || course.price || 349,
      idioma: 'Español',
      modulos,
      evaluacionFinal: (() => {
        try {
          const courseQuizzes = QuizRepository.getQuizzesByCourse(course.id);
          const q = Array.isArray(courseQuizzes) && courseQuizzes.length > 0 ? (courseQuizzes.find(x => x.isFinal) || courseQuizzes[0]) : null;
          if (q) {
            return {
              id: q.id,
              title: q.title || 'Evaluación Final de Certificación',
              passingScore: q.passingScore || 75,
              questions: q.questions || [],
            };
          }
        } catch (e) {}
        return JSON.parse(JSON.stringify(INITIAL_FORM_STATE.evaluacionFinal));
      })(),
    });
  }, []);

  // Module Management
  const addModule = useCallback(() => {
    setFormData(prev => {
      const nextIndex = prev.modulos.length + 1;
      const newModule = {
        id: `mod-${Date.now()}`,
        titulo: `Módulo ${nextIndex}: Nuevo Tema de Estudio`,
        lecciones: [
          {
            id: `les-${Date.now()}-1`,
            titulo: 'Lección 1: Clase Inicial',
            contenido: 'Objetivos y desarrollo de conceptos prácticos.',
            video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
          }
        ]
      };
      return { ...prev, modulos: [...prev.modulos, newModule] };
    });
  }, []);

  const updateModuleTitle = useCallback((moduleId, title) => {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.map(m => m.id === moduleId ? { ...m, titulo: title } : m)
    }));
  }, []);

  const removeModule = useCallback((moduleId) => {
    setFormData(prev => {
      if (prev.modulos.length <= 1) return prev;
      return {
        ...prev,
        modulos: prev.modulos.filter(m => m.id !== moduleId)
      };
    });
  }, []);

  // Lesson Management
  const addLesson = useCallback((moduleId) => {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.map(m => {
        if (m.id !== moduleId) return m;
        const nextLesIndex = m.lecciones.length + 1;
        const newLesson = {
          id: `les-${Date.now()}`,
          titulo: `Lección ${nextLesIndex}: Nueva Clase Práctica`,
          contenido: 'Explicación técnica y demostración en video.',
          video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
        };
        return { ...m, lecciones: [...m.lecciones, newLesson] };
      })
    }));
  }, []);

  const updateLesson = useCallback((moduleId, lessonId, field, value) => {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.map(m => {
        if (m.id !== moduleId) return m;
        return {
          ...m,
          lecciones: m.lecciones.map(l => l.id === lessonId ? { ...l, [field]: value } : l)
        };
      })
    }));
  }, []);

  const removeLesson = useCallback((moduleId, lessonId) => {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.map(m => {
        if (m.id !== moduleId) return m;
        if (m.lecciones.length <= 1) return m;
        return {
          ...m,
          lecciones: m.lecciones.filter(l => l.id !== lessonId)
        };
      })
    }));
  }, []);

  // Quiz Management
  const updateFinalQuiz = useCallback((quizData) => {
    setFormData(prev => ({
      ...prev,
      evaluacionFinal: quizData
    }));
  }, []);

  const updateModuleQuiz = useCallback((moduleId, quizData) => {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.map(m => m.id === moduleId ? { ...m, evaluacion: quizData } : m)
    }));
  }, []);

  const removeModuleQuiz = useCallback((moduleId) => {
    setFormData(prev => ({
      ...prev,
      modulos: prev.modulos.map(m => m.id === moduleId ? { ...m, evaluacion: null } : m)
    }));
  }, []);

  // Submit Handler
  const submitCourse = useCallback(async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        titulo: formData.titulo.trim(),
        resumen: formData.resumen.trim(),
        descripcion: formData.descripcion.trim(),
        category_id: Number(formData.category_id),
        nivel: formData.nivel,
        idioma: 'es',
        horas: Number(formData.horas) || 12,
        precio: Number(formData.precio),
        precio_promocional: Number(formData.precio_promocional),
        portada_path: formData.portada_path,
        evaluacionFinal: formData.evaluacionFinal,
        modulos: formData.modulos.map(m => ({
          titulo: m.titulo,
          evaluacion: m.evaluacion || null,
          lecciones: m.lecciones.map(l => ({
            titulo: l.titulo,
            contenido: l.contenido,
            video: l.video
          }))
        }))
      };

      if (isEditing && editingCourseId) {
        const result = await updateCourseUseCase.execute(editingCourseId, payload);
        setCreatedCourse(result.course || { ...payload, id: editingCourseId });
        setShowSuccessModal(true);

        if (onCourseUpdated) {
          onCourseUpdated(result);
        }
      } else {
        const result = await createCourseUseCase.execute(payload);
        setCreatedCourse(result);
        setShowSuccessModal(true);

        if (onCourseCreated) {
          onCourseCreated(result);
        }
      }
      if (formData.evaluacionFinal && Array.isArray(formData.evaluacionFinal.questions) && formData.evaluacionFinal.questions.length > 0) {
        try {
          const targetCourseId = editingCourseId || Date.now();
          QuizRepository.saveQuiz({
            id: formData.evaluacionFinal.id || `quiz_final_${targetCourseId}`,
            courseId: targetCourseId,
            courseTitle: formData.titulo,
            title: formData.evaluacionFinal.title || 'Examen Global de Certificación',
            description: 'Evaluación acreditada oficial de certificación',
            isFinal: true,
            passingScore: formData.evaluacionFinal.passingScore || 75,
            questions: formData.evaluacionFinal.questions,
          });
        } catch (quizErr) {}
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error al guardar el curso.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEditing, editingCourseId, onCourseCreated, onCourseUpdated]);

  const closeSuccessModal = useCallback(() => {
    const wasEditing = isEditing;
    const course = createdCourse;
    setShowSuccessModal(false);
    resetForm();
    if (onModalClosed) {
      onModalClosed({ course, wasEditing });
    }
  }, [resetForm, isEditing, createdCourse, onModalClosed]);

  return {
    formData,
    isSubmitting,
    errorMessage,
    createdCourse,
    showSuccessModal,
    isEditing,
    editingCourseId,
    isLoadingCourseDetails,
    updateField,
    fillDemoData,
    resetForm,
    cancelEdit,
    loadCourseForEdit,
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
  };
}

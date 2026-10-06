import { useState, useEffect, useCallback, useMemo } from 'react';
import { QuizRepository } from '../../data/repositories/QuizRepository';

export function useQuizzes() {
  const [quizzes, setQuizzes] = useState(() => {
    return QuizRepository.getQuizzes();
  });

  const [attempts, setAttempts] = useState(() => {
    return QuizRepository.getAttempts();
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourseId, setFilterCourseId] = useState('all');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'final' | 'module'

  const refresh = useCallback(() => {
    try {
      const q = QuizRepository.getQuizzes();
      const a = QuizRepository.getAttempts();
      setQuizzes(q);
      setAttempts(a);
    } catch (err) {
      console.error('Error al refrescar evaluaciones:', err);
      setError(err.message);
    }
  }, []);

  const saveQuiz = useCallback((quizData) => {
    try {
      setError(null);
      const saved = QuizRepository.saveQuiz(quizData);
      refresh();
      return saved;
    } catch (err) {
      console.error('Error al guardar evaluación:', err);
      setError(err.message);
      throw err;
    }
  }, [refresh]);

  const deleteQuiz = useCallback((quizId) => {
    try {
      setError(null);
      const ok = QuizRepository.deleteQuiz(quizId);
      if (ok) {
        refresh();
      }
      return ok;
    } catch (err) {
      console.error('Error al eliminar evaluación:', err);
      setError(err.message);
      throw err;
    }
  }, [refresh]);

  const startAttempt = useCallback((quizId) => {
    return QuizRepository.startAttempt(quizId);
  }, []);

  const submitAttempt = useCallback((payload) => {
    const result = QuizRepository.submitAttempt(payload);
    refresh();
    return result;
  }, [refresh]);

  const resetToDemo = useCallback(() => {
    QuizRepository.resetToDemo();
    refresh();
  }, [refresh]);

  // KPIs & Computed Stats
  const stats = useMemo(() => {
    const total = quizzes.length;
    const finalCount = quizzes.filter(q => Boolean(q.isFinal)).length;
    const moduleCount = total - finalCount;
    const totalAtt = attempts.length;
    const passedAtt = attempts.filter(a => Boolean(a.isPassed)).length;
    const passRate = totalAtt > 0 ? Math.round((passedAtt / totalAtt) * 100) : 0;

    return {
      totalQuizzes: total,
      finalQuizzesCount: finalCount,
      moduleQuizzesCount: moduleCount,
      totalAttempts: totalAtt,
      passedAttempts: passedAtt,
      passRate
    };
  }, [quizzes, attempts]);

  // Filtered List
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      // Filter by type
      if (filterType === 'final' && !q.isFinal) return false;
      if (filterType === 'module' && q.isFinal) return false;

      // Filter by course
      if (filterCourseId !== 'all' && String(q.courseId) !== String(filterCourseId)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = (q.title || '').toLowerCase().includes(query);
        const matchesCourse = (q.courseTitle || '').toLowerCase().includes(query);
        const matchesModule = (q.moduleTitle || '').toLowerCase().includes(query);
        const matchesDesc = (q.description || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesCourse && !matchesModule && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [quizzes, filterType, filterCourseId, searchQuery]);

  return {
    quizzes,
    attempts,
    filteredQuizzes,
    stats,
    loading,
    error,
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
    refresh
  };
}

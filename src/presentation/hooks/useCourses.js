import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetCoursesUseCase } from '../../application/usecases/GetCoursesUseCase';
import { DeleteCourseUseCase } from '../../application/usecases/DeleteCourseUseCase';
import { GetCourseSyllabusUseCase } from '../../application/usecases/GetCourseSyllabusUseCase';
import { CourseRepositoryImpl } from '../../data/repositories/CourseRepositoryImpl';

const courseRepository = new CourseRepositoryImpl();
const getCoursesUseCase = new GetCoursesUseCase(courseRepository);
const deleteCourseUseCase = new DeleteCourseUseCase(courseRepository);
const getCourseSyllabusUseCase = new GetCourseSyllabusUseCase(courseRepository);

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Syllabus Modal State
  const [selectedCourseForSyllabus, setSelectedCourseForSyllabus] = useState(null);
  const [syllabusData, setSyllabusData] = useState([]);
  const [isLoadingSyllabus, setIsLoadingSyllabus] = useState(false);
  const [syllabusError, setSyllabusError] = useState(null);

  const fetchCourses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const list = await getCoursesUseCase.execute();
      setCourses(list);
    } catch (err) {
      setError(err.message || 'Error al cargar cursos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const deleteCourse = useCallback(async (courseId) => {
    try {
      await deleteCourseUseCase.execute(courseId);
      setCourses(prev => prev.filter(c => c.id !== courseId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, []);

  const openSyllabusModal = useCallback(async (course) => {
    setSelectedCourseForSyllabus(course);
    setIsLoadingSyllabus(true);
    setSyllabusError(null);
    setSyllabusData([]);

    try {
      const data = await getCourseSyllabusUseCase.execute(course.id);
      setSyllabusData(data);
    } catch (err) {
      setSyllabusError(err.message || 'Error al cargar temario');
    } finally {
      setIsLoadingSyllabus(false);
    }
  }, []);

  const closeSyllabusModal = useCallback(() => {
    setSelectedCourseForSyllabus(null);
    setSyllabusData([]);
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchCat = selectedCategory === 'all' || 
        (course.categoryName && course.categoryName.toLowerCase().includes(selectedCategory.toLowerCase()));

      const query = searchQuery.trim().toLowerCase();
      const matchSearch = !query ||
        course.title.toLowerCase().includes(query) ||
        course.summary.toLowerCase().includes(query) ||
        course.instructorName.toLowerCase().includes(query);

      return matchCat && matchSearch;
    });
  }, [courses, selectedCategory, searchQuery]);

  return {
    courses,
    filteredCourses,
    totalCount: courses.length,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    fetchCourses,
    deleteCourse,
    // Syllabus Modal
    selectedCourseForSyllabus,
    syllabusData,
    isLoadingSyllabus,
    syllabusError,
    openSyllabusModal,
    closeSyllabusModal,
  };
}

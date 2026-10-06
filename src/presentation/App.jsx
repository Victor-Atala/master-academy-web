import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from './templates/DashboardLayout';
import { CreateCoursePage } from './pages/CreateCoursePage';
import { CatalogPage } from './pages/CatalogPage';
import { AnalyticsDashboardPage } from './pages/AnalyticsDashboardPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { StudentsPage } from './pages/StudentsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { CouponsPage } from './pages/CouponsPage';
import { ProfilePage } from './pages/ProfilePage';
import { QuizzesPage } from './pages/QuizzesPage';
import { ExecutiveDirectorsPage } from './pages/ExecutiveDirectorsPage';
import { AuthPage } from './pages/AuthPage';

import { useAuth } from './hooks/useAuth';
import { useCategories } from './hooks/useCategories';
import { useCourses } from './hooks/useCourses';
import { useCourseForm, scrollToPageTop } from './hooks/useCourseForm';
import { useTeacherPlatform } from './hooks/useTeacherPlatform';
import { useQuizzes } from './hooks/useQuizzes';
import { useDirectorSuite } from './hooks/useDirectorSuite';
import { useTheme } from './hooks/useTheme';
import {
  isDirector,
  DIRECTOR_VIEWS,
  INSTRUCTOR_VIEWS,
} from '../core/utils/roleUtils';

const STORAGE_KEY = 'master_academy_admin_active_view';

function getInitialView(user) {
  const isDir = isDirector(user);
  const allowedViews = isDir ? DIRECTOR_VIEWS : INSTRUCTOR_VIEWS;
  const fallback = isDir ? 'executive' : 'analytics';

  // 1. Prioritize URL hash
  try {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (rawHash && allowedViews.includes(rawHash)) {
      return rawHash;
    }
  } catch (e) {}

  // 2. Fallback to localStorage saved view
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && allowedViews.includes(saved)) {
      return saved;
    }
  } catch (e) {}

  return fallback;
}

export function App() {
  // Authentication & Session state
  const auth = useAuth();
  const isDirectorUser = isDirector(auth.user);

  const [activeView, setActiveView] = useState(() => getInitialView(auth.user));

  const handleViewChange = useCallback(
    (newView) => {
      const isDir = isDirector(auth.user);
      const allowedViews = isDir ? DIRECTOR_VIEWS : INSTRUCTOR_VIEWS;

      // Strict role isolation: reject cross-role navigation attempts
      if (!allowedViews.includes(newView)) {
        console.warn(`[RoleSegregation] Vista "${newView}" denegada para el rol actual.`);
        return;
      }

      setActiveView(newView);
      scrollToPageTop('smooth');
      try {
        localStorage.setItem(STORAGE_KEY, newView);
      } catch (e) {}

      const targetHash = '#' + newView;
      if (window.location.hash !== targetHash) {
        window.history.replaceState(null, '', targetHash);
      }
    },
    [auth.user]
  );

  // Strict role-view synchronization and URL hash guard
  useEffect(() => {
    if (!auth.user) return;
    const isDir = isDirector(auth.user);
    const allowedViews = isDir ? DIRECTOR_VIEWS : INSTRUCTOR_VIEWS;
    const fallbackView = isDir ? 'executive' : 'analytics';

    if (!allowedViews.includes(activeView)) {
      setActiveView(fallbackView);
      try {
        localStorage.setItem(STORAGE_KEY, fallbackView);
      } catch (e) {}
      window.history.replaceState(null, '', '#' + fallbackView);
    }
  }, [auth.user, isDirectorUser, activeView]);

  // Listen to browser Back/Forward navigation
  useEffect(() => {
    const onHashChange = () => {
      const isDir = isDirector(auth.user);
      const allowedViews = isDir ? DIRECTOR_VIEWS : INSTRUCTOR_VIEWS;
      const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
      if (rawHash && allowedViews.includes(rawHash)) {
        setActiveView(rawHash);
        try {
          localStorage.setItem(STORAGE_KEY, rawHash);
        } catch (e) {}
      }
    };

    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, [auth.user]);

  // Dark / Light Theme hook
  const { theme, toggleTheme } = useTheme();

  // Business hooks
  const [highlightedCourseId, setHighlightedCourseId] = useState(null);
  const { categories } = useCategories();
  const coursesState = useCourses();
  const quizzesState = useQuizzes();
  const formState = useCourseForm({
    onCourseCreated: (result) => {
      coursesState.fetchCourses();
      quizzesState.refresh();
      if (result && result.id) {
        setHighlightedCourseId(result.id);
      }
    },
    onCourseUpdated: (result) => {
      coursesState.fetchCourses();
      quizzesState.refresh();
      const courseId = result?.course?.id || result?.id;
      if (courseId) {
        setHighlightedCourseId(courseId);
      }
    },
    onModalClosed: ({ course, wasEditing }) => {
      handleViewChange('catalog');
      scrollToPageTop('smooth');
      if (course && course.id) {
        setHighlightedCourseId(course.id);
        setTimeout(() => setHighlightedCourseId(null), 8000);
      }
    },
  });

  // Role-specific platform hooks
  const teacherPlatform = useTeacherPlatform();
  const directorSuite = useDirectorSuite();

  const handleEditCourse = (course) => {
    formState.loadCourseForEdit(course);
    handleViewChange('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is not authenticated, render the dual-portal Auth page
  if (!auth.isAuthenticated) {
    return (
      <AuthPage
        onLogin={auth.login}
        onRegister={auth.register}
        isLoading={auth.isLoading}
        error={auth.error}
      />
    );
  }

  return (
    <DashboardLayout
      activeView={activeView}
      onTabChange={handleViewChange}
      coursesCount={isDirectorUser ? 0 : coursesState.totalCount}
      quizzesCount={isDirectorUser ? 0 : quizzesState.stats.totalQuizzes}
      pendingInquiriesCount={isDirectorUser ? 0 : teacherPlatform.pendingInquiriesCount}
      pendingCourseRequestsCount={isDirectorUser ? (directorSuite.pendingRequestsCount || 0) : 0}
      pendingSettlementsCount={isDirectorUser ? (directorSuite.pendingSettlementsCount || 0) : 0}
      onFillDemo={formState.fillDemoData}
      theme={theme}
      toggleTheme={toggleTheme}
      user={auth.user}
      onLogout={auth.logout}
      onSwitchRole={auth.switchRole}
    >
      {/* ========================================================================= */}
      {/* VISTAS EXCLUSIVAS PARA ALTA DIRECCIÓN (NINGUNA VISTA DOCENTE EN RENDER)     */}
      {/* ========================================================================= */}
      {isDirectorUser ? (
        <ExecutiveDirectorsPage
          directorSuite={directorSuite}
          activeSection={activeView}
          onTabChange={handleViewChange}
          user={auth.user}
        />
      ) : (
        /* ======================================================================= */
        /* VISTAS EXCLUSIVAS PARA INSTRUCTORES (NINGUNA VISTA DIRECTIVA EN RENDER)  */
        /* ======================================================================= */
        <>
          {activeView === 'analytics' && (
            <AnalyticsDashboardPage
              stats={teacherPlatform.stats}
              recentOrders={teacherPlatform.recentOrders}
              pendingInquiriesCount={teacherPlatform.pendingInquiriesCount}
              onNavigate={handleViewChange}
            />
          )}

          {activeView === 'profile' && (
            <ProfilePage
              user={auth.user}
              onUpdateProfile={auth.updateProfile}
              onLogout={auth.logout}
              isLoading={auth.isLoading}
              successMessage={auth.successMessage}
              error={auth.error}
            />
          )}

          {activeView === 'create' && (
            <CreateCoursePage
              formState={formState}
              categories={categories}
            />
          )}

          {(activeView === 'catalog' || activeView === 'exams') && (
            <CatalogPage
              coursesState={coursesState}
              categories={categories}
              onEditCourse={handleEditCourse}
              quizzesState={quizzesState}
              formState={formState}
              initialTab={activeView === 'exams' ? 'exams' : 'courses'}
              onSubTabChange={handleViewChange}
              highlightedCourseId={highlightedCourseId}
            />
          )}

          {activeView === 'inquiries' && (
            <InquiriesPage
              inquiries={teacherPlatform.inquiries}
              onReplyInquiry={teacherPlatform.answerInquiry}
            />
          )}

          {activeView === 'students' && (
            <StudentsPage
              enrollments={teacherPlatform.enrollments}
            />
          )}

          {activeView === 'certificates' && (
            <CertificatesPage
              certificates={teacherPlatform.certificates}
              onRevokeCertificate={teacherPlatform.revokeCertificate}
              onIssueCertificate={teacherPlatform.issueCertificate}
              enrollments={teacherPlatform.enrollments}
              courses={coursesState.courses}
            />
          )}

          {activeView === 'reviews' && (
            <ReviewsPage
              reviews={teacherPlatform.reviews}
            />
          )}

          {activeView === 'coupons' && (
            <CouponsPage
              coupons={teacherPlatform.coupons}
              onCreateCoupon={teacherPlatform.createCoupon}
              onDeleteCoupon={teacherPlatform.deleteCoupon}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}

export default App;

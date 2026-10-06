import React, { useState } from 'react';
import { Sidebar } from '../components/organisms/Sidebar';
import { AppHeader } from '../components/organisms/AppHeader';
import { QuizResetNoticeModal } from '../components/organisms/QuizResetNoticeModal';

export function DashboardLayout({
  activeView,
  onTabChange,
  coursesCount = 0,
  quizzesCount = 0,
  pendingInquiriesCount = 0,
  pendingCourseRequestsCount = 0,
  pendingSettlementsCount = 0,
  onFillDemo,
  theme,
  toggleTheme,
  user,
  onLogout,
  onSwitchRole,
  children,
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className={`admin-root-layout ${isSidebarCollapsed ? 'sidebar-is-collapsed' : ''}`}>
      <QuizResetNoticeModal />

      {/* Fixed/Sticky Left Sidebar */}
      <Sidebar
        activeView={activeView}
        onTabChange={onTabChange}
        coursesCount={coursesCount}
        quizzesCount={quizzesCount}
        pendingInquiriesCount={pendingInquiriesCount}
        pendingCourseRequestsCount={pendingCourseRequestsCount}
        pendingSettlementsCount={pendingSettlementsCount}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onSwitchRole={onSwitchRole}
        isCollapsed={isSidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      {/* Main Viewport */}
      <div className="admin-main-viewport">
        <AppHeader
          activeView={activeView}
          onFillDemo={onFillDemo}
          theme={theme}
          toggleTheme={toggleTheme}
          user={user}
          onNavigate={onTabChange}
          onLogout={onLogout}
          onSwitchRole={onSwitchRole}
          onToggleSidebar={toggleSidebar}
        />
        <main className="admin-main-container">
          <div key={activeView} className="maximalist-section-enter">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

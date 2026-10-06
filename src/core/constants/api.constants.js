export const API_BASE_URL = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:8000/api/v1'
    : typeof window !== 'undefined' 
      ? `http://${window.location.hostname}:8000/api/v1`
      : 'http://127.0.0.1:8000/api/v1';

export const API_ENDPOINTS = {
  // Courses & Catalog
  CATEGORIES: '/categories',
  COURSES: '/courses',
  ADMIN_COURSE_CREATE: '/admin/courses/create-full',
  ADMIN_COURSE_DELETE: (id) => `/admin/courses/${id}`,
  ADMIN_COURSE_UPDATE: (id) => `/admin/courses/${id}/update-full`,
  COURSE_SYLLABUS: (id) => `/courses/${id}/syllabi`,

  // Authentication & Profile (Existing in Laravel API)
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_ME: '/auth/me',
  ME: '/me',
  AUTH_PROFILE: '/auth/profile',
  AUTH_PASSWORD: '/auth/password',
  AUTH_LOGOUT: '/auth/logout',
  TEACHING_COURSES: '/me/courses/teaching',
  // Certificates (Cryptographic folios & QR verification)
  CERTIFICATES: '/certificates',
  CERTIFICATE_DETAIL: (id) => `/certificates/${id}`,
  CERTIFICATE_REVOKE: (id) => `/certificates/${id}/revoke`,
  CERTIFICATE_VERIFY: (uuid) => `/certificates/verify/${uuid}`,

  // Executive Director Suite (Real Backend Persistence)
  EXECUTIVE_METRICS: '/admin/executive/metrics',
  ADMIN_INSTRUCTORS: '/admin/instructors',
  ADMIN_INSTRUCTOR_PERMISSIONS: (id) => `/admin/instructors/${id}/permissions`,
  ADMIN_INSTRUCTOR_BANK_INFO: (id) => `/admin/instructors/${id}/bank-info`,
  ADMIN_SETTLEMENTS_HISTORY: '/admin/settlements/history',
  ADMIN_SETTLEMENTS_DISBURSE: '/admin/settlements/disburse',
  ADMIN_COURSE_REQUESTS: '/admin/course-requests',
  ADMIN_COURSE_REQUEST_APPROVE: (id) => `/admin/course-requests/${id}/approve`,
  ADMIN_COURSE_REQUEST_REJECT: (id) => `/admin/course-requests/${id}/reject`,

  // Instructor Financial Info (Card / CLABE / No aplica)
  INSTRUCTOR_FINANCIAL_INFO: '/instructor/financial-info',
};
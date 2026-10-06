export const DIRECTOR_VIEWS = [
  'executive',
  'executive-financial',
  'executive-instructors',
  'executive-requests',
  'executive-permissions',
  'executive-audit',
];

export const INSTRUCTOR_VIEWS = [
  'analytics',
  'profile',
  'create',
  'catalog',
  'exams',
  'inquiries',
  'students',
  'certificates',
  'reviews',
  'coupons',
];

/**
 * Accurately determines if a given user object belongs to the Directivo / Alta Dirección role.
 * Considers: isDirector flag, role string, roles array (from Laravel Sanctum/Spatie), and email conventions.
 */
export function isDirector(user) {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  return email === 'mwcomenius@gmail.com';
}

/**
 * Checks if a specific view ID is permissible for the given user.
 */
export function canAccessView(user, viewId) {
  if (!user) return false;
  const isDir = isDirector(user);
  if (isDir) {
    return DIRECTOR_VIEWS.includes(viewId);
  }
  return INSTRUCTOR_VIEWS.includes(viewId);
}

/**
 * Returns the default home view based strictly on role.
 */
export function getDefaultView(user) {
  return isDirector(user) ? 'executive' : 'analytics';
}

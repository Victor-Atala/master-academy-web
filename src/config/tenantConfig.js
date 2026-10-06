/**
 * CONFIGURACIÓN CENTRALIZADA DE MARCA BLANCA Y PARÁMETROS SAAS (TENANT CONFIG)
 * Permite adaptar fácilmente la aplicación para cualquier empresa/institución consumidora.
 */

export const TENANT_CONFIG = {
  // Identidad Corporativa
  companyName: 'Master Academy',
  companyTagline: 'Instructor Studio & Executive Suite',
  supportEmail: 'soporte@masteracademy.com',
  defaultCurrency: 'MXN',

  // Parámetros de Cursos y Almacenamiento
  maxCourseStorageMB: 500,
  recommendedCoverDimensions: '1280x720px (16:9)',
  maxCoverSizeMB: 5,

  // Categorías predeterminadas por defecto en la plataforma
  defaultCategories: [
    'Tecnologías e Información',
    'Gestión Financiera y Negocios',
    'Salud y Prevención',
    'Seguridad Industrial (STPS)',
    'Desarrollo Humano y Liderazgo',
  ],

  // Permisos por Rol
  permissions: {
    canUploadAvatar: {
      instructor: true,
      student: false,
      director: false,
    },
    canDirectUploadFiles: true,
  },
};

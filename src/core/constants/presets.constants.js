export const COVER_PRESETS = [
  { label: 'Tecnología', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600' },
  { label: 'Seguridad', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600' },
  { label: 'Industrial', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600' },
  { label: 'Negocios', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600' },
  { label: 'Salud', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600' },
];

export const DEMO_COURSE_DATA = {
  titulo: 'Especialidad en Ciberseguridad Defensiva y Análisis Forense',
  resumen: 'Aprende a proteger infraestructuras críticas, auditar vectores de vulnerabilidad y responder a incidentes en tiempo real.',
  descripcion: 'Este programa intensivo prepara al estudiante para diseñar sistemas de detección de intrusos (IDS/IPS), implementar protocolos de hardening corporativo y gestionar respuesta ante brechas cibernéticas de nivel avanzado.',
  portada_path: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600',
  category_id: 1,
  nivel: 'Avanzado',
  horas: 32,
  precio: 750,
  precio_promocional: 499,
  idioma: 'Español',
  modulos: [
    {
      id: 'demo-mod-1',
      titulo: 'Módulo 1: Fundamentos de Seguridad Ofensiva y Defensiva',
      lecciones: [
        {
          id: 'demo-les-1',
          titulo: 'Lección 1: Panorama de Amenazas Globales y MITRE ATT&CK',
          contenido: 'Introducción al ecosistema de ciberdefensa corporativa.',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        },
        {
          id: 'demo-les-2',
          titulo: 'Lección 2: Arquitectura Zero Trust y Políticas de Acceso',
          contenido: 'Implementación de principios mínimos privilegios y autenticación.',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
        }
      ]
    },
    {
      id: 'demo-mod-2',
      titulo: 'Módulo 2: Monitoreo SIEM y Análisis Forense Digital',
      lecciones: [
        {
          id: 'demo-les-3',
          titulo: 'Lección 1: Correlación de Eventos en Tiempo Real',
          contenido: 'Configuración de pipelines de ingestión de logs y telemetría.',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        },
        {
          id: 'demo-les-4',
          titulo: 'Lección 2: Extracción y Custodia de Evidencia Forense',
          contenido: 'Protocolos de cadena de custodia y análisis forense de memoria.',
          video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
        }
      ]
    }
  ],
  evaluacionFinal: {
    title: 'Evaluación Final de Certificación: Ciberseguridad y Análisis Forense',
    passingScore: 75,
    questions: [
      {
        id: 'demo_q_1',
        text: '¿Cuál es el principio medular del modelo de seguridad Zero Trust?',
        weightPoints: 50,
        options: [
          { id: 'demo_opt_1', text: 'Nunca confiar, verificar siempre cualquier intento de acceso, interno o externo.', isCorrect: true },
          { id: 'demo_opt_2', text: 'Confiar en todo el tráfico que proviene de la red local o VPN corporativa.', isCorrect: false },
          { id: 'demo_opt_3', text: 'Desactivar los firewalls perimetrales para agilizar la conectividad.', isCorrect: false },
          { id: 'demo_opt_4', text: 'Permitir acceso ilimitado a usuarios administradores sin doble factor.', isCorrect: false }
        ]
      },
      {
        id: 'demo_q_2',
        text: 'En un análisis forense digital, ¿qué garantiza la integridad de una imagen de disco extraída?',
        weightPoints: 50,
        options: [
          { id: 'demo_opt_5', text: 'El cálculo y coincidencia de hashes criptográficos (como SHA-256 o MD5).', isCorrect: true },
          { id: 'demo_opt_6', text: 'Modificar la fecha de creación del archivo en el sistema operativo.', isCorrect: false },
          { id: 'demo_opt_7', text: 'Comprimir el archivo con contraseña en formato ZIP.', isCorrect: false },
          { id: 'demo_opt_8', text: 'Ejecutar el disco duro en una máquina física sin bloqueador de escritura.', isCorrect: false }
        ]
      }
    ]
  }
};

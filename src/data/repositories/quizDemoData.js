export const INITIAL_DEMO_QUIZZES = [
  // --- CURSO 1: Desarrollo Web Fullstack & Ciberseguridad ---
  {
    id: 'quiz_c1_m1',
    courseId: 1,
    courseTitle: 'Desarrollo Web Fullstack & Ciberseguridad',
    moduleId: 1,
    moduleTitle: 'Módulo 1: Arquitectura y Seguridad en APIs',
    title: 'Evaluación de Módulo 1: Arquitectura y Seguridad en APIs',
    description: 'Evaluación formativa para validar diseño seguro, autenticación JWT y control de acceso RBAC.',
    isFinal: false,
    attemptsAllowed: null, // Reintentos ilimitados
    unlimitedRetries: true,
    passingScore: 70,
    questions: [
      {
        id: 'q_c1_m1_1',
        text: '¿Cuál es el beneficio de emplear tokens JWT con tiempo de expiración corto y Refresh Tokens?',
        weightPoints: 50,
        options: [
          { id: 'opt_1', text: 'Minimizar la ventana de vulnerabilidad si un access token es interceptado.', isCorrect: true },
          { id: 'opt_2', text: 'Reducir el tamaño de las peticiones HTTP en cada llamada.', isCorrect: false },
          { id: 'opt_3', text: 'Evitar tener que validar firmas criptográficas en el backend.', isCorrect: false },
          { id: 'opt_4', text: 'Permitir que la base de datos almacene las contraseñas en texto plano.', isCorrect: false }
        ]
      },
      {
        id: 'q_c1_m1_2',
        text: 'En el modelo Zero Trust aplicado a microservicios web, ¿cuál es el principio rector?',
        weightPoints: 50,
        options: [
          { id: 'opt_5', text: 'Nunca confiar, siempre verificar la identidad y permisos en cada capa.', isCorrect: true },
          { id: 'opt_6', text: 'Confiar en todo el tráfico que provenga de la red interna de la empresa.', isCorrect: false },
          { id: 'opt_7', text: 'Desactivar CORS para permitir peticiones desde cualquier origen.', isCorrect: false },
          { id: 'opt_8', text: 'Eliminar los certificados SSL/TLS dentro de contenedores Docker.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz_c1_m2',
    courseId: 1,
    courseTitle: 'Desarrollo Web Fullstack & Ciberseguridad',
    moduleId: 2,
    moduleTitle: 'Módulo 2: Bases de Datos y Cifrado',
    title: 'Evaluación de Módulo 2: Bases de Datos y Cifrado',
    description: 'Evaluación formativa de consistencia transaccional ACID y criptografía moderna AES-256 en reposo.',
    isFinal: false,
    attemptsAllowed: null, // Reintentos ilimitados
    unlimitedRetries: true,
    passingScore: 70,
    questions: [
      {
        id: 'q_c1_m2_1',
        text: '¿Qué propiedad de las transacciones ACID garantiza que los cambios persistan aun ante una caída del sistema?',
        weightPoints: 50,
        options: [
          { id: 'opt_m2_1', text: 'Durabilidad (Durability).', isCorrect: true },
          { id: 'opt_m2_2', text: 'Atomicidad (Atomicity).', isCorrect: false },
          { id: 'opt_m2_3', text: 'Aislamiento (Isolation).', isCorrect: false },
          { id: 'opt_m2_4', text: 'Consistencia (Consistency).', isCorrect: false }
        ]
      },
      {
        id: 'q_c1_m2_2',
        text: '¿Cuál algoritmo de cifrado simétrico es el estándar recomendado para datos en reposo?',
        weightPoints: 50,
        options: [
          { id: 'opt_m2_5', text: 'AES-256 con modo GCM o CBC seguro.', isCorrect: true },
          { id: 'opt_m2_6', text: 'DES de 56 bits.', isCorrect: false },
          { id: 'opt_m2_7', text: 'MD5 con sal pública.', isCorrect: false },
          { id: 'opt_m2_8', text: 'Base64 sin clave criptográfica.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz_final_c1',
    courseId: 1,
    courseTitle: 'Desarrollo Web Fullstack & Ciberseguridad',
    moduleId: null,
    moduleTitle: 'Módulo Final: Examen de Certificación Global',
    title: 'Evaluación Final de Certificación: Desarrollo Web Fullstack & Ciberseguridad',
    description: 'Examen de Certificación Oficial (Límite estricto: 5 intentos). Si repruebas los 5 intentos, el curso se reiniciará a 0% y deberás volver a adquirirlo.',
    isFinal: true,
    attemptsAllowed: 5,
    unlimitedRetries: false,
    passingScore: 75,
    questions: [
      {
        id: 'q_f1_1',
        text: '¿Cómo se previene un ataque de Inyección SQL (SQLi) en aplicaciones web modernas?',
        weightPoints: 25,
        options: [
          { id: 'opt_f1_1', text: 'Utilizando Sentencias Preparadas (Prepared Statements) y ORMs seguros.', isCorrect: true },
          { id: 'opt_f1_2', text: 'Concatenando las cadenas de entrada directamente en la consulta.', isCorrect: false },
          { id: 'opt_f1_3', text: 'Aumentando el tiempo de respuesta del servidor de base de datos.', isCorrect: false },
          { id: 'opt_f1_4', text: 'Ocultando el nombre de las tablas mediante comentarios SQL.', isCorrect: false }
        ]
      },
      {
        id: 'q_f1_2',
        text: '¿Qué cabecera de seguridad HTTP protege contra ataques de clickjacking en iframes?',
        weightPoints: 25,
        options: [
          { id: 'opt_f1_5', text: 'X-Frame-Options (o Content-Security-Policy con frame-ancestors).', isCorrect: true },
          { id: 'opt_f1_6', text: 'Access-Control-Allow-Origin: *', isCorrect: false },
          { id: 'opt_f1_7', text: 'Strict-Transport-Security desactivado.', isCorrect: false },
          { id: 'opt_f1_8', text: 'X-Powered-By: PHP/8.2', isCorrect: false }
        ]
      },
      {
        id: 'q_f1_3',
        text: '¿Cuál es la función del flag HttpOnly en las cookies de sesión?',
        weightPoints: 25,
        options: [
          { id: 'opt_f1_9', text: 'Impedir que scripts JavaScript del cliente (XSS) lean la cookie.', isCorrect: true },
          { id: 'opt_f1_10', text: 'Permitir que la cookie sea leída por aplicaciones externas vía iframe.', isCorrect: false },
          { id: 'opt_f1_11', text: 'Hacer que la cookie sea visible en la consola de depuración únicamente.', isCorrect: false },
          { id: 'opt_f1_12', text: 'Enviar la cookie únicamente por conexiones HTTP no cifradas.', isCorrect: false }
        ]
      },
      {
        id: 'q_f1_4',
        text: 'En una arquitectura Fullstack moderna, ¿cuál capa es la responsable de aplicar las reglas de negocio críticas?',
        weightPoints: 25,
        options: [
          { id: 'opt_f1_13', text: 'El Backend (Domain / Application Layer).', isCorrect: true },
          { id: 'opt_f1_14', text: 'El Frontend exclusivamente mediante validaciones de formulario en React.', isCorrect: false },
          { id: 'opt_f1_15', text: 'El servidor DNS que resuelve el dominio.', isCorrect: false },
          { id: 'opt_f1_16', text: 'El cliente móvil mediante almacenamiento local SQLite.', isCorrect: false }
        ]
      }
    ]
  },

  // --- CURSO 2: Cloud Solutions Architect con AWS & Kubernetes ---
  {
    id: 'quiz_c2_m1',
    courseId: 2,
    courseTitle: 'Cloud Solutions Architect con AWS & Kubernetes',
    moduleId: 1,
    moduleTitle: 'Módulo 1: Fundamentos Cloud & IAM',
    title: 'Evaluación de Módulo: IAM y Redes VPC en AWS',
    description: 'Evaluación formativa de configuración de subredes públicas/privadas, NAT Gateway y políticas IAM.',
    isFinal: false,
    attemptsAllowed: null, // Reintentos ilimitados
    unlimitedRetries: true,
    passingScore: 70,
    questions: [
      {
        id: 'q_c2_m1_1',
        text: '¿Qué componente permite a instancias en una subred privada acceder a Internet para descargar actualizaciones?',
        weightPoints: 50,
        options: [
          { id: 'opt_c2_1', text: 'Un NAT Gateway desplegado en una subred pública.', isCorrect: true },
          { id: 'opt_c2_2', text: 'Un Internet Gateway asociado directamente a la subred privada.', isCorrect: false },
          { id: 'opt_c2_3', text: 'Una ruta a 127.0.0.1.', isCorrect: false },
          { id: 'opt_c2_4', text: 'Desactivar la tabla de ruteo VPC.', isCorrect: false }
        ]
      },
      {
        id: 'q_c2_m1_2',
        text: '¿Cuál es la mejor práctica de seguridad para asignar permisos temporales a pods en Amazon EKS?',
        weightPoints: 50,
        options: [
          { id: 'opt_c2_5', text: 'IAM Roles for Service Accounts (IRSA).', isCorrect: true },
          { id: 'opt_c2_6', text: 'Incrustar AWS Access Keys en el manifiesto YAML del pod.', isCorrect: false },
          { id: 'opt_c2_7', text: 'Otorgar permisos AdministratorAccess a todos los nodos.', isCorrect: false },
          { id: 'opt_c2_8', text: 'Desactivar RBAC dentro del clúster.', isCorrect: false }
        ]
      }
    ]
  },
  {
    id: 'quiz_final_c2',
    courseId: 2,
    courseTitle: 'Cloud Solutions Architect con AWS & Kubernetes',
    moduleId: null,
    moduleTitle: 'Módulo Final: Certificación AWS Cloud Solutions',
    title: 'Evaluación Final de Certificación: Cloud Solutions Architect',
    description: 'Examen de Certificación Oficial AWS & Kubernetes (Máximo 5 intentos). Si repruebas los 5 intentos, el curso se reiniciará.',
    isFinal: true,
    attemptsAllowed: 5,
    unlimitedRetries: false,
    passingScore: 80,
    questions: [
      {
        id: 'q_f2_1',
        text: '¿Qué patrón arquitectónico garantiza tolerancia a fallos multi-región activa-activa?',
        weightPoints: 50,
        options: [
          { id: 'opt_f2_1', text: 'Route 53 con enrutamiento por latencia/geolocalización y DynamoDB Global Tables.', isCorrect: true },
          { id: 'opt_f2_2', text: 'Un único balanceador ALB en us-east-1.', isCorrect: false },
          { id: 'opt_f2_3', text: 'Respaldos semanales en cintas magnéticas.', isCorrect: false },
          { id: 'opt_f2_4', text: 'Servidores bare metal sin replicación.', isCorrect: false }
        ]
      },
      {
        id: 'q_f2_2',
        text: '¿Qué recurso de Kubernetes se encarga de gestionar el escalado horizontal automático de réplicas de pods?',
        weightPoints: 50,
        options: [
          { id: 'opt_f2_5', text: 'Horizontal Pod Autoscaler (HPA) basado en métricas de CPU/memoria.', isCorrect: true },
          { id: 'opt_f2_6', text: 'ConfigMap estático.', isCorrect: false },
          { id: 'opt_f2_7', text: 'ClusterIP Service.', isCorrect: false },
          { id: 'opt_f2_8', text: 'DaemonSet sin límites.', isCorrect: false }
        ]
      }
    ]
  }
];

export const INITIAL_DEMO_ATTEMPTS = [
  {
    id: 'att_demo_1',
    quizId: 'quiz_final_c1',
    studentId: 'usr_101',
    studentName: 'Sofía Valenzuela',
    courseId: 1,
    attemptNumber: 1,
    attemptsAllowed: 5,
    remainingAttempts: 4,
    score: 100,
    isPassed: true,
    isFinal: true,
    isAptoParaCertificado: true,
    courseReset: false,
    requiresRepurchase: false,
    completedAt: '2026-09-18T16:00:00Z',
    message: '¡Excelente! Has alcanzado la nota requerida (100% / mín. 75%). El estudiante es APTO PARA CERTIFICACIÓN OFICIAL (Intento 1 de 5).'
  },
  {
    id: 'att_demo_2',
    quizId: 'quiz_final_c1',
    studentId: 'usr_102',
    studentName: 'Alejandro Morales',
    courseId: 1,
    attemptNumber: 2,
    attemptsAllowed: 5,
    remainingAttempts: 3,
    score: 50,
    isPassed: false,
    isFinal: true,
    isAptoParaCertificado: false,
    courseReset: false,
    requiresRepurchase: false,
    completedAt: '2026-09-21T11:20:00Z',
    message: 'No alcanzaste el mínimo requerido (50% / mín. 75%). Intento 2 de 5 utilizado. Te quedan 3 intento(s) antes de que el curso sea reiniciado.'
  },
  {
    id: 'att_demo_3',
    quizId: 'quiz_final_c1',
    studentId: 'usr_103',
    studentName: 'Carlos Mendizábal',
    courseId: 1,
    attemptNumber: 5,
    attemptsAllowed: 5,
    remainingAttempts: 0,
    score: 40,
    isPassed: false,
    isFinal: true,
    isAptoParaCertificado: false,
    courseReset: true,
    requiresRepurchase: true,
    completedAt: '2026-09-23T14:15:00Z',
    message: '¡ATENCIÓN! Has agotado tus 5 intentos permitidos para el Examen de Certificación con 40%. El curso ha sido reiniciado a 0% de progreso y la matrícula ha quedado bloqueada. Deberás volver a adquirir el curso para tener una nueva oportunidad.'
  },
  {
    id: 'att_demo_4',
    quizId: 'quiz_c1_m1',
    studentId: 'usr_104',
    studentName: 'Mariana Garza',
    courseId: 1,
    attemptNumber: 3,
    attemptsAllowed: null, // ilimitados
    remainingAttempts: null,
    score: 100,
    isPassed: true,
    isFinal: false,
    isAptoParaCertificado: false,
    courseReset: false,
    requiresRepurchase: false,
    completedAt: '2026-09-22T09:45:00Z',
    message: '¡Muy bien! Has superado la evaluación formativa de este módulo con 100%. (Reintentos ilimitados formativos).'
  }
];

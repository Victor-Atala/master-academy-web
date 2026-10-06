import { Inquiry } from '../../domain/models/Inquiry';
import { StudentEnrollment } from '../../domain/models/StudentEnrollment';
import { Certificate } from '../../domain/models/Certificate';
import { Review } from '../../domain/models/Review';
import { Coupon } from '../../domain/models/Coupon';

export const INITIAL_INQUIRIES = [
  new Inquiry({
    id: 'inq_1',
    studentName: 'Carlos Mendoza',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120',
    courseId: 1,
    courseTitle: 'Flutter & Dart: De Cero a Experto',
    lessonTitle: 'Clase 04: Stateful vs Stateless Widgets',
    subject: '¿Cuándo usar ValueNotifier en lugar de StatefulWidget?',
    message: 'Hola profe, tengo una duda sobre la optimización de renders. ¿En qué escenarios es más conveniente usar ValueListenableBuilder o pasar directo a Riverpod en la lección 4?',
    status: 'pending',
    createdAt: '2026-09-21T14:30:00Z'
  }),
  new Inquiry({
    id: 'inq_2',
    studentName: 'Mariana Silva',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
    courseId: 2,
    courseTitle: 'Arquitectura Limpia en Aplicaciones Móviles',
    lessonTitle: 'Clase 02: Inversión de Dependencias en Dart',
    subject: 'Error al registrar el Singleton en GetIt',
    message: 'Al registrar el servicio de autenticación me salta un error de tipos circulares. Ya verifiqué el abstract class del repository.',
    status: 'answered',
    reply: 'Hola Mariana, asegúrate de registrar primero la implementación de AuthRemoteDataSource antes del AuthRepositoryImpl en tu service_locator.dart.',
    createdAt: '2026-09-20T10:15:00Z'
  }),
  new Inquiry({
    id: 'inq_3',
    studentName: 'Esteban Quispe',
    studentAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120',
    courseId: 1,
    courseTitle: 'Flutter & Dart: De Cero a Experto',
    lessonTitle: 'Clase 08: Animaciones Implícitas',
    subject: 'Compatibilidad con Flutter 3.24',
    message: '¿El AnimatedContainer funciona igual en dispositivos iOS antiguos con la versión actual de la app móvil?',
    status: 'pending',
    createdAt: '2026-09-22T08:00:00Z'
  })
];

export const INITIAL_ENROLLMENTS = [
  new StudentEnrollment({
    id: 'enr_1',
    studentId: 'usr_101',
    studentName: 'Sofía Valenzuela',
    email: 'sofia.valenzuela@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    courseId: 1,
    courseTitle: 'Flutter & Dart: De Cero a Experto',
    progressPercentage: 100,
    completedLessons: 24,
    totalLessons: 24,
    enrolledAt: '2026-08-15',
    lastActiveAt: 'Ayer'
  }),
  new StudentEnrollment({
    id: 'enr_2',
    studentId: 'usr_102',
    studentName: 'Alejandro Morales',
    email: 'morales.dev@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    courseId: 1,
    courseTitle: 'Flutter & Dart: De Cero a Experto',
    progressPercentage: 75,
    completedLessons: 18,
    totalLessons: 24,
    enrolledAt: '2026-08-20',
    lastActiveAt: 'Hace 2 horas'
  }),
  new StudentEnrollment({
    id: 'enr_3',
    studentId: 'usr_103',
    studentName: 'Valeria Rivas',
    email: 'valeria.rivas@tech.io',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
    courseId: 2,
    courseTitle: 'Arquitectura Limpia en Aplicaciones Móviles',
    progressPercentage: 42,
    completedLessons: 8,
    totalLessons: 19,
    enrolledAt: '2026-09-02',
    lastActiveAt: 'Hoy'
  }),
  new StudentEnrollment({
    id: 'enr_4',
    studentId: 'usr_104',
    studentName: 'Diego Fernández',
    email: 'diego.f@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120',
    courseId: 2,
    courseTitle: 'Arquitectura Limpia en Aplicaciones Móviles',
    progressPercentage: 15,
    completedLessons: 3,
    totalLessons: 19,
    enrolledAt: '2026-09-12',
    lastActiveAt: 'Hace 3 días'
  })
];

export const INITIAL_CERTIFICATES = [
  new Certificate({
    id: 1,
    folio: 'MA-2026-DEV-00101',
    uuid: '57589a11-2430-4d7a-990a-9ed1bcda3e18',
    verification_uuid: '57589a11-2430-4d7a-990a-9ed1bcda3e18',
    studentName: 'Sofía Valenzuela',
    studentEmail: 'sofia.valenzuela@gmail.com',
    studentId: 4,
    courseTitle: 'Desarrollo Web Fullstack & Ciberseguridad',
    courseId: 1,
    courseHours: 28,
    issuedDate: '2026-09-22',
    grade: '100/100 (Excelente)',
    status: 'valid'
  }),
  new Certificate({
    id: 2,
    folio: 'CERT-20260924-ALEX9921',
    uuid: 'b4728519-51a2-4720-bc90-951928374610',
    verification_uuid: 'b4728519-51a2-4720-bc90-951928374610',
    studentName: 'Alejandro Morales',
    studentEmail: 'morales.dev@outlook.com',
    studentId: 5,
    courseTitle: 'Desarrollo Web Fullstack & Ciberseguridad',
    courseId: 1,
    courseHours: 28,
    issuedDate: '2026-09-23',
    grade: '75/100 (Aprobado)',
    status: 'valid'
  }),
  new Certificate({
    id: 3,
    folio: 'CERT-20260920-STPS4401',
    uuid: '83917402-9182-4219-ab83-847291039481',
    verification_uuid: '83917402-9182-4219-ab83-847291039481',
    studentName: 'Mariana Silva',
    studentEmail: 'mariana.silva@empresa.mx',
    studentId: 7,
    courseTitle: 'Normativas Oficiales de Seguridad Industrial (STPS)',
    courseId: 2,
    courseHours: 16,
    issuedDate: '2026-09-20',
    grade: '90/100',
    status: 'valid'
  })
];

export const INITIAL_REVIEWS = [
  new Review({
    id: 'rev_1',
    courseId: 1,
    courseTitle: 'Flutter & Dart: De Cero a Experto',
    userName: 'Sofía Valenzuela',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    rating: 5,
    reviewText: 'El mejor curso que he tomado. Las explicaciones sobre el ciclo de vida de los widgets y la sincronización en tiempo real son impecables.',
    tags: ['Excelente pedagogía', 'Proyectos reales', 'Código limpio'],
    createdAt: '2026-09-19'
  }),
  new Review({
    id: 'rev_2',
    courseId: 1,
    courseTitle: 'Flutter & Dart: De Cero a Experto',
    userName: 'Alejandro Morales',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
    rating: 5,
    reviewText: 'El reproductor móvil y las notas integradas me permitieron avanzar en mis ratos libres en el transporte. Recomendadísimo.',
    tags: ['Muy práctico', 'Soporte rápido'],
    createdAt: '2026-09-15'
  }),
  new Review({
    id: 'rev_3',
    courseId: 2,
    courseTitle: 'Arquitectura Limpia en Aplicaciones Móviles',
    userName: 'Valeria Rivas',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120',
    rating: 4,
    reviewText: 'Muy buen nivel técnico. Me gustaría que agregaran más ejemplos de pruebas unitarias sobre los casos de uso.',
    tags: ['Avanzado', 'Buenas prácticas'],
    createdAt: '2026-09-14'
  })
];

export const INITIAL_COUPONS = [
  new Coupon({
    id: 'coup_1',
    code: 'MA2026',
    discountPercentage: 25,
    maxUses: 100,
    currentUses: 34,
    expiryDate: '2026-10-31',
    courseTitle: 'Todos los cursos',
    isActive: true
  }),
  new Coupon({
    id: 'coup_2',
    code: 'FLUTTERPRO',
    discountPercentage: 40,
    maxUses: 50,
    currentUses: 48,
    expiryDate: '2026-09-30',
    courseTitle: 'Flutter & Dart: De Cero a Experto',
    isActive: true
  }),
  new Coupon({
    id: 'coup_3',
    code: 'BIENVENIDO10',
    discountPercentage: 10,
    maxUses: 200,
    currentUses: 89,
    expiryDate: '2026-12-31',
    courseTitle: 'Todos los cursos',
    isActive: true
  })
];

export const INITIAL_RECENT_ORDERS = [
  { id: 'ORD-9842', studentName: 'Sofía Valenzuela', courseTitle: 'Flutter & Dart: De Cero a Experto', amount: '29.99', date: '2026-09-22', paymentMethod: 'Tarjeta de Crédito' },
  { id: 'ORD-9841', studentName: 'Martín Paredes', courseTitle: 'Arquitectura Limpia en Apps', amount: '34.50', date: '2026-09-21', paymentMethod: 'PayPal' },
  { id: 'ORD-9840', studentName: 'Valeria Rivas', courseTitle: 'Flutter & Dart: De Cero a Experto', amount: '29.99', date: '2026-09-21', paymentMethod: 'Google Pay' },
  { id: 'ORD-9839', studentName: 'Gabriel Zúñiga', courseTitle: 'Desarrollo Backend con Node & Clean Arch', amount: '39.00', date: '2026-09-20', paymentMethod: 'Tarjeta de Débito' },
  { id: 'ORD-9838', studentName: 'Alejandro Morales', courseTitle: 'Flutter & Dart: De Cero a Experto', amount: '29.99', date: '2026-09-19', paymentMethod: 'Apple Pay' }
];

export const INITIAL_FINANCIAL_STATS = {
  totalEarnings: '18,450.00',
  totalSales: '482',
  activeStudents: '1,290',
  graduationRate: '78',
  averageRating: '4.8',
};

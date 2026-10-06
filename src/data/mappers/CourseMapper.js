import { Course } from '../../domain/models/Course';
import { Category } from '../../domain/models/Category';

export class CourseMapper {
  static toDomain(raw) {
    if (!raw) return null;

    let basePrice = 450.0;
    let promoPrice = 349.0;

    if (raw.prices && raw.prices.length > 0) {
      basePrice = parseFloat(raw.prices[0].base_amount ?? raw.prices[0].amount ?? basePrice);
      promoPrice = parseFloat(raw.prices[0].promotional_amount ?? basePrice);
    } else if (raw.precio !== undefined) {
      basePrice = parseFloat(raw.precio);
      promoPrice = raw.precio_promocional ? parseFloat(raw.precio_promocional) : basePrice;
    }

    const catName = raw.category?.nombre || raw.category?.name || raw.category_name || 'General';
    const coverUrl = raw.cover?.path || raw.portada_path || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
    const instructorName = raw.instructor?.name || raw.instructor?.nombre || 'Master Academy';

    return new Course({
      id: raw.id,
      uid: raw.uid,
      title: raw.title || raw.titulo || 'Curso sin título',
      slug: raw.slug,
      codigo: raw.codigo || raw.code || null,
      summary: raw.summary || raw.resumen || raw.description || '',
      description: raw.description || raw.descripcion || '',
      categoryId: raw.category_id || raw.category?.id,
      categoryName: catName,
      instructorName,
      coverUrl,
      level: raw.level || raw.nivel || 'Intermedio',
      hours: raw.hours || raw.horas || 12,
      price: basePrice,
      promotionalPrice: promoPrice,
      lessonsCount: raw.lessons_count || raw.syllabi_count || 0,
      createdAt: raw.created_at || null
    });
  }

  static toCategoryDomain(raw) {
    return new Category({
      id: raw.id,
      name: raw.nombre || raw.name || '',
      slug: raw.slug || '',
      icon: raw.icono || null
    });
  }
}

export class Course {
  constructor({
    id,
    uid,
    title,
    slug,
    codigo = null,
    code = null,
    summary,
    description,
    categoryId,
    categoryName,
    instructorName,
    coverUrl,
    level,
    hours,
    price,
    promotionalPrice,
    lessonsCount = 0,
    modules = [],
    createdAt = null
  } = {}) {
    this.id = id;
    this.uid = uid;
    this.title = title;
    this.slug = slug;
    this.codigo = codigo || code || (slug ? ('MA-' + String(slug).toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)) : null);
    this.summary = summary;
    this.description = description;
    this.categoryId = categoryId;
    this.categoryName = categoryName || 'General';
    this.instructorName = instructorName || 'Master Academy';
    this.coverUrl = coverUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
    this.level = level || 'Intermedio';
    this.hours = hours || 12;
    this.price = Number(price) || 0;
    this.promotionalPrice = promotionalPrice !== null && promotionalPrice !== undefined ? Number(promotionalPrice) : this.price;
    this.lessonsCount = lessonsCount;
    this.modules = modules;
    this.createdAt = createdAt;
  }

  get hasDiscount() {
    return this.promotionalPrice < this.price;
  }
}

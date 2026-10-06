export class Coupon {
  constructor({
    id,
    code,
    discountPercentage,
    maxUses = 100,
    currentUses = 0,
    expiryDate,
    courseTitle = 'Todos los cursos',
    isActive = true
  }) {
    this.id = id;
    this.code = (code || '').toUpperCase();
    this.discountPercentage = Number(discountPercentage) || 10;
    this.maxUses = Number(maxUses) || 50;
    this.currentUses = Number(currentUses) || 0;
    this.expiryDate = expiryDate;
    this.courseTitle = courseTitle;
    this.isActive = Boolean(isActive);
  }
}

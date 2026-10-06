export class Category {
  constructor({ id, name, slug, icon = null }) {
    this.id = id;
    this.name = name;
    this.slug = slug;
    this.icon = icon;
  }
}

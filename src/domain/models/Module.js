export class Module {
  constructor({ id, title, order = 1, lessons = [] }) {
    this.id = id;
    this.title = title;
    this.order = order;
    this.lessons = lessons;
  }
}

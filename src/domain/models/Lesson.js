export class Lesson {
  constructor({ id, title, content = '', videoUrl = '', order = 1, isFreePreview = false, resources = [] }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.videoUrl = videoUrl;
    this.order = order;
    this.isFreePreview = isFreePreview;
    this.resources = Array.isArray(resources) ? resources : [];
  }
}

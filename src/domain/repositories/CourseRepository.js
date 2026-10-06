export class CourseRepository {
  async getAll(params = {}) {
    throw new Error('Method getAll() not implemented');
  }
  async getSyllabus(courseId) {
    throw new Error('Method getSyllabus() not implemented');
  }
  async updateFull(courseId, courseData) {
    throw new Error('Method not implemented');
  }

  async createFull(courseData) {
    throw new Error('Method createFull() not implemented');
  }
  async delete(courseId) {
    throw new Error('Method delete() not implemented');
  }
}

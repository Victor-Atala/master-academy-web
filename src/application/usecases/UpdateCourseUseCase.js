export class UpdateCourseUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(courseId, payload) {
    return await this.courseRepository.updateFull(courseId, payload);
  }
}

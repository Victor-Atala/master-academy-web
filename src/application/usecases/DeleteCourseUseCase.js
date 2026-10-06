export class DeleteCourseUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(courseId) {
    return await this.courseRepository.delete(courseId);
  }
}

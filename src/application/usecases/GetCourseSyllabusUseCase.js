export class GetCourseSyllabusUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(courseId) {
    return await this.courseRepository.getSyllabus(courseId);
  }
}

export class GetCoursesUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute() {
    return await this.courseRepository.getAll();
  }
}

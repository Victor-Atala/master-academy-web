export class CreateCourseUseCase {
  constructor(courseRepository) {
    this.courseRepository = courseRepository;
  }

  async execute(courseData) {
    // Basic domain validation
    if (!courseData.titulo || !courseData.titulo.trim()) {
      throw new Error('El título del curso es obligatorio');
    }
    if (!courseData.category_id) {
      throw new Error('Debes seleccionar un área académica');
    }
    if (Number(courseData.precio) < 0) {
      throw new Error('El precio debe ser un número positivo');
    }

    return await this.courseRepository.createFull(courseData);
  }
}

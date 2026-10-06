import { CourseRepository } from '../../domain/repositories/CourseRepository';
import { CourseRemoteDataSource } from '../datasources/CourseRemoteDataSource';
import { CourseMapper } from '../mappers/CourseMapper';

export class CourseRepositoryImpl extends CourseRepository {
  constructor(dataSource = new CourseRemoteDataSource()) {
    super();
    this.dataSource = dataSource;
  }

  async getAll() {
    const rawList = await this.dataSource.getCourses();
    return rawList.map(CourseMapper.toDomain);
  }

  async getSyllabus(courseId) {
    return await this.dataSource.getSyllabus(courseId);
  }

  async updateFull(courseId, courseData) {
    const res = await this.dataSource.updateFull(courseId, courseData);
    return res.data || res;
  }

  async createFull(courseData) {
    const res = await this.dataSource.createFull(courseData);
    return res.data || res;
  }

  async delete(courseId) {
    return await this.dataSource.deleteCourse(courseId);
  }
}

import { CategoryRepository } from '../../domain/repositories/CategoryRepository';
import { CategoryRemoteDataSource } from '../datasources/CategoryRemoteDataSource';
import { CourseMapper } from '../mappers/CourseMapper';

export class CategoryRepositoryImpl extends CategoryRepository {
  constructor(dataSource = new CategoryRemoteDataSource()) {
    super();
    this.dataSource = dataSource;
  }

  async getAll() {
    const rawList = await this.dataSource.getCategories();
    return rawList.map(CourseMapper.toCategoryDomain);
  }
}

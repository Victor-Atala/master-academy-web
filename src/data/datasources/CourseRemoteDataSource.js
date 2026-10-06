import { defaultApiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../../core/constants/api.constants';

export class CourseRemoteDataSource {
  constructor(client = defaultApiClient) {
    this.client = client;
  }

  async getCourses(perPage = 50) {
    const res = await this.client.get(`${API_ENDPOINTS.COURSES}?per_page=${perPage}`);
    return res.data || [];
  }

  async getSyllabus(courseId) {
    const res = await this.client.get(API_ENDPOINTS.COURSE_SYLLABUS(courseId));
    return res.data || res || [];
  }

  async updateFull(courseId, payload) {
    return await this.client.put(API_ENDPOINTS.ADMIN_COURSE_UPDATE(courseId), payload);
  }

  async createFull(payload) {
    return await this.client.post(API_ENDPOINTS.ADMIN_COURSE_CREATE, payload);
  }

  async deleteCourse(courseId) {
    return await this.client.delete(API_ENDPOINTS.ADMIN_COURSE_DELETE(courseId));
  }
}

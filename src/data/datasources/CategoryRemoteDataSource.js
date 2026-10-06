import { defaultApiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../../core/constants/api.constants';

export class CategoryRemoteDataSource {
  constructor(client = defaultApiClient) {
    this.client = client;
  }

  async getCategories() {
    const res = await this.client.get(API_ENDPOINTS.CATEGORIES);
    return res.data || res || [];
  }
}

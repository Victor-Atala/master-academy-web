import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../../core/constants/api.constants';

export class InstructorFinancialRepository {
  constructor(client = apiClient) {
    this.client = client;
  }

  async getFinancialInfo() {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('master_academy_token') : null;
      if (!token || token.startsWith('mock_') || token.startsWith('demo_')) {
        return null;
      }
      const res = await this.client.get(API_ENDPOINTS.INSTRUCTOR_FINANCIAL_INFO);
      return res?.data || res;
    } catch (e) {
      return null;
    }
  }

  async updateFinancialInfo(data) {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('master_academy_token') : null;
      if (!token || token.startsWith('mock_') || token.startsWith('demo_')) {
        return data;
      }
      const res = await this.client.put(API_ENDPOINTS.INSTRUCTOR_FINANCIAL_INFO, data);
      return res?.data || res;
    } catch (e) {
      return data;
    }
  }
}

export const instructorFinancialRepository = new InstructorFinancialRepository();

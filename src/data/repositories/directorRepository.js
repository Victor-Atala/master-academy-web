import { apiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../../core/constants/api.constants';
import { INITIAL_INSTRUCTORS } from '../mock/directorSuiteData';

export class DirectorRepository {
  constructor(client = apiClient) {
    this.client = client;
  }

  getDeletedInstructorIds() {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('ma_deleted_instructors') : null;
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  async getMetrics() {
    const res = await this.client.get(API_ENDPOINTS.EXECUTIVE_METRICS);
    return res?.data || res;
  }

  async getInstructors() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('master_academy_token') : null;
    let list = null;
    if (token && !token.startsWith('mock_') && !token.startsWith('demo_')) {
      try {
        const res = await this.client.get(API_ENDPOINTS.ADMIN_INSTRUCTORS);
        list = res?.data || res;
      } catch (e) {
        console.warn('[directorRepository] API getInstructors fallback to demo:', e.message);
      }
    }
    if (!Array.isArray(list) || list.length === 0) {
      list = INITIAL_INSTRUCTORS;
    }
    const deletedIds = this.getDeletedInstructorIds();
    return list.filter((inst) => !deletedIds.includes(String(inst.id)));
  }

  async syncPermissions(instructorId, permissions) {
    const endpoint = API_ENDPOINTS.ADMIN_INSTRUCTOR_PERMISSIONS(instructorId);
    const res = await this.client.put(endpoint, { permissions });
    return res?.data || res;
  }

  async updateInstructorBankInfo(instructorId, bankData) {
    const endpoint = API_ENDPOINTS.ADMIN_INSTRUCTOR_BANK_INFO(instructorId);
    const res = await this.client.put(endpoint, bankData);
    return res?.data || res;
  }

  async deleteInstructor(instructorId) {
    try {
      const deletedIds = this.getDeletedInstructorIds();
      if (!deletedIds.includes(String(instructorId))) {
        deletedIds.push(String(instructorId));
        if (typeof window !== 'undefined') {
          localStorage.setItem('ma_deleted_instructors', JSON.stringify(deletedIds));
        }
      }
    } catch (e) {}

    const token = typeof window !== 'undefined' ? localStorage.getItem('master_academy_token') : null;
    if (!token || token.startsWith('mock_') || token.startsWith('demo_')) return null;
    const endpoint = `/admin/instructors/${instructorId}`;
    const res = await this.client.delete(endpoint);
    return res?.data || res;
  }

  async getSettlementHistory() {
    const res = await this.client.get(API_ENDPOINTS.ADMIN_SETTLEMENTS_HISTORY);
    return res?.data || res;
  }

  async disburseSettlement({ instructorId, amount, trackingKey, concept, receiptFile }) {
    const formData = new FormData();
    formData.append('instructor_id', instructorId);
    formData.append('amount', amount);
    formData.append('tracking_key', trackingKey);
    formData.append('concept', concept);
    if (receiptFile) {
      formData.append('receipt_file', receiptFile);
    }

    const res = await this.client.post(API_ENDPOINTS.ADMIN_SETTLEMENTS_DISBURSE, formData);
    return res?.data || res;
  }

  async getCourseRequests() {
    const res = await this.client.get(API_ENDPOINTS.ADMIN_COURSE_REQUESTS);
    return res?.data || res;
  }

  async approveCourseRequest(id, finalPrice, commissionRate) {
    const endpoint = API_ENDPOINTS.ADMIN_COURSE_REQUEST_APPROVE(id);
    const res = await this.client.post(endpoint, { finalPrice, commissionRate });
    return res?.data || res;
  }

  async rejectCourseRequest(id, feedback) {
    const endpoint = API_ENDPOINTS.ADMIN_COURSE_REQUEST_REJECT(id);
    const res = await this.client.post(endpoint, { feedback });
    return res?.data || res;
  }
}

export const directorRepository = new DirectorRepository();

import { defaultApiClient } from '../api/apiClient';
import { API_ENDPOINTS } from '../../core/constants/api.constants';

export class CertificateRemoteDataSource {
  constructor(client = defaultApiClient) {
    this.client = client;
  }

  async getCertificates(perPage = 50) {
    const res = await this.client.get(`${API_ENDPOINTS.CERTIFICATES}?per_page=${perPage}`);
    return res.data || res || [];
  }

  async issueCertificate({ userId, courseId, grade }) {
    const res = await this.client.post(API_ENDPOINTS.CERTIFICATES, {
      user_id: userId,
      course_id: courseId,
      grade: grade || '95/100',
    });
    return res.data || res;
  }

  async revokeCertificate(certificateId, reason = 'Revocación por instructor') {
    const res = await this.client.post(API_ENDPOINTS.CERTIFICATE_REVOKE(certificateId), {
      reason,
    });
    return res.data || res;
  }

  async verify(uuid) {
    const res = await this.client.get(API_ENDPOINTS.CERTIFICATE_VERIFY(uuid));
    return res.data || res;
  }
}

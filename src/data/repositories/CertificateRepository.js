import { CertificateRemoteDataSource } from '../datasources/CertificateRemoteDataSource';
import { Certificate } from '../../domain/models/Certificate';

export class CertificateRepository {
  constructor(dataSource = new CertificateRemoteDataSource()) {
    this.dataSource = dataSource;
  }

  async getAll() {
    try {
      const data = await this.dataSource.getCertificates();
      const list = Array.isArray(data) ? data : data?.data || [];
      return list.map(item => new Certificate(item));
    } catch (error) {
      // Silent fallback for offline / demo mode
      throw error;
    }
  }

  async issue({ userId, courseId, grade }) {
    try {
      const res = await this.dataSource.issueCertificate({ userId, courseId, grade });
      const raw = res?.data || res;
      return new Certificate(raw);
    } catch (error) {
      console.error('[CertificateRepository] Error issuing remote certificate:', error.message);
      throw error;
    }
  }

  async revoke(id, reason) {
    try {
      const res = await this.dataSource.revokeCertificate(id, reason);
      const raw = res?.data || res;
      return new Certificate(raw);
    } catch (error) {
      console.error('[CertificateRepository] Error revoking certificate:', error.message);
      throw error;
    }
  }

  async verify(uuid) {
    const res = await this.dataSource.verify(uuid);
    return res?.data || res;
  }
}

export const certificateRepository = new CertificateRepository();

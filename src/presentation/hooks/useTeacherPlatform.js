import { useState, useEffect } from 'react';
import {
  INITIAL_INQUIRIES,
  INITIAL_ENROLLMENTS,
  INITIAL_CERTIFICATES,
  INITIAL_REVIEWS,
  INITIAL_COUPONS,
  INITIAL_RECENT_ORDERS,
  INITIAL_FINANCIAL_STATS,
} from '../../data/mock/teacherPlatformData';
import { Coupon } from '../../domain/models/Coupon';
import { Certificate } from '../../domain/models/Certificate';
import { certificateRepository } from '../../data/repositories/CertificateRepository';

const STORAGE_KEYS = {
  INQUIRIES: 'ma_teacher_inquiries',
  CERTIFICATES: 'ma_teacher_certificates',
  COUPONS: 'ma_teacher_coupons',
};

export function useTeacherPlatform() {
  // Inquiries State
  const [inquiries, setInquiries] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_INQUIRIES;
  });

  // Certificates State
  const [certificates, setCertificates] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CERTIFICATES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(c => new Certificate(c));
        }
      } catch (e) {}
    }
    return INITIAL_CERTIFICATES;
  });

  // Coupons State
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COUPONS;
  });

  // Enrollments & Reviews & Orders
  const [enrollments] = useState(INITIAL_ENROLLMENTS);
  const [reviews] = useState(INITIAL_REVIEWS);
  const [recentOrders] = useState(INITIAL_RECENT_ORDERS);
  const [stats] = useState(INITIAL_FINANCIAL_STATS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CERTIFICATES, JSON.stringify(certificates));
  }, [certificates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  }, [coupons]);

  // Load from remote backend API if logged in
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('master_academy_token') : null;
    if (token && !token.startsWith('mock_') && !token.startsWith('demo_')) {
      certificateRepository.getAll().then(remoteCerts => {
        if (remoteCerts && remoteCerts.length > 0) {
          setCertificates(prev => {
            const map = new Map();
            prev.forEach(c => map.set(c.folio || c.id, c));
            remoteCerts.forEach(c => map.set(c.folio || c.id, c));
            return Array.from(map.values());
          });
        }
      }).catch(() => {});
    }
  }, []);

  // Actions
  const answerInquiry = (inquiryId, replyText) => {
    setInquiries(prev =>
      prev.map(inq =>
        inq.id === inquiryId
          ? { ...inq, status: 'answered', reply: replyText }
          : inq
      )
    );
  };

  const revokeCertificate = async (certificateId, reason = 'Revocación por instructor') => {
    if (typeof certificateId === 'number' || /^\d+$/.test(certificateId)) {
      try {
        await certificateRepository.revoke(certificateId, reason);
      } catch (err) {
        console.warn('[useTeacherPlatform] Backend revoke failed or skipped:', err.message);
      }
    }

    setCertificates(prev =>
      prev.map(c =>
        c.id === certificateId ? { ...c, status: 'revoked' } : c
      )
    );
  };

  const issueCertificate = async (certData) => {
    let createdCert = null;

    // If studentId and courseId are valid numbers, try backend API
    const numStudentId = Number(certData.studentId);
    const numCourseId = Number(certData.courseId);

    if (numStudentId && numCourseId && !isNaN(numStudentId) && !isNaN(numCourseId)) {
      try {
        createdCert = await certificateRepository.issue({
          userId: numStudentId,
          courseId: numCourseId,
          grade: certData.grade || '95/100',
        });
      } catch (err) {
        console.warn('[useTeacherPlatform] API issue failed, creating local cryptographic certificate:', err.message);
      }
    }

    if (!createdCert) {
      const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const randomHex = Array.from({ length: 8 }, () => Math.floor(Math.random() * 36).toString(36).toUpperCase()).join('');
      const folio = certData.folio || `CERT-${todayStr}-${randomHex}`;
      
      const uuidV4 = certData.verification_uuid || certData.uuid || (
        typeof crypto !== 'undefined' && crypto.randomUUID 
          ? crypto.randomUUID() 
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
              const r = Math.random() * 16 | 0;
              const v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            })
      );

      createdCert = new Certificate({
        id: certData.id || `cert_${Date.now()}`,
        folio: folio,
        uuid: uuidV4,
        verification_uuid: uuidV4,
        studentName: certData.studentName || 'Estudiante',
        studentEmail: certData.studentEmail || '',
        studentId: certData.studentId,
        courseTitle: certData.courseTitle || 'Programa Formativo',
        courseId: certData.courseId,
        courseHours: certData.courseHours || 20,
        issuedDate: certData.issuedDate || new Date().toISOString().split('T')[0],
        grade: certData.grade || '95/100',
        status: 'valid',
        qr_code_url: `http://127.0.0.1:8000/api/v1/certificates/verify/${uuidV4}`,
      });
    }

    setCertificates(prev => [createdCert, ...prev.filter(c => c.id !== createdCert.id)]);
    return createdCert;
  };

  const createCoupon = (couponData) => {
    const newCoupon = new Coupon(couponData);
    setCoupons(prev => [newCoupon, ...prev]);
  };

  const deleteCoupon = (couponId) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };

  const pendingInquiriesCount = inquiries.filter(i => i.status === 'pending').length;

  return {
    inquiries,
    pendingInquiriesCount,
    answerInquiry,
    enrollments,
    certificates,
    revokeCertificate,
    issueCertificate,
    reviews,
    coupons,
    createCoupon,
    deleteCoupon,
    recentOrders,
    stats,
  };
}

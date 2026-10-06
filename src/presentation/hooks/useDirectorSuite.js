import { useState, useEffect, useCallback } from 'react';
import { directorRepository } from '../../data/repositories/directorRepository';
import {
  INITIAL_INSTRUCTORS,
  DIRECTOR_EXECUTIVE_METRICS,
  PERMISSION_DEFINITIONS,
} from '../../data/mock/directorSuiteData';

const STORAGE_KEYS = {
  INSTRUCTORS: 'ma_director_suite_instructors',
};

export function useDirectorSuite() {
  const [instructors, setInstructors] = useState([]);

  const [metrics] = useState(DIRECTOR_EXECUTIVE_METRICS);
  const [permissionsCatalog] = useState(PERMISSION_DEFINITIONS);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(instructors));
    } catch (e) {}
  }, [instructors]);

  useEffect(() => {
    let isMounted = true;
    const token = typeof window !== 'undefined' ? localStorage.getItem('master_academy_token') : null;
    if (token && !token.startsWith('mock_token_') && !token.startsWith('demo_token_')) {
      directorRepository.getInstructors().then((res) => {
        const data = res?.data || res;
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setInstructors(data);
        }
      }).catch(() => {});
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const showFeedback = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const updateInstructor = useCallback((instructorId, fields) => {
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === instructorId ? { ...inst, ...fields } : inst))
    );
    showFeedback('Perfil docente y configuraci?n de comisi?n actualizados.');
  }, []);

  const togglePermission = useCallback((instructorId, permissionKey) => {
    setInstructors((prev) =>
      prev.map((inst) => {
        if (inst.id !== instructorId) return inst;
        const exists = (inst.permissions || []).includes(permissionKey);
        const nextPerms = exists
          ? inst.permissions.filter((p) => p !== permissionKey)
          : [...(inst.permissions || []), permissionKey];

        return { ...inst, permissions: nextPerms };
      })
    );
    showFeedback('Matriz de permisos de seguridad actualizada en tiempo real.');
  }, []);

  const applyPreset = useCallback((instructorId, preset) => {
    const allKeys = PERMISSION_DEFINITIONS.map((p) => p.key);
    let targetPerms = [];

    if (preset === 'all') {
      targetPerms = [...allKeys];
    } else if (preset === 'standard') {
      targetPerms = [
        'courses.publish_direct',
        'certificates.issue',
        'coupons.create_unlimited',
      ];
    } else if (preset === 'restricted') {
      targetPerms = ['certificates.issue'];
    } else if (preset === 'none') {
      targetPerms = [];
    }

    setInstructors((prev) =>
      prev.map((inst) => (inst.id === instructorId ? { ...inst, permissions: targetPerms } : inst))
    );
    showFeedback(`Preset "${preset.toUpperCase()}" aplicado correctamente.`);
  }, []);

  const toggleInstructorStatus = useCallback((instructorId) => {
    setInstructors((prev) =>
      prev.map((inst) => {
        if (inst.id !== instructorId) return inst;
        const nextStatus =
          inst.status === 'active'
            ? 'suspended'
            : inst.status === 'suspended'
            ? 'review'
            : 'active';
        return { ...inst, status: nextStatus };
      })
    );
  }, []);

  const pendingSettlementsCount = instructors.filter((i) => (i.pendingBalance || 0) > 0).length;
  const pendingRequestsCount = 0;

  return {
    instructors,
    metrics,
    pendingSettlementsCount,
    pendingRequestsCount,
    permissionsCatalog,
    selectedInstructor,
    setSelectedInstructor,
    feedbackMessage,
    updateInstructor,
    togglePermission,
    applyPreset,
    toggleInstructorStatus,
  };
}

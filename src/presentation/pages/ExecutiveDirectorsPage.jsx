import React, { useState, useMemo, useEffect } from 'react';
import {
  Trash2,
  ShieldCheck,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  BookOpen,
  Lock,
  Unlock,
  Check,
  AlertTriangle,
  Eye,
  Edit3,
  Sliders,
  BarChart3,
  PieChart,
  Activity,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  Filter,
  Search,
  ChevronRight,
  UserPlus,
  Building2,
  CheckCircle2,
  X,
  FileText,
  Clock,
  ArrowUpRight,
  ShoppingBag,
  Percent,
  Briefcase,
  Layers,
  Tag,
  CreditCard,
  Upload,
  Paperclip,
  FileUp,
  Receipt,
  Banknote,
  CheckCheck,
  ClipboardCheck,
  Inbox,
  AlertCircle,
  XCircle,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Button } from '../components/atoms/Button';
import { ModalPortal } from '../components/atoms/ModalPortal';
import { LetterAvatar } from '../components/atoms/LetterAvatar';
import { directorRepository } from '../../data/repositories/directorRepository';
import {
  DIRECTOR_EXECUTIVE_METRICS,
  INITIAL_INSTRUCTORS,
  PERMISSION_DEFINITIONS,
  INITIAL_COURSE_REQUESTS,
  INITIAL_SETTLEMENT_HISTORY,
} from '../../data/mock/directorSuiteData';

const CATEGORY_COLORS = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-secondary)', 'var(--color-warning)', '#64748b'];

export function ExecutiveDirectorsPage({
  user,
  activeSection = 'executive',
  onTabChange,
}) {
  const [metrics, setMetrics] = useState(DIRECTOR_EXECUTIVE_METRICS);
  const [instructors, setInstructors] = useState([]);
  const [isLoadingInstructors, setIsLoadingInstructors] = useState(true);
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);
  const [permissionsCatalog, setPermissionsCatalog] = useState(PERMISSION_DEFINITIONS);
  const [courseRequests, setCourseRequests] = useState(INITIAL_COURSE_REQUESTS || []);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const showToast = (msg) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  // Carga de datos reales desde el backend Laravel
  useEffect(() => {
    let isMounted = true;

    directorRepository.getMetrics().then((res) => {
      const data = res?.data || res;
      if (isMounted && data) {
        setMetrics((prev) => ({ ...prev, ...data }));
      }
    }).catch(() => {});

    setIsLoadingInstructors(true);
    directorRepository.getInstructors().then((res) => {
      const data = res?.data || res;
      if (isMounted && Array.isArray(data)) {
        const deletedIds = directorRepository.getDeletedInstructorIds();
        const filtered = data.filter((inst) => !deletedIds.includes(String(inst.id)));
        setInstructors(filtered);
      }
    }).catch((err) => {
      console.warn('Backend Instructors Fetch:', err);
    }).finally(() => {
      if (isMounted) setIsLoadingInstructors(false);
    });

    directorRepository.getSettlementHistory().then((res) => {
      const data = res?.data || res;
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setSettlementHistory(data);
      }
    }).catch(() => {});

    directorRepository.getCourseRequests().then((res) => {
      const data = res?.data || res;
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setCourseRequests(data);
      }
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  // State for Course Requests view
  const [requestFilter, setRequestFilter] = useState('pending'); // 'all' | 'pending' | 'approved' | 'changes_requested'
  const [selectedCourseDetail, setSelectedCourseDetail] = useState(null);
  const [selectedProfileInstructor, setSelectedProfileInstructor] = useState(null);
  const [approvingCourse, setApprovingCourse] = useState(null);
  const [approvalPrice, setApprovalPrice] = useState(185);
  const [rejectionModalCourse, setRejectionModalCourse] = useState(null);
  const [rejectionNotes, setRejectionNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('Ajuste de precio');

  const pendingRequestsCount = courseRequests.filter((r) => r.status === 'pending').length;

  const handleOpenApproveModal = (course) => {
    setApprovingCourse(course);
    setApprovalPrice(course.proposedPrice || 185);
  };

  const handleConfirmApproval = (e) => {
    e.preventDefault();
    if (!approvingCourse) return;

    setCourseRequests((prev) =>
      prev.map((c) => {
        if (c.id !== approvingCourse.id) return c;
        return {
          ...c,
          status: 'approved',
          finalPrice: Number(approvalPrice),
          approvedDate: 'Hoy, hace un momento',
        };
      })
    );

    showToast(`¡Curso "${approvingCourse.title}" aprobado y publicado a la venta por $${approvalPrice} MXN!`);
    setApprovingCourse(null);
  };

  const handleOpenRejectionModal = (course) => {
    setRejectionModalCourse(course);
    setRejectionNotes('');
    setRejectionReason('Ajuste de precio sugerido');
  };

  const handleConfirmRejection = (e) => {
    e.preventDefault();
    if (!rejectionModalCourse) return;

    setCourseRequests((prev) =>
      prev.map((c) => {
        if (c.id !== rejectionModalCourse.id) return c;
        return {
          ...c,
          status: 'changes_requested',
          feedbackReason: rejectionReason,
          feedbackNotes: rejectionNotes || 'Se requiere revisión de los aspectos señalados antes de la publicación.',
          feedbackDate: 'Hoy, hace un momento',
        };
      })
    );

    showToast(`Observaciones enviadas al instructor ${rejectionModalCourse.instructorName}.`);
    setRejectionModalCourse(null);
    setRejectionNotes('');
  };

  const togglePermission = (instructorId, permKey) => {
    setInstructors((prev) =>
      prev.map((inst) => {
        if (inst.id !== instructorId) return inst;
        const has = inst.permissions.includes(permKey);
        const updated = has
          ? inst.permissions.filter((p) => p !== permKey)
          : [...inst.permissions, permKey];
        directorRepository.syncPermissions(instructorId, updated).catch((err) => console.warn('API Permissions:', err));
        return { ...inst, permissions: updated };
      })
    );
    showToast('Permiso comercial actualizado con éxito.');
  };

  const applyPreset = (instructorId, presetType) => {
    setInstructors((prev) =>
      prev.map((inst) => {
        if (inst.id !== instructorId) return inst;
        let perms = [];
        if (presetType === 'all') {
          perms = permissionsCatalog.map((p) => p.key);
        } else if (presetType === 'standard') {
          perms = ['courses.publish_direct', 'certificates.issue', 'coupons.create_unlimited'];
        } else if (presetType === 'none') {
          perms = [];
        }
        return { ...inst, permissions: perms };
      })
    );
    showToast(`Preset "${presetType.toUpperCase()}" aplicado correctamente.`);
  };

  const updateInstructor = (id, fields) => {
    setInstructors((prev) =>
      prev.map((inst) => (inst.id === id ? { ...inst, ...fields } : inst))
    );
    showToast('Perfil comercial y esquema de comisión actualizado.');
  };

  const confirmDeleteInstructor = () => {
    if (!deletingInstructor) return;
    const targetId = deletingInstructor.id;
    const targetName = deletingInstructor.name;

    setInstructors((prev) => prev.filter((inst) => inst.id !== targetId));
    directorRepository.deleteInstructor(targetId).catch(() => {});
    setDeletingInstructor(null);
    showToast(`Instructor "${targetName}" ha sido dado de baja de la plataforma.`);
  };

  const [instructorSearch, setInstructorSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingInstructor, setEditingInstructor] = useState(null);
  const [deletingInstructor, setDeletingInstructor] = useState(null);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(metrics.monthlyStats.length - 1);

  const [editForm, setEditForm] = useState({
    name: '',
    title: '',
    specialty: '',
    commissionRate: 70,
    status: 'active',
  });

  const openEditModal = (inst) => {
    setEditingInstructor(inst);
    setEditForm({
      name: inst.name,
      title: inst.title,
      specialty: inst.specialty,
      commissionRate: inst.commissionRate,
      status: inst.status,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingInstructor) return;
    updateInstructor(editingInstructor.id, {
      name: editForm.name,
      title: editForm.title,
      specialty: editForm.specialty,
      commissionRate: Number(editForm.commissionRate),
      status: editForm.status,
    });
    setEditingInstructor(null);
  };

  // =========================================================================
  // ESTADO Y MÉTODOS DE LIQUIDACIONES Y PAGOS (SPEI)
  // =========================================================================
  const [settlementHistory, setSettlementHistory] = useState(INITIAL_SETTLEMENT_HISTORY || []);
  const [settlementTab, setSettlementTab] = useState('pending'); // 'pending' | 'history' | 'bank_accounts'
  const [settlementSearch, setSettlementSearch] = useState('');

  // Modales de dispersión
  const [settlingInstructor, setSettlingInstructor] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutTrackingKey, setPayoutTrackingKey] = useState('');
  const [payoutConcept, setPayoutConcept] = useState('');
  const [payoutAuthorized, setPayoutAuthorized] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isBulkPayoutModalOpen, setIsBulkPayoutModalOpen] = useState(false);
  const [transferReceiptFile, setTransferReceiptFile] = useState(null);

  const [editingBankInstructor, setEditingBankInstructor] = useState(null);
  const [bankEditForm, setBankEditForm] = useState({
    bank: '',
    cardNumber: '',
    clabe: '',
    rfc: '',
    accountHolder: '',
    accountType: 'Débito / Tarjeta',
    noAplica: false,
    noAplicaReason: '',
  });

  const handleReceiptFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setTransferReceiptFile({
        rawFile: file,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      });
    }
  };

  const pendingInstructors = useMemo(() => {
    return instructors.filter((inst) => (inst.pendingBalance || 0) > 0);
  }, [instructors]);

  const totalPendingSettlement = useMemo(() => {
    return pendingInstructors.reduce((acc, curr) => acc + (curr.pendingBalance || 0), 0);
  }, [pendingInstructors]);

  const totalDisbursedHistoric = useMemo(() => {
    return settlementHistory.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  }, [settlementHistory]);

  const handleOpenSettlementModal = (instructor) => {
    setSettlingInstructor(instructor);
    setPayoutAmount(instructor.pendingBalance || 0);
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const bankPrefix = (instructor.bankInfo?.bank || 'SPEI').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    setPayoutTrackingKey(`SPEI-${dateStr}-${bankPrefix}-${randomSuffix}`);
    setPayoutConcept(`Liquidación comisiones venta de cursos - ${instructor.name.split(' ')[0]}`);
    setPayoutAuthorized(true);
    setTransferReceiptFile(null);
  };

  const handleExecutePayout = (e) => {
    e.preventDefault();
    if (!settlingInstructor) return;
    const amountToPay = Number(payoutAmount);
    if (!amountToPay || amountToPay <= 0) {
      showToast('Por favor ingrese un monto válido para la dispersión.');
      return;
    }

    setIsSubmittingPayout(true);

    // Actualizar balance de instructor
    setInstructors((prev) =>
      prev.map((inst) => {
        if (inst.id !== settlingInstructor.id) return inst;
        const currentPending = inst.pendingBalance || 0;
        const currentPaid = inst.totalPaid || 0;
        const newPending = Math.max(0, currentPending - amountToPay);
        const newPaid = currentPaid + amountToPay;
        return {
          ...inst,
          pendingBalance: newPending,
          totalPaid: newPaid,
        };
      })
    );

    // Registrar en bitácora de liquidaciones
    const newRecord = {
      id: `LIQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      folio: `SPEI-${Math.floor(100000 + Math.random() * 900000)}`,
      instructorId: settlingInstructor.id,
      instructorName: settlingInstructor.name,
      instructorAvatar: settlingInstructor.avatar,
      amount: amountToPay,
      bankName: settlingInstructor.bankInfo?.bank || 'Transferencia Bancaria SPEI',
      clabe: settlingInstructor.bankInfo?.clabe || '012180001234567890',
      rfc: settlingInstructor.bankInfo?.rfc || 'XAXX010101000',
      trackingKey: payoutTrackingKey,
      date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'liquidado',
      authorizedBy: user?.name ? `${user.name} (Dirección General)` : 'MWComenius (Dirección)',
      concept: payoutConcept,
      receiptFileName: transferReceiptFile?.name || 'comprobante_transferencia_externa.pdf',
      receiptFileSize: transferReceiptFile?.size || '145.2 KB',
      receiptPreviewUrl: transferReceiptFile?.previewUrl || null,
      hasReceiptFile: true,
    };

    setSettlementHistory((prev) => [newRecord, ...prev]);

    // Sincronizar liquidación real con backend Laravel y guardar comprobante
    directorRepository.disburseSettlement({
      instructorId: settlingInstructor.id,
      amount: amountToPay,
      trackingKey: payoutTrackingKey,
      concept: payoutConcept,
      receiptFile: transferReceiptFile?.rawFile || null,
    }).catch((err) => console.warn('API Disburse:', err)).finally(() => {
      setIsSubmittingPayout(false);
    });

    // Actualizar métricas generales
    setMetrics((prev) => ({
      ...prev,
      instructorPayout: (prev.instructorPayout || 0) + amountToPay,
    }));

    showToast(`¡Dispersión de $${amountToPay.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN realizada con éxito a ${settlingInstructor.name}!`);
    setSettlingInstructor(null);
    setSelectedReceipt(newRecord); // Abrir comprobante oficial de inmediato
  };

  const handleExecuteBulkPayout = () => {
    if (pendingInstructors.length === 0) {
      showToast('No hay saldos pendientes por liquidar.');
      setIsBulkPayoutModalOpen(false);
      return;
    }

    const newRecords = [];
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const nowTimeStr = 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let totalPaidInBatch = 0;

    setInstructors((prev) =>
      prev.map((inst) => {
        if ((inst.pendingBalance || 0) > 0) {
          const amount = inst.pendingBalance;
          totalPaidInBatch += amount;
          const bankPrefix = (inst.bankInfo?.bank || 'SPEI').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
          const randomSuffix = Math.floor(100000 + Math.random() * 900000);
          newRecords.push({
            id: `LIQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            folio: `SPEI-${Math.floor(100000 + Math.random() * 900000)}`,
            instructorId: inst.id,
            instructorName: inst.name,
            instructorAvatar: inst.avatar,
            amount: amount,
            bankName: inst.bankInfo?.bank || 'SPEI Concentradora',
            clabe: inst.bankInfo?.clabe || '012180001234567890',
            rfc: inst.bankInfo?.rfc || 'GENERICO',
            trackingKey: `SPEI-${dateStr}-${bankPrefix}-${randomSuffix}`,
            date: nowTimeStr,
            status: 'liquidado',
            authorizedBy: user?.name ? `${user.name} (Dirección General)` : 'MWComenius (Dirección)',
            concept: 'Liquidación masiva quincenal de comisiones - Catálogo Master Academy',
          });
          return {
            ...inst,
            pendingBalance: 0,
            totalPaid: (inst.totalPaid || 0) + amount,
          };
        }
        return inst;
      })
    );

    setSettlementHistory((prev) => [...newRecords, ...prev]);

    setMetrics((prev) => ({
      ...prev,
      instructorPayout: (prev.instructorPayout || 0) + totalPaidInBatch,
    }));

    showToast(`¡Liquidación en lote exitosa! Se dispersaron $${totalPaidInBatch.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN a ${pendingInstructors.length} creadores.`);
    setIsBulkPayoutModalOpen(false);
  };

  const handleOpenBankEditModal = (inst) => {
    setEditingBankInstructor(inst);
    setBankEditForm({
      bank: inst.bankInfo?.bank || 'BBVA México',
      cardNumber: inst.bankInfo?.cardNumber || '',
      clabe: inst.bankInfo?.clabe || '',
      rfc: inst.bankInfo?.rfc || '',
      accountHolder: inst.bankInfo?.accountHolder || inst.name,
      accountType: inst.bankInfo?.accountType || 'Débito / Tarjeta',
      noAplica: inst.bankInfo?.noAplica || false,
      noAplicaReason: inst.bankInfo?.noAplicaReason || 'Convenio comercial directo con la dirección',
    });
  };

  const handleSaveBankEdit = (e) => {
    e.preventDefault();
    if (!editingBankInstructor) return;
    setInstructors((prev) =>
      prev.map((inst) => {
        if (inst.id !== editingBankInstructor.id) return inst;
        return {
          ...inst,
          bankInfo: {
            ...inst.bankInfo,
            bank: bankEditForm.noAplica ? 'N/A (Trato Especial)' : bankEditForm.bank,
            cardNumber: bankEditForm.noAplica ? '' : bankEditForm.cardNumber,
            clabe: bankEditForm.noAplica ? '' : bankEditForm.clabe,
            rfc: bankEditForm.rfc,
            accountHolder: bankEditForm.accountHolder,
            accountType: bankEditForm.noAplica ? 'Convenio Especial' : bankEditForm.accountType,
            noAplica: bankEditForm.noAplica,
            noAplicaReason: bankEditForm.noAplicaReason,
            status: bankEditForm.noAplica ? 'special_deal' : 'verified',
          },
        };
      })
    );
    showToast(`Datos financieros de ${editingBankInstructor.name} actualizados.`);
    setEditingBankInstructor(null);
  };

  const filteredInstructors = useMemo(() => {
    return instructors
      .filter((inst) => {
        const matchSearch =
          inst.name.toLowerCase().includes(instructorSearch.toLowerCase()) ||
          inst.specialty.toLowerCase().includes(instructorSearch.toLowerCase()) ||
          inst.email.toLowerCase().includes(instructorSearch.toLowerCase());
        const matchStatus = statusFilter === 'all' || inst.status === statusFilter;
        return matchSearch && matchStatus;
      })
      .sort((a, b) => {
        // Ordenamiento estable y determinista: Activos primero, luego en revisión, luego suspendidos; a igualdad por ID
        const statusOrder = { active: 1, review: 2, suspended: 3 };
        const orderA = statusOrder[a.status] || 4;
        const orderB = statusOrder[b.status] || 4;
        if (orderA !== orderB) return orderA - orderB;
        return (a.id || 0) - (b.id || 0);
      });
  }, [instructors, instructorSearch, statusFilter]);

  const filteredRequests = useMemo(() => {
    if (requestFilter === 'all') return courseRequests;
    return courseRequests.filter((r) => r.status === requestFilter);
  }, [courseRequests, requestFilter]);

  const activeCount = instructors.filter((i) => i.status === 'active').length;
    const safeMonthlyStats = Array.isArray(metrics?.monthlyStats) && metrics.monthlyStats.length > 0
    ? metrics.monthlyStats
    : [{ month: 'Septiembre', revenue: metrics.totalRevenue || 0, netMargin: metrics.directorMargin || 0, teacherPayout: metrics.instructorPayout || 0, coursesSold: metrics.coursesSold || 0 }];
  const currentMonthData = safeMonthlyStats[selectedMonthIndex] || safeMonthlyStats[safeMonthlyStats.length - 1] || {
    month: 'Septiembre',
    revenue: 0,
    netMargin: 0,
    teacherPayout: 0,
    coursesSold: 0,
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', paddingBottom: '3rem' }}>
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontWeight: 700,
            fontSize: '0.88rem',
            animation: 'fadeIn 0.25s ease',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 1: PANEL GENERAL DE VENTAS (activeSection === 'executive')         */}
      {/* ========================================================================= */}
      {activeSection === 'executive' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {/* Header de la Sección */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                Panel General de Ventas
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Monitoreo en tiempo real de facturación, ganancia neta de la plataforma, comisiones a creadores y volumen de cursos vendidos.
              </p>
            </div>
          </div>

          {/* 4 TOP KPI CARDS - ENFOQUE EN VENTAS Y GANANCIAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem' }}>
            <div className="mini-stat-card">
              <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                <DollarSign size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Ventas Totales Brutas</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-text-main)' }}>
                  ${metrics.totalRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ArrowUpRight size={13} color="var(--color-primary)" /> +{metrics.monthlyGrowth}% vs mes anterior
                </div>
              </div>
            </div>

            <div className="mini-stat-card">
              <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                <TrendingUp size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Ganancia Neta Plataforma (40%)</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-text-main)' }}>
                  ${metrics.directorMargin.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Margen limpio tras pagar creadores
                </div>
              </div>
            </div>

            <div className="mini-stat-card">
              <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                <CreditCard size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Comisiones a Creadores (60%)</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-text-main)' }}>
                  ${metrics.instructorPayout.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Total dispersado a los 5 docentes
                </div>
              </div>
            </div>

            <div className="mini-stat-card">
              <div className="mini-stat-icon-wrap" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                <ShoppingBag size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Cursos Vendidos en el Mes</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-text-main)' }}>
                  {metrics.coursesSold.toLocaleString()} ventas
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)', fontWeight: 700, marginTop: '2px' }}>
                  ★ Ticket Promedio: ${(metrics.averageTicket || metrics.avgTicket || 0).toFixed(2)} MXN
                </div>
              </div>
            </div>
          </div>

          {/* Welcome Card & Platform Margin Chip */}
          <div
            className="admin-card"
            style={{
              background: 'var(--color-primary-light)',
              border: '1px solid var(--color-light-border)',
              padding: '24px 28px',
              borderRadius: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                  Período Comercial 2026-Q3 · Administración de Master Academy
                </span>
              </div>
              <h2 style={{ fontSize: '1.45rem', fontWeight: 900, margin: '0 0 4px', color: 'var(--color-text-main)' }}>
                Bienvenido/a al Panel de Negocio, {user?.name || 'MWComenius'}
              </h2>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Supervisa la facturación global, comisiones liquidadas a creadores, catálogo más rentable y campañas de cupones activas.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  textAlign: 'right',
                  padding: '8px 16px',
                  background: 'var(--color-card-bg)',
                  borderRadius: '10px',
                  border: '1px solid var(--color-light-border)',
                }}
              >
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Margen de la Plataforma
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                  <span>40.0%</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '2px 6px', borderRadius: '4px' }}>
                    +${(metrics.directorMargin || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 STRATEGIC QUICK-ACTION HUBS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem' }}>
            {/* Hub 1: Ventas y Facturación */}
            <div
              className="admin-card"
              onClick={() => onTabChange && onTabChange('executive-financial')}
              style={{
                padding: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid rgba(30, 64, 175, 0.2)',
                background: 'var(--color-card-bg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 24px rgba(30, 64, 175, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(30, 64, 175, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={22} />
                </div>
                <span className="badge-pill badge-teal" style={{ fontWeight: 800, fontSize: '0.74rem' }}>
                  +18.4% Mes
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-main)' }}>
                Ingresos y Ventas
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 14px', lineHeight: 1.4 }}>
                ${(metrics.totalRevenue || 0).toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN facturados. Gráfica mensual de ventas brutas, margen de la academia (40%) y ventas por categoría.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                <span>Ver Balance Financiero</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Hub 2: Solicitudes de Cursos Pendientes */}
            <div
              className="admin-card"
              onClick={() => onTabChange && onTabChange('executive-requests')}
              style={{
                padding: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--color-light-border)',
                background: 'var(--color-card-bg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardCheck size={22} />
                </div>
                <span className="badge-pill badge-primary" style={{ fontWeight: 800, fontSize: '0.74rem' }}>
                  {pendingRequestsCount} por Aprobar
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-main)' }}>
                Aprobación de Cursos
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 14px', lineHeight: 1.4 }}>
                Revisión de cursos nuevos enviados por creadores: autoriza el precio de venta y habilita su publicación en tienda.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                <span>Revisar Solicitudes ({pendingRequestsCount})</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Hub 3: Creadores e Instructores */}
            <div
              className="admin-card"
              onClick={() => onTabChange && onTabChange('executive-instructors')}
              style={{
                padding: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--color-light-border)',
                background: 'var(--color-card-bg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} />
                </div>
                <span className="badge-pill" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.74rem' }}>
                  {instructors.length} Creadores
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-main)' }}>
                Plantilla de Creadores
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 14px', lineHeight: 1.4 }}>
                Facturación generada por autor, comisiones pactadas (60-70%), cursos publicados y liquidaciones acumuladas.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                <span>Ver Creadores y Nómina</span>
                <ChevronRight size={14} />
              </div>
            </div>

            {/* Hub 4: Liquidaciones y Pagos */}
            <div
              className="admin-card"
              onClick={() => onTabChange && onTabChange('executive-audit')}
              style={{
                padding: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                border: '1px solid var(--color-light-border)',
                background: 'var(--color-card-bg)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={22} />
                </div>
                <span
                  className="badge-pill"
                  style={{
                    background: totalPendingSettlement > 0 ? 'rgba(217, 119, 6, 0.18)' : 'var(--color-success-light)',
                    color: totalPendingSettlement > 0 ? 'var(--color-warning)' : 'var(--color-success)',
                    fontWeight: 800,
                    fontSize: '0.74rem',
                  }}
                >
                  {totalPendingSettlement > 0 ? `$${totalPendingSettlement.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN Pendiente` : 'Al día'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-main)' }}>
                Liquidaciones y Pagos SPEI
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0 0 14px', lineHeight: 1.4 }}>
                Dispersión electrónica a creadores, comisiones retenidas vs pagadas y comprobantes oficiales de pago.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 800 }}>
                <span>Ir al Centro de Liquidaciones</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: TOP CURSOS MÁS VENDIDOS & MONITOR COMERCIAL */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {/* Column 1: Top 5 Cursos Más Vendidos */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                    Top Cursos Más Vendidos & Rentabilidad
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Ranking de cursos que más ingresos generan a la plataforma
                  </p>
                </div>
                <BarChart3 size={18} color="var(--color-primary)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {metrics.topSellingCourses.map((c, idx) => {
                  const maxRevenue = metrics.topSellingCourses[0].revenue;
                  const pct = Math.round((c.revenue / maxRevenue) * 100);

                  return (
                    <div
                      key={c.id}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: 'var(--color-light-bg)',
                        border: '1px solid var(--color-light-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <strong style={{ fontSize: '0.85rem', color: 'var(--color-text-main)', display: 'block' }}>
                            #{idx + 1} {c.title}
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            Autor: {c.instructor} · ★ {c.rating}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <strong style={{ fontSize: '0.92rem', color: 'var(--color-text-main)', display: 'block' }}>
                            ${c.revenue.toLocaleString('es-MX')} MXN
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                            {c.sales} ventas
                          </span>
                        </div>
                      </div>

                      {/* Revenue Bar - Solid #3B82F6 on #1E293B Track */}
                      <div style={{ height: '6px', background: 'var(--color-table-header-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#3B82F6', borderRadius: '3px' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Monitor Comercial & Rendimiento de Campañas */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                    Monitor Comercial & Campañas
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Métricas clave de conversión, cupones y liquidaciones
                  </p>
                </div>
                <Tag size={18} color="var(--color-primary)" />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Cupones Activos */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'var(--color-light-bg)',
                    border: '1px solid var(--color-light-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <Tag size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--color-text-main)' }}>Campañas Promocionales & Cupones</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>Sin Descuentos Activos</span>
                    </div>
                    <p style={{ margin: '0 0 4px', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      0 cupones de descuento aplicados este mes. El 100% de los $${(metrics.totalRevenue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN facturados corresponde a venta regular directa.
                    </p>
                  </div>
                </div>

                {/* Ticket Promedio */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'var(--color-light-bg)',
                    border: '1px solid var(--color-light-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <TrendingUp size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--color-text-main)' }}>Ticket Promedio de Compra</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', background: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700 }}>+8.4% Crecimiento</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      Ticket promedio de $${(metrics.averageTicket || metrics.avgTicket || 411.75).toFixed(2)} MXN calculado sobre las ${(metrics.coursesSold || 8)} ventas reales registradas en el catálogo.
                    </p>
                  </div>
                </div>

                {/* Permisos de Publicación y Solicitudes */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'var(--color-light-bg)',
                    border: '1px solid var(--color-light-border)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <ClipboardCheck size={20} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                        {pendingRequestsCount} Cursos en Revisión para Venta
                      </strong>
                      <span className="badge-pill badge-primary" style={{ fontSize: '0.7rem' }}>
                        Pendientes
                      </span>
                    </div>
                    <p style={{ margin: '0 0 8px', fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      Instructores sin permiso de publicación directa enviaron nuevos cursos para fijar precio y autorizar venta en tienda.
                    </p>
                    <button
                      type="button"
                      onClick={() => onTabChange && onTabChange('executive-requests')}
                      style={{
                        padding: '6px 14px',
                        background: '#2563EB',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-xs)',
                        transition: 'all 150ms ease',
                      }}
                    >
                      Revisar Solicitudes de Publicación ({pendingRequestsCount}) →
                    </button>
                  </div>
                </div>

                {/* Liquidación Docente */}
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid rgba(37, 99, 235, 0.25)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <CheckCircle2 size={20} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <strong style={{ fontSize: '0.84rem', color: 'var(--color-text-main)' }}>Dispersión de Comisiones al Día</strong>
                      <span style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 700 }}>Finanzas</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                      $${(metrics.instructorPayout || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN pagados a creadores vía SPEI. Saldo pendiente acumulado por liquidar: $${(totalPendingSettlement || metrics.pendingSettlement || 1976.40).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN: SOLICITUDES DE CURSOS (activeSection === 'executive-requests')     */}
      {/* ========================================================================= */}
      {activeSection === 'executive-requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header de la Sección */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                Solicitudes de Aprobación de Cursos
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Revisión comercial de cursos enviados por creadores sin permiso de publicación directa. Autoriza el precio de venta y habilita su disponibilidad en el catálogo oficial.
              </p>
            </div>


          </div>

          {/* Quick Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="mini-stat-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
              <div className="mini-stat-icon-wrap" style={{ background: 'rgba(217, 119, 6, 0.14)', color: 'var(--color-warning)' }}>
                <Clock size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Pendientes de Aprobación</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-text-main)' }}>
                  {pendingRequestsCount} cursos
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-warning)', fontWeight: 600 }}>Requieren revisión</div>
              </div>
            </div>

            <div className="mini-stat-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
              <div className="mini-stat-icon-wrap" style={{ background: 'rgba(5, 150, 105, 0.14)', color: 'var(--color-success)' }}>
                <CheckCircle2 size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Aprobados y a la Venta</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-success)' }}>
                  {courseRequests.filter((r) => r.status === 'approved').length + 5} cursos
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600 }}>En catálogo público</div>
              </div>
            </div>

            <div className="mini-stat-card" style={{ borderLeft: '4px solid var(--color-accent)' }}>
              <div className="mini-stat-icon-wrap" style={{ background: 'rgba(37, 99, 235, 0.14)', color: 'var(--color-accent)' }}>
                <Tag size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Precio Promedio Propuesto</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-text-main)' }}>
                  $190.00 MXN
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Ticket objetivo</div>
              </div>
            </div>

            <div className="mini-stat-card" style={{ borderLeft: '4px solid var(--color-secondary)' }}>
              <div className="mini-stat-icon-wrap" style={{ background: 'rgba(71, 85, 105, 0.14)', color: 'var(--color-secondary)' }}>
                <TrendingUp size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mini-stat-label">Facturación Potencial</div>
                <div className="mini-stat-value" style={{ color: 'var(--color-secondary)' }}>
                  ~$75,000 MXN
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 700 }}>Proyección estimada</div>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="admin-card" style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setRequestFilter('pending')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: requestFilter === 'pending' ? 'var(--color-warning)' : 'var(--color-light-bg)',
                  color: requestFilter === 'pending' ? '#0f172a' : 'var(--color-text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Pendientes ({pendingRequestsCount})
              </button>
              <button
                type="button"
                onClick={() => setRequestFilter('approved')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: requestFilter === 'approved' ? 'var(--color-success)' : 'var(--color-light-bg)',
                  color: requestFilter === 'approved' ? '#fff' : 'var(--color-text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Aprobados ({courseRequests.filter((r) => r.status === 'approved').length})
              </button>
              <button
                type="button"
                onClick={() => setRequestFilter('changes_requested')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: requestFilter === 'changes_requested' ? '#ef4444' : 'var(--color-light-bg)',
                  color: requestFilter === 'changes_requested' ? '#fff' : 'var(--color-text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Con Observaciones ({courseRequests.filter((r) => r.status === 'changes_requested').length})
              </button>
              <button
                type="button"
                onClick={() => setRequestFilter('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: requestFilter === 'all' ? 'var(--color-primary)' : 'var(--color-light-bg)',
                  color: requestFilter === 'all' ? '#fff' : 'var(--color-text-main)',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Todos ({courseRequests.length})
              </button>
            </div>

            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              Mostrando {filteredRequests.length} solicitudes
            </span>
          </div>

          {/* Requests List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredRequests.length === 0 ? (
              <div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>
                <Inbox size={42} color="var(--color-text-muted)" style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                <h4 style={{ margin: '0 0 6px', color: 'var(--color-text-main)', fontSize: '1.1rem' }}>
                  No hay solicitudes en esta categoría
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                  Las solicitudes nuevas enviadas por docentes aparecerán aquí para tu autorización.
                </p>
              </div>
            ) : (
              filteredRequests.map((course) => {
                const isPending = course.status === 'pending';
                const isApproved = course.status === 'approved';
                const isChanges = course.status === 'changes_requested';

                const creatorShare = (course.proposedPrice * (course.suggestedCommission / 100)).toFixed(2);
                const platformShare = (course.proposedPrice * ((100 - course.suggestedCommission) / 100)).toFixed(2);

                return (
                  <div
                    key={course.id}
                    className="admin-card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                      borderLeft: isPending ? '4px solid var(--color-warning)' : isApproved ? '4px solid var(--color-success)' : '4px solid #ef4444',
                    }}
                  >
                    {/* Top Row: Meta, Status & Submitted time */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="badge-pill badge-primary" style={{ fontSize: '0.72rem' }}>
                          {course.category}
                        </span>
                        <span className="badge-pill" style={{ background: 'var(--color-light-bg)', color: 'var(--color-text-main)', fontSize: '0.72rem' }}>
                          Nivel: {course.level}
                        </span>
                        <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                          Enviado: {course.submittedDate}
                        </span>
                      </div>

                      <div>
                        {isPending && (
                          <span className="badge-pill badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                            <Clock size={13} /> En espera de Aprobación
                          </span>
                        )}
                        {isApproved && (
                          <span className="badge-pill badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                            <CheckCircle2 size={13} /> Aprobado a la Venta (${course.finalPrice || course.proposedPrice} MXN)
                          </span>
                        )}
                        {isChanges && (
                          <span className="badge-pill badge-coral" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 800 }}>
                            <AlertCircle size={13} /> Con Observaciones
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Main Content: Thumbnail, Details, Price Box */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
                      {/* Left: Thumbnail & Instructor */}
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          style={{
                            width: '120px',
                            height: '80px',
                            borderRadius: '10px',
                            objectFit: 'cover',
                            border: '1px solid var(--color-light-border)',
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-main)' }}>
                            {course.title}
                          </h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <LetterAvatar name={course.instructorName} size={22} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                              {course.instructorName}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--color-text-muted)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {course.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Commercial Breakdown */}
                      <div
                        style={{
                          background: 'var(--color-light-bg)',
                          border: '1px solid var(--color-light-border)',
                          borderRadius: '10px',
                          padding: '14px 18px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                            Precio Propuesto
                          </span>
                          <strong style={{ fontSize: '1.35rem', color: 'var(--color-success)', display: 'block' }}>
                            ${course.proposedPrice.toFixed(2)} MXN
                          </strong>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {course.lessonsCount} lecciones · {course.durationHours} hrs
                          </span>
                        </div>

                        <div style={{ textAlign: 'right', borderLeft: '1px solid var(--color-light-border)', paddingLeft: '16px' }}>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>
                            Comisión ({course.suggestedCommission}%): <strong style={{ color: 'var(--color-text-main)' }}>${creatorShare}</strong>
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block' }}>
                            Plataforma ({100 - course.suggestedCommission}%): <strong style={{ color: 'var(--color-success)' }}>${platformShare}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Feedback note if changes requested */}
                    {isChanges && course.feedbackNotes && (
                      <div
                        style={{
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.25)',
                          fontSize: '0.78rem',
                          color: 'var(--color-text-main)',
                        }}
                      >
                        <strong style={{ color: '#ef4444' }}>Observaciones del Director ({course.feedbackReason}):</strong> {course.feedbackNotes}
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', borderTop: '1px solid var(--color-light-border)', paddingTop: '14px', flexWrap: 'wrap' }}>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Eye}
                        onClick={() => setSelectedCourseDetail(course)}
                      >
                        Ver Temario Completo
                      </Button>

                      {isPending && (
                        <>
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={XCircle}
                            onClick={() => handleOpenRejectionModal(course)}
                            style={{
                              borderColor: 'rgba(239, 68, 68, 0.35)',
                              color: '#ef4444',
                            }}
                          >
                            Solicitar Cambios
                          </Button>

                          <Button
                            variant="primary"
                            size="sm"
                            icon={CheckCircle2}
                            onClick={() => handleOpenApproveModal(course)}
                            style={{
                              background: 'linear-gradient(135deg, var(--color-success), var(--color-success))',
                              color: '#ffffff',
                              fontWeight: 800,
                            }}
                          >
                            Aprobar y Poner a la Venta
                          </Button>
                        </>
                      )}

                      {isApproved && (
                        <span style={{ fontSize: '0.76rem', color: 'var(--color-success)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Listo en Catálogo Comercial
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 2: INGRESOS Y FACTURACIÓN (activeSection === 'executive-financial') */}
      {/* ========================================================================= */}
      {activeSection === 'executive-financial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header de la Sección */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                Ingresos y Facturación
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Evolución de ventas brutas por curso, margen neto de la plataforma (40%), comisiones de creadores (60%) y embudo comercial.
              </p>
            </div>


          </div>

          {/* Main Chart Card */}
          <div className="admin-card" style={{ padding: '24px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-main)' }}>
                  Evolución Financiera: Ventas Brutas vs Comisión a Creadores
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                  Comparativa mensual del flujo de facturación, margen neto de la plataforma y comisiones pagadas a instructores.
                </p>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-primary)' }} />
                  Ventas Brutas Totales
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-success)' }} />
                  Margen Plataforma (40%)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--color-warning)' }} />
                  Comisión Creadores (60%)
                </span>
              </div>
            </div>

            {/* Interactive SVG Chart */}
            <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
              <div style={{ minWidth: '650px', height: '240px', position: 'relative' }}>
                <svg width="100%" height="220" viewBox="0 0 650 220" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="gradRevenue" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="gradMargin" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-success)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--color-success)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  {[0, 50, 100, 150, 200].map((y, idx) => (
                    <line key={idx} x1="40" y1={y} x2="630" y2={y} stroke="var(--color-light-border)" strokeDasharray="3 3" />
                  ))}

                  {/* Bars for Teacher Payout */}
                  {metrics.monthlyStats.map((item, idx) => {
                    const x = 55 + idx * 62;
                    const barHeight = (item.teacherPayout / 45000) * 180;
                    const y = 200 - barHeight;
                    const isSelected = selectedMonthIndex === idx;

                    return (
                      <g key={idx} onClick={() => setSelectedMonthIndex(idx)} style={{ cursor: 'pointer' }}>
                        <rect
                          x={x - 12}
                          y={y}
                          width="24"
                          height={barHeight}
                          fill={isSelected ? 'var(--color-warning)' : 'rgba(217, 119, 6, 0.45)'}
                          rx="4"
                        />
                        {/* Month Label */}
                        <text
                          x={x}
                          y={218}
                          textAnchor="middle"
                          fill={isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)'}
                          fontSize="11"
                          fontWeight={isSelected ? '800' : '500'}
                        >
                          {item.month}
                        </text>
                      </g>
                    );
                  })}

                  {/* Polyline for Net Margin */}
                  <polyline
                    fill="none"
                    stroke="var(--color-success)"
                    strokeWidth="3"
                    points={metrics.monthlyStats
                      .map((item, idx) => {
                        const x = 55 + idx * 62;
                        const y = 200 - (item.netMargin / 45000) * 180;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Polyline for Total Revenue */}
                  <polyline
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="3.5"
                    points={metrics.monthlyStats
                      .map((item, idx) => {
                        const x = 55 + idx * 62;
                        const y = 200 - (item.revenue / 45000) * 180;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Dots for Revenue */}
                  {metrics.monthlyStats.map((item, idx) => {
                    const x = 55 + idx * 62;
                    const y = 200 - (item.revenue / 45000) * 180;
                    const isSelected = selectedMonthIndex === idx;

                    return (
                      <circle
                        key={idx}
                        cx={x}
                        cy={y}
                        r={isSelected ? '6' : '4'}
                        fill="#ffffff"
                        stroke="var(--color-primary)"
                        strokeWidth={isSelected ? '3' : '2'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setSelectedMonthIndex(idx)}
                      />
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Selected Month Inspector */}
            <div
              style={{
                marginTop: '16px',
                padding: '14px 20px',
                background: 'var(--color-light-bg)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                border: '1px solid var(--color-light-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-pill badge-primary" style={{ fontWeight: 800 }}>
                  Mes: {currentMonthData.month} 2026
                </span>
                <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
                  Detalle del balance comercial
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.82rem' }}>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Ventas Brutas: </span>
                  <strong style={{ color: 'var(--color-primary)' }}>${(currentMonthData.revenue || 0).toLocaleString()} MXN</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Margen Academia (40%): </span>
                  <strong style={{ color: 'var(--color-success)' }}>${(currentMonthData.netMargin ?? currentMonthData.platformProfit ?? 0).toLocaleString()} MXN</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Comisión Creadores (60%): </span>
                  <strong style={{ color: 'var(--color-warning)' }}>${(currentMonthData.teacherPayout ?? currentMonthData.instructorPayout ?? 0).toLocaleString()} MXN</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--color-text-muted)' }}>Cursos Vendidos: </span>
                  <strong style={{ color: 'var(--color-text-main)' }}>{(currentMonthData.coursesSold ?? currentMonthData.sales ?? 0)} ventas</strong>
                </div>
              </div>
            </div>
          </div>

          {/* TWO COLUMNS: GRÁFICA DE BARRAS (EMBUDO) & GRÁFICA DE PASTEL (CATEGORÍAS) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* 1. GRÁFICA DE BARRAS: Embudo de Conversión de Ventas & Monetización */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                    Embudo de Conversión de Ventas & Monetización
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Gráfica de barras de avance: del tráfico en catálogo a compras cerradas
                  </p>
                </div>
                <span className="badge-pill badge-teal" style={{ fontWeight: 800 }}>
                  7.7% Conversión Global
                </span>
              </div>

              {/* Contenedor Gráfica de Barras SVG */}
              <div style={{ background: 'var(--color-light-bg)', borderRadius: '12px', padding: '16px 12px 10px', border: '1px solid var(--color-light-border)' }}>
                <svg viewBox="0 0 460 210" style={{ width: '100%', height: 'auto', display: 'block' }}>
                  {/* Grid Lines Horizontales */}
                  {[0, 25, 50, 75, 100].map((pct, idx) => {
                    const y = 170 - (pct / 100) * 135;
                    return (
                      <g key={idx}>
                        <line x1="45" y1={y} x2="445" y2={y} stroke="var(--color-light-border)" strokeDasharray="3 3" strokeWidth="1" />
                        <text x="38" y={y + 3} textAnchor="end" fontSize="9" fill="var(--color-text-muted)" fontWeight="600">
                          {pct}%
                        </text>
                      </g>
                    );
                  })}

                  {/* Barras Verticales del Embudo */}
                  {(metrics.salesConversionFunnel || []).map((stage, idx) => {
                    const barWidth = 62;
                    const x = 70 + idx * 95;
                    // Escala visual proporcional para asegurar visibilidad en las etapas finales
                    const visualHeight = Math.max(22, (stage.percentage / 100) * 135);
                    const y = 170 - visualHeight;

                    return (
                      <g key={idx} style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}>
                        {/* Barra */}
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={visualHeight}
                          fill={stage.color}
                          rx="6"
                          style={{
                            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.12))',
                            opacity: 0.92,
                          }}
                        />

                        {/* Etiqueta Superior de Conteo */}
                        <text
                          x={x + barWidth / 2}
                          y={y - 7}
                          textAnchor="middle"
                          fill="var(--color-text-main)"
                          fontSize="10"
                          fontWeight="800"
                        >
                          {stage.count >= 1000 ? `${(stage.count / 1000).toFixed(1)}k` : stage.count}
                        </text>

                        {/* Porcentaje dentro de la barra o sobre ella */}
                        <text
                          x={x + barWidth / 2}
                          y={visualHeight > 35 ? y + 16 : y - 18}
                          textAnchor="middle"
                          fill={visualHeight > 35 ? '#ffffff' : stage.color}
                          fontSize="10"
                          fontWeight="900"
                        >
                          {stage.percentage}%
                        </text>

                        {/* Nombre del eje X */}
                        <text
                          x={x + barWidth / 2}
                          y={188}
                          textAnchor="middle"
                          fill="var(--color-text-main)"
                          fontSize="9.5"
                          fontWeight="700"
                        >
                          {idx === 0 ? 'Visitas' : idx === 1 ? 'Carritos' : idx === 2 ? 'Compras' : 'Cupones'}
                        </text>
                        <text
                          x={x + barWidth / 2}
                          y={201}
                          textAnchor="middle"
                          fill="var(--color-text-muted)"
                          fontSize="8"
                          fontWeight="500"
                        >
                          {idx === 0 ? '100% Tráfico' : idx === 1 ? '20% Intención' : idx === 2 ? '38.5% Checkout' : 'Promocional'}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Leyenda y Detalle de Etapas */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', marginTop: '14px' }}>
                {(metrics.salesConversionFunnel || []).map((stage, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '8px',
                      background: 'var(--color-light-bg)',
                      border: '1px solid var(--color-light-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '2px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: stage.color }} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                        {stage.stage.split(' ')[0]} {stage.stage.split(' ')[1] || ''}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '2px' }}>
                      <strong style={{ fontSize: '0.84rem', color: stage.color }}>{stage.count.toLocaleString()}</strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>{stage.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cross-Selling Insight */}
              <div
                style={{
                  marginTop: '14px',
                  padding: '11px 13px',
                  borderRadius: '8px',
                  background: 'rgba(30, 64, 175, 0.08)',
                  border: '1px solid rgba(30, 64, 175, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.76rem',
                }}
              >
                <Sparkles size={18} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                <span style={{ color: 'var(--color-text-main)', lineHeight: 1.35 }}>
                  <strong style={{ color: 'var(--color-primary)' }}>Estrategia de Conversión:</strong> El 50.0% de los carritos agregados culminan en compra directa. Las ${(metrics.coursesSold || 8)} ventas se han consolidado a precio regular de catálogo ($${(metrics.totalRevenue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN) de forma orgánica.
                </span>
              </div>
            </div>

            {/* 2. GRÁFICA DE PASTEL (DONUT): Distribución de Ventas por Categoría */}
            <div className="admin-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: 'var(--color-text-main)' }}>
                    Distribución de Ventas por Categoría
                  </h3>
                  <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Gráfica de pastel de facturación total ($${(metrics.totalRevenue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN)
                  </p>
                </div>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(30, 64, 175, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PieChart size={18} />
                </div>
              </div>

              {/* Contenedor Gráfica de Pastel (Donut SVG) y Leyenda */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', padding: '10px 0' }}>
                {/* Donut SVG */}
                <div style={{ position: 'relative', width: '210px', height: '210px', flexShrink: 0 }}>
                  <svg viewBox="0 0 220 220" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Arcos de Categorías con strokeDasharray */}
                    {(() => {
                      const radius = 72;
                      const circumference = 2 * Math.PI * radius; // ~452.389
                      let cumulativeOffset = 0;

                      return (metrics.categoriesBreakdown || []).map((cat, idx) => {
                        const sliceLength = (cat.share / 100) * circumference;
                        const dashArray = `${sliceLength} ${circumference - sliceLength}`;
                        const offset = -cumulativeOffset;
                        cumulativeOffset += sliceLength;

                        return (
                          <circle
                            key={idx}
                            cx="110"
                            cy="110"
                            r={radius}
                            fill="transparent"
                            stroke={cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length]}
                            strokeWidth="32"
                            strokeDasharray={dashArray}
                            strokeDashoffset={offset}
                            style={{
                              transition: 'all 0.3s ease',
                              cursor: 'pointer',
                            }}
                          />
                        );
                      });
                    })()}
                  </svg>

                  {/* Centro del Pastel (Resumen de Facturación) */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>
                      Facturado
                    </span>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      ${((metrics.totalRevenue || 0) >= 1000 ? ((metrics.totalRevenue || 0) / 1000).toFixed(1) + "k" : (metrics.totalRevenue || 0).toFixed(0))}
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-success)' }}>
                      100% Catálogo
                    </span>
                  </div>
                </div>

                {/* Leyenda y Desglose Financiero */}
                <div style={{ flex: 1, minWidth: '190px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(metrics.categoriesBreakdown || []).map((cat, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-light-bg)',
                        border: '1px solid var(--color-light-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length], flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                            {cat.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            ${(cat.revenue || 0).toLocaleString('es-MX')} MXN
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: 900,
                          color: cat.color || CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: 'rgba(0,0,0,0.04)',
                        }}
                      >
                        {cat.share}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categoría Líder Info */}
              <div
                style={{
                  marginTop: '14px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'var(--color-light-bg)',
                  border: '1px solid var(--color-light-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.76rem',
                }}
              >
                <span style={{ color: 'var(--color-text-muted)' }}>
                  Categoría más rentable: <strong style={{ color: 'var(--color-primary)' }}>Desarrollo Web & Cloud (42%)</strong>
                </span>
                <span style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>
                  $104,433.00 MXN
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 3: PLANTILLA DE CREADORES (activeSection === 'executive-instructors') */}
      {/* ========================================================================= */}
      {activeSection === 'executive-instructors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header de la Sección */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                Plantilla de Creadores e Instructores
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Supervisión del cuerpo docente, esquemas de comisiones (60-70%), ventas generadas por autor y cursos publicados.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'var(--color-success-light)',
                  color: 'var(--color-success)',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                <Users size={14} /> {activeCount} Creadores Activos
              </span>

            </div>
          </div>

          {/* Top Control Bar */}
          <div className="admin-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px', maxWidth: '520px' }}>
              <div className="search-input-wrapper" style={{ width: '100%' }}>
                <Search size={17} className="search-input-icon" />
                <input
                  type="text"
                  placeholder="Buscar creador por nombre, especialidad o correo..."
                  value={instructorSearch}
                  onChange={(e) => setInstructorSearch(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={15} color="var(--color-text-muted)" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--color-light-border)',
                    background: 'var(--color-card-bg)',
                    color: 'var(--color-text-main)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                  }}
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activos</option>
                  <option value="review">En Revisión</option>
                  <option value="suspended">Suspendidos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Instructors Grid Cards */}
          {isLoadingInstructors ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 330px), 1fr))',
                gap: '1.25rem',
              }}
            >
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="admin-card"
                  style={{
                    padding: '22px',
                    minHeight: '260px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: 0.7,
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--color-light-border)', animation: 'pulse 1.5s infinite' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ width: '60%', height: '16px', background: 'var(--color-light-border)', borderRadius: '4px', marginBottom: '6px' }} />
                      <div style={{ width: '40%', height: '12px', background: 'var(--color-light-border)', borderRadius: '4px' }} />
                    </div>
                  </div>
                  <div style={{ height: '80px', background: 'var(--color-light-bg)', borderRadius: '10px', marginBottom: '16px' }} />
                  <div style={{ height: '36px', background: 'var(--color-light-border)', borderRadius: '8px' }} />
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 330px), 1fr))',
                gap: '1.25rem',
              }}
            >
              {filteredInstructors.map((inst) => {
              const isActive = inst.status === 'active';
              const isReview = inst.status === 'review';

              return (
                <div
                  key={inst.id}
                  className="admin-card"
                  style={{
                    padding: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    borderTop: isActive ? '4px solid var(--color-success)' : isReview ? '4px solid var(--color-warning)' : '4px solid #ef4444',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div>
                    {/* Header responsive layout (Avatar, Info, Status Badge) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 180px', minWidth: 0, cursor: 'pointer' }}
                        onClick={() => setSelectedProfileInstructor(inst)}
                        title="Ver Perfil Detallado del Instructor"
                      >
                        <LetterAvatar name={inst.name} size={52} />
                        <div style={{ minWidth: 0, flex: 1, wordBreak: 'break-word' }}>
                          <h4 style={{ margin: '0 0 2px', fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-main)', lineHeight: 1.25 }}>
                            {inst.name}
                          </h4>
                          <span style={{ fontSize: '0.76rem', color: 'var(--color-primary)', fontWeight: 700, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inst.title || 'Docente & Especialista'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inst.email}
                          </span>
                        </div>
                      </div>

                      {/* Status chip inline */}
                      <div style={{ flexShrink: 0 }}>
                        {isActive ? (
                          <span className="badge-pill badge-teal" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={12} /> Activo Titular
                          </span>
                        ) : isReview ? (
                          <span className="badge-pill badge-warning" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                            <Clock size={12} /> En Revisión
                          </span>
                        ) : (
                          <span className="badge-pill badge-coral" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <AlertTriangle size={12} /> Suspendido
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Specialty Pill */}
                    <div style={{ marginBottom: '16px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          background: 'var(--color-light-bg)',
                          border: '1px solid var(--color-light-border)',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--color-text-main)',
                        }}
                      >
                        🎯 {inst.specialty || 'Capacitación Profesional'}
                      </span>
                    </div>

                    {/* Performance metrics grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                        gap: '8px',
                        padding: '12px',
                        background: 'var(--color-light-bg)',
                        borderRadius: '10px',
                        border: '1px solid var(--color-light-border)',
                        textAlign: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                          Cursos
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                          {(inst.assignedCourses ?? inst.activeCourses ?? 0)}
                        </strong>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                          Compradores
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)' }}>
                          {(inst.totalStudents || 0).toLocaleString()}
                        </strong>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block' }}>
                          Valoración
                        </span>
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-warning)' }}>
                          ★ {(inst.averageRating ?? inst.rating ?? 5.0)}
                        </strong>
                      </div>
                    </div>

                    {/* Revenue & Commission scheme */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                      <div>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Facturación Bruta:</span>
                        <strong style={{ color: 'var(--color-success)', fontSize: '0.95rem' }}>
                          ${(inst.totalRevenue || 0).toLocaleString('es-MX')} MXN
                        </strong>
                      </div>

                      <div style={{ textAlign: 'right', marginLeft: 'auto' }}>
                        <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Esquema de Comisión:</span>
                        <span className="badge-pill badge-teal" style={{ fontWeight: 800, whiteSpace: 'nowrap' }}>
                          {(inst.commissionRate || 60)}% Creador / {100 - (inst.commissionRate || 60)}% Plataforma
                        </span>
                      </div>
                    </div>

                    {/* Active Permissions Badges Count */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', borderTop: '1px solid var(--color-light-border)', paddingTop: '10px' }}>
                      <span style={{ color: 'var(--color-text-muted)' }}>Permisos Comerciales:</span>
                      <strong style={{ color: 'var(--color-primary)' }}>
                        {inst.permissions?.length || 0} de {permissionsCatalog.length} activos
                      </strong>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Eye}
                      onClick={() => setSelectedProfileInstructor(inst)}
                      style={{ flex: '1 1 auto' }}
                    >
                      Ver Perfil
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit3}
                      onClick={() => openEditModal(inst)}
                      style={{ flex: '1 1 auto' }}
                    >
                      Comisión
                    </Button>

                    <Button
                      variant="primarySubtle"
                      size="sm"
                      icon={Lock}
                      onClick={() => onTabChange && onTabChange('executive-permissions')}
                      style={{ flex: '1 1 auto' }}
                    >
                      Permisos
                    </Button>

                    <button
                      type="button"
                      onClick={() => setDeletingInstructor(inst)}
                      title="Eliminar instructor"
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        background: 'rgba(239, 68, 68, 0.08)',
                        color: '#ef4444',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#ef4444';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 4: PERMISOS COMERCIALES & RBAC (activeSection === 'executive-permissions') */}
      {/* ========================================================================= */}
      {activeSection === 'executive-permissions' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header de la Sección */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                Permisos Comerciales & RBAC
              </h1>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Control comercial: define qué instructores pueden publicar cursos directamente a la venta, lanzar cupones de descuento mayor al 20% o modificar tarifas base.
              </p>
            </div>


          </div>

          {/* Header Info */}
          <div className="admin-card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: '0 0 4px', color: 'var(--color-text-main)' }}>
                  Matriz de Control Comercial de Instructores
                </h3>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                  Asigna o revoca capacidades de venta por creador en tiempo real. Los cambios aplican de inmediato en la tienda virtual.
                </p>
              </div>

              {/* Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-pill badge-coral" style={{ fontSize: '0.72rem' }}>
                  🔴 Alto: Impacto en precios / cupones
                </span>
                <span className="badge-pill badge-warning" style={{ fontSize: '0.72rem', background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
                  🟡 Medio: Gestión de cursos y ventas
                </span>
              </div>
            </div>

            {/* Matrix Table */}
            <div style={{ overflowX: 'auto', marginTop: '16px' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '220px' }}>Creador / Instructor</th>
                    {permissionsCatalog.map((perm) => (
                      <th key={perm.key} style={{ textAlign: 'center', minWidth: '130px', fontSize: '0.74rem' }}>
                        {perm.label}
                      </th>
                    ))}
                    <th style={{ textAlign: 'center', minWidth: '160px' }}>Presets Rápidos</th>
                  </tr>
                </thead>
                <tbody>
                  {instructors.map((inst) => {
                    const instPerms = inst.permissions || [];

                    return (
                      <tr key={inst.id}>
                        {/* Instructor Identity */}
                        <td>
                          <div
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                            onClick={() => setSelectedProfileInstructor(inst)}
                            title="Ver Perfil Detallado del Instructor"
                          >
                            <LetterAvatar name={inst.name} size={36} />
                            <div>
                              <strong style={{ color: 'var(--color-text-main)', display: 'block', fontSize: '0.84rem' }}>
                                {inst.name}
                              </strong>
                              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                {inst.specialty.split(',')[0]}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Permission Toggles */}
                        {permissionsCatalog.map((perm) => {
                          const hasPermission = instPerms.includes(perm.key);

                          return (
                            <td key={perm.key} style={{ textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => togglePermission(inst.id, perm.key)}
                                title={hasPermission ? `Revocar: ${perm.label}` : `Habilitar: ${perm.label}`}
                                style={{
                                  padding: '6px 12px',
                                  borderRadius: '20px',
                                  border: 'none',
                                  background: hasPermission ? 'var(--color-success-light)' : 'rgba(100, 116, 139, 0.12)',
                                  color: hasPermission ? 'var(--color-success)' : 'var(--color-text-muted)',
                                  fontSize: '0.76rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                {hasPermission ? (
                                  <>
                                    <Check size={13} /> Activo
                                  </>
                                ) : (
                                  <>
                                    <Lock size={12} /> Bloqueado
                                  </>
                                )}
                              </button>
                            </td>
                          );
                        })}

                        {/* Presets Column */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => applyPreset(inst.id, 'all')}
                              title="Conceder todos los permisos comerciales"
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--color-primary)',
                                background: 'var(--color-primary-light)',
                                color: 'var(--color-primary)',
                                fontSize: '0.74rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-xs)',
                                transition: 'all 150ms ease',
                              }}
                            >
                              Todo
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPreset(inst.id, 'standard')}
                              title="Preset estándar de creador"
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid var(--color-light-border)',
                                background: 'var(--color-table-header-bg)',
                                color: 'var(--color-text-main)',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-xs)',
                                transition: 'all 150ms ease',
                              }}
                            >
                              Estándar
                            </button>
                            <button
                              type="button"
                              onClick={() => applyPreset(inst.id, 'none')}
                              title="Bloquear todos los permisos comerciales"
                              style={{
                                padding: '5px 10px',
                                borderRadius: '6px',
                                border: '1px solid rgba(239, 68, 68, 0.35)',
                                background: 'rgba(239, 68, 68, 0.12)',
                                color: '#ef4444',
                                fontSize: '0.74rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: 'var(--shadow-xs)',
                                transition: 'all 150ms ease',
                              }}
                            >
                              Bloquear
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECCIÓN 5: LIQUIDACIONES Y PAGOS A CREADORES (activeSection === 'executive-audit') */}
      {/* ========================================================================= */}
      {activeSection === 'executive-audit' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Header de la Sección */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
                  Liquidaciones y Pagos a Creadores
                </h1>
                {pendingInstructors.length > 0 ? (
                  <span
                    style={{
                      background: 'var(--color-warning-light)',
                      color: 'var(--color-warning)',
                      border: '1px solid rgba(217, 119, 6, 0.35)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 0 10px var(--color-warning-light)',
                    }}
                  >
                    ● {pendingInstructors.length} pendientes por liquidar
                  </span>
                ) : (
                  <span
                    style={{
                      background: 'var(--color-success-light)',
                      color: 'var(--color-success)',
                      border: '1px solid rgba(5, 150, 105, 0.3)',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    ✓ Al día
                  </span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--color-text-muted)' }}>
                Centro de dispersión bancaria electrónica (SPEI), cálculo quincenal de comisiones y emisión de comprobantes fiscales.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>


              {totalPendingSettlement > 0 ? (
                <Button
                  variant="primary"
                  icon={CreditCard}
                  onClick={() => setIsBulkPayoutModalOpen(true)}
                  style={{
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    padding: '8px 20px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Liquidar Todo el Periodo (${totalPendingSettlement.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN)
                </Button>
              ) : (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    background: 'rgba(5, 150, 105, 0.1)',
                    color: 'var(--color-success)',
                    border: '1px solid rgba(5, 150, 105, 0.25)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                  }}
                >
                  <CheckCheck size={16} /> Creadores al Día (Sin Adeudos)
                </span>
              )}
            </div>
          </div>

          {/* 3 TARJETAS KPI FINANCIERAS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {/* Card 1: Total Dispersado */}
            <div
              className="admin-card"
              style={{
                padding: '20px 22px',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--color-card-bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
                  Total Dispersado a Creadores
                </span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-0.02em', marginBottom: '6px', fontVariantNumeric: 'tabular-nums' }}>
                ${(metrics.instructorPayout || totalDisbursedHistoric).toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>MXN</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                ✓ {settlementHistory.length} dispersiones SPEI autorizadas y liquidadas
              </p>
            </div>

            {/* Card 2: Saldo Pendiente por Liquidar */}
            <div
              className="admin-card"
              style={{
                padding: '20px 22px',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--color-card-bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
                  Saldo Pendiente por Liquidar
                </span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-badge-bg)', color: 'var(--color-badge-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-0.02em', marginBottom: '6px', fontVariantNumeric: 'tabular-nums' }}>
                ${totalPendingSettlement.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>MXN</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                  {pendingInstructors.length > 0
                    ? `● ${pendingInstructors.length} creadores con comisiones acumuladas`
                    : '✓ Todos los cortes quincenales cubiertos'}
                </p>
                {totalPendingSettlement > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsBulkPayoutModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--color-primary)',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0,
                    }}
                  >
                    Dispersar Lote →
                  </button>
                )}
              </div>
            </div>

            {/* Card 3: Margen Retenido de Plataforma */}
            <div
              className="admin-card"
              style={{
                padding: '20px 22px',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--color-card-bg)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
                  Margen Retenido de Plataforma
                </span>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={20} />
                </div>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-text-main)', letterSpacing: '-0.02em', marginBottom: '6px', fontVariantNumeric: 'tabular-nums' }}>
                ${(metrics.directorMargin || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-muted)' }}>MXN</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                Margen neto plataforma (~40%) en cuenta concentradora
              </p>
            </div>
          </div>

          {/* CONTENEDOR PRINCIPAL: PESTAÑAS Y TABLAS */}
          <div className="admin-card" style={{ padding: '20px 24px', borderRadius: '16px' }}>
            {/* Header de Pestañas y Buscador */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid var(--color-light-border)', paddingBottom: '18px', marginBottom: '20px' }}>
              {/* Barra Segmentada de Pestañas */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'var(--color-light-bg)',
                  padding: '4px',
                  borderRadius: '12px',
                  border: '1px solid var(--color-light-border)',
                  gap: '4px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSettlementTab('pending')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    background: settlementTab === 'pending' ? 'var(--color-primary)' : 'transparent',
                    color: settlementTab === 'pending' ? '#ffffff' : 'var(--color-text-muted)',
                    boxShadow: settlementTab === 'pending' ? '0 2px 8px rgba(30, 64, 175, 0.3)' : 'none',
                  }}
                >
                  <DollarSign size={15} />
                  Saldos Pendientes por Liquidar
                  {pendingInstructors.length > 0 && (
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.7rem',
                        fontWeight: 900,
                        background: settlementTab === 'pending' ? 'rgba(255,255,255,0.25)' : 'rgba(217, 119, 6, 0.2)',
                        color: settlementTab === 'pending' ? '#ffffff' : 'var(--color-warning)',
                      }}
                    >
                      {pendingInstructors.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setSettlementTab('history')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    background: settlementTab === 'history' ? 'var(--color-primary)' : 'transparent',
                    color: settlementTab === 'history' ? '#ffffff' : 'var(--color-text-muted)',
                    boxShadow: settlementTab === 'history' ? '0 2px 8px rgba(30, 64, 175, 0.3)' : 'none',
                  }}
                >
                  <Receipt size={15} />
                  Historial de Dispersiones SPEI ({settlementHistory.length})
                </button>

                <button
                  type="button"
                  onClick={() => setSettlementTab('bank_accounts')}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    background: settlementTab === 'bank_accounts' ? 'var(--color-primary)' : 'transparent',
                    color: settlementTab === 'bank_accounts' ? '#ffffff' : 'var(--color-text-muted)',
                    boxShadow: settlementTab === 'bank_accounts' ? '0 2px 8px rgba(30, 64, 175, 0.3)' : 'none',
                  }}
                >
                  <CreditCard size={15} />
                  Cuentas Bancarias Registradas ({instructors.length})
                </button>
              </div>

              {/* Buscador Rápido */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '260px' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={settlementSearch}
                    onChange={(e) => setSettlementSearch(e.target.value)}
                    placeholder={
                      settlementTab === 'pending'
                        ? 'Buscar creador o banco...'
                        : settlementTab === 'history'
                        ? 'Buscar por folio, instructor o clave...'
                        : 'Buscar cuenta, RFC o CLABE...'
                    }
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '10px',
                      border: '1px solid var(--color-light-border)',
                      background: 'var(--color-card-bg)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.82rem',
                      outline: 'none',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                  {settlementSearch && (
                    <button
                      type="button"
                      onClick={() => setSettlementSearch('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center' }}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {isLoadingInstructors ? (
              <div
                style={{
                  padding: '56px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '14px',
                }}
              >
                <Loader2 size={38} className="animate-spin" color="var(--color-primary)" />
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ margin: '0 0 4px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    Cargando saldos y dispersiones bancarias desde el servidor...
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Sincronizando cuentas concentradoras y comisiones acumuladas
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* TAB 1: SALDOS PENDIENTES POR LIQUIDAR */}
                {settlementTab === 'pending' && (
              <div>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--color-light-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.12)', borderBottom: '1px solid var(--color-light-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.71rem', letterSpacing: '0.06em' }}>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Creador / Instructor</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Banco & CLABE SPEI</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Ventas Brutas</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Comisión</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Ya Liquidado</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Saldo por Liquidar</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Estado</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructors
                        .filter((inst) => {
                          if (!settlementSearch) return true;
                          const q = settlementSearch.toLowerCase();
                          return (
                            inst.name.toLowerCase().includes(q) ||
                            (inst.bankInfo?.bank || '').toLowerCase().includes(q) ||
                            (inst.bankInfo?.clabe || '').includes(q)
                          );
                        })
                        .map((inst) => {
                          const hasPending = (inst.pendingBalance || 0) > 0;
                          return (
                            <tr
                              key={inst.id}
                              style={{
                                borderBottom: '1px solid var(--color-light-border)',
                                background: hasPending ? 'rgba(217, 119, 6, 0.03)' : 'transparent',
                                transition: 'background 0.15s ease',
                                verticalAlign: 'middle',
                              }}
                            >
                              {/* Creador */}
                              <td style={{ padding: '14px' }}>
                                <div
                                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                                  onClick={() => setSelectedProfileInstructor(inst)}
                                  title="Ver Perfil Detallado del Instructor"
                                >
                                  <LetterAvatar name={inst.name} size={36} />
                                  <div>
                                    <div style={{ fontWeight: 800, color: 'var(--color-text-main)', fontSize: '0.85rem' }}>
                                      {inst.name}
                                    </div>
                                    <div style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                                      {inst.specialty || 'Capacitación Profesional'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Banco y CLABE */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span
                                    style={{
                                      fontWeight: 800,
                                      color: 'var(--color-text-main)',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      fontSize: '0.82rem',
                                    }}
                                  >
                                    <Building2 size={13} color="var(--color-primary)" />
                                    {inst.bankInfo?.bank || 'BBVA México'}
                                  </span>
                                  <span
                                    style={{
                                      fontFamily: 'monospace',
                                      fontSize: '0.75rem',
                                      color: 'var(--color-text-muted)',
                                      fontWeight: 600,
                                    }}
                                    title={`CLABE Completa: ${inst.bankInfo?.clabe || 'No registrada'}`}
                                  >
                                    •••• •••• •••• {inst.bankInfo?.clabe ? inst.bankInfo.clabe.slice(-4) : '7890'}
                                  </span>
                                </div>
                              </td>

                              {/* Ventas Brutas */}
                              <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-text-main)', fontVariantNumeric: 'tabular-nums' }}>
                                ${(inst.totalRevenue || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                              </td>

                              {/* Comisión (Compact Badge Design) */}
                              <td style={{ padding: '14px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 8px',
                                      borderRadius: '6px',
                                      background: 'rgba(30, 64, 175, 0.08)',
                                      color: 'var(--color-primary)',
                                      border: '1px solid rgba(30, 64, 175, 0.2)',
                                      fontWeight: 800,
                                      fontSize: '0.74rem',
                                      whiteSpace: 'nowrap',
                                      width: 'fit-content',
                                    }}
                                  >
                                    {inst.commissionRate}% Creador
                                  </span>
                                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                    {100 - inst.commissionRate}% Academia
                                  </span>
                                </div>
                              </td>

                              {/* Total Ya Liquidado */}
                              <td style={{ padding: '14px', color: 'var(--color-text-muted)', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                                ${(inst.totalPaid || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                              </td>

                              {/* Saldo Pendiente */}
                              <td style={{ padding: '14px' }}>
                                {hasPending ? (
                                  <span
                                    style={{
                                      display: 'inline-block',
                                      padding: '4px 10px',
                                      borderRadius: '8px',
                                      background: 'rgba(59, 130, 246, 0.12)',
                                      color: 'var(--color-text-main)',
                                      border: '1px solid var(--color-light-border)',
                                      fontWeight: 900,
                                      fontSize: '0.86rem',
                                      fontVariantNumeric: 'tabular-nums',
                                    }}
                                  >
                                    ${(inst.pendingBalance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                                    $0.00 MXN
                                  </span>
                                )}
                              </td>

                              {/* Estado */}
                              <td style={{ padding: '14px' }}>
                                {hasPending ? (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '5px',
                                      padding: '3px 9px',
                                      borderRadius: '9999px',
                                      background: 'var(--color-warning-light)',
                                      color: 'var(--color-warning)',
                                      border: '1px solid rgba(217, 119, 6, 0.25)',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    ● Listo para pago
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      padding: '3px 9px',
                                      borderRadius: '9999px',
                                      background: 'rgba(5, 150, 105, 0.1)',
                                      color: 'var(--color-success)',
                                      fontSize: '0.72rem',
                                      fontWeight: 700,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    ✓ Al día
                                  </span>
                                )}
                              </td>

                              {/* Acción */}
                              <td style={{ padding: '14px', textAlign: 'right' }}>
                                {hasPending ? (
                                  <Button
                                    variant="primary"
                                    icon={DollarSign}
                                    onClick={() => handleOpenSettlementModal(inst)}
                                    style={{
                                      background: 'var(--color-primary)',
                                      color: '#ffffff',
                                      fontWeight: 800,
                                      fontSize: '0.78rem',
                                      padding: '6px 14px',
                                      borderRadius: '8px',
                                      boxShadow: 'var(--shadow-xs)',
                                    }}
                                  >
                                    Liquidar Saldo
                                  </Button>
                                ) : (
                                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                                    Sin adeudos
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {instructors.filter(inst => (inst.pendingBalance || 0) > 0).length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--color-light-bg)', borderRadius: '12px', marginTop: '16px', border: '1px dashed var(--color-light-border)' }}>
                    <CheckCircle2 size={42} color="var(--color-success)" style={{ margin: '0 auto 12px' }} />
                    <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                      ¡Todas las comisiones están 100% liquidadas!
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)' }}>
                      No hay saldos pendientes para dispersar en este momento. Las nuevas ventas acumuladas aplicarán en el próximo corte quincenal.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: HISTORIAL DE TRANSFERENCIAS SPEI */}
            {settlementTab === 'history' && (
              <div>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--color-light-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.12)', borderBottom: '1px solid var(--color-light-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.71rem', letterSpacing: '0.06em' }}>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Folio / Ref</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Fecha y Hora</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Creador Beneficiario</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Monto Liquidado</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Banco & CLABE</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Clave de Rastreo SPEI</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Estatus</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>Comprobante</th>
                      </tr>
                    </thead>
                    <tbody>
                      {settlementHistory
                        .filter((item) => {
                          if (!settlementSearch) return true;
                          const q = settlementSearch.toLowerCase();
                          return (
                            item.folio?.toLowerCase().includes(q) ||
                            item.instructorName?.toLowerCase().includes(q) ||
                            item.trackingKey?.toLowerCase().includes(q) ||
                            item.bankName?.toLowerCase().includes(q)
                          );
                        })
                        .map((item) => (
                          <tr
                            key={item.id}
                            style={{
                              borderBottom: '1px solid var(--color-light-border)',
                              transition: 'background 0.15s ease',
                              verticalAlign: 'middle',
                            }}
                          >
                            {/* Folio */}
                            <td style={{ padding: '14px' }}>
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontWeight: 800,
                                  fontSize: '0.76rem',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: 'var(--color-light-bg)',
                                  border: '1px solid var(--color-light-border)',
                                  color: 'var(--color-text-main)',
                                }}
                              >
                                {item.folio || item.id}
                              </span>
                            </td>

                            {/* Fecha */}
                            <td style={{ padding: '14px', color: 'var(--color-text-muted)', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                              {item.date}
                            </td>

                            {/* Creador */}
                            <td style={{ padding: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <LetterAvatar name={item.instructorName} size={30} />
                                <span style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>
                                  {item.instructorName}
                                </span>
                              </div>
                            </td>

                            {/* Monto */}
                            <td style={{ padding: '14px' }}>
                              <span style={{ fontWeight: 900, fontSize: '0.88rem', color: 'var(--color-success)', fontVariantNumeric: 'tabular-nums' }}>
                                ${Number(item.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                              </span>
                            </td>

                            {/* Banco y CLABE */}
                            <td style={{ padding: '14px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 700, color: 'var(--color-text-main)', fontSize: '0.78rem' }}>
                                  {item.bankName}
                                </span>
                                <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                  •••• {item.clabe ? item.clabe.slice(-4) : '0000'}
                                </span>
                              </div>
                            </td>

                            {/* Clave de Rastreo SPEI */}
                            <td style={{ padding: '14px' }}>
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  color: 'var(--color-primary)',
                                  background: 'rgba(30, 64, 175, 0.08)',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid rgba(30, 64, 175, 0.2)',
                                  display: 'inline-block',
                                }}
                              >
                                {item.trackingKey}
                              </span>
                            </td>

                            {/* Estatus y Recibo */}
                            <td style={{ padding: '14px' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '3px 8px',
                                    borderRadius: '9999px',
                                    background: 'var(--color-success-light)',
                                    color: 'var(--color-success)',
                                    border: '1px solid rgba(5, 150, 105, 0.25)',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    width: 'fit-content',
                                  }}
                                >
                                  <CheckCircle2 size={12} /> Liquidado
                                </span>
                                {item.receiptFileName && (
                                  <span
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      fontSize: '0.68rem',
                                      color: 'var(--color-primary)',
                                      fontWeight: 700,
                                    }}
                                    title={item.receiptFileName}
                                  >
                                    <Paperclip size={10} /> Recibo adjunto
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Comprobante */}
                            <td style={{ padding: '14px', textAlign: 'right' }}>
                              <Button
                                variant="secondary"
                                icon={Receipt}
                                onClick={() => setSelectedReceipt(item)}
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  padding: '5px 12px',
                                  borderRadius: '8px',
                                }}
                              >
                                Ver Recibo
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: CUENTAS BANCARIAS REGISTRADAS */}
            {settlementTab === 'bank_accounts' && (
              <div>
                <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--color-light-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.83rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(0,0,0,0.12)', borderBottom: '1px solid var(--color-light-border)', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontSize: '0.71rem', letterSpacing: '0.06em' }}>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Creador / Instructor</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>RFC Fiscal</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Tarjeta / CLABE</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Institución Bancaria</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Titular Registrado</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800 }}>Modalidad</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, textAlign: 'right' }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instructors
                        .filter((inst) => {
                          if (!settlementSearch) return true;
                          const q = settlementSearch.toLowerCase();
                          return (
                            inst.name.toLowerCase().includes(q) ||
                            (inst.bankInfo?.rfc || '').toLowerCase().includes(q) ||
                            (inst.bankInfo?.bank || '').toLowerCase().includes(q) ||
                            (inst.bankInfo?.clabe || '').includes(q)
                          );
                        })
                        .map((inst) => (
                          <tr
                            key={inst.id}
                            style={{
                              borderBottom: '1px solid var(--color-light-border)',
                              transition: 'background 0.15s ease',
                              verticalAlign: 'middle',
                            }}
                          >
                            <td style={{ padding: '14px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <LetterAvatar name={inst.name} size={34} />
                                <div>
                                  <div style={{ fontWeight: 800, color: 'var(--color-text-main)' }}>{inst.name}</div>
                                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{inst.email}</div>
                                </div>
                              </div>
                            </td>

                            <td style={{ padding: '14px' }}>
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontWeight: 800,
                                  fontSize: '0.76rem',
                                  color: 'var(--color-text-main)',
                                  background: 'var(--color-light-bg)',
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid var(--color-light-border)',
                                }}
                              >
                                {inst.bankInfo?.rfc || 'XAXX010101000'}
                              </span>
                            </td>

                            {/* Tarjeta / CLABE */}
                            <td style={{ padding: '14px' }}>
                              {inst.bankInfo?.noAplica ? (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: 'rgba(217, 119, 6, 0.14)',
                                    color: 'var(--color-warning)',
                                    border: '1px solid rgba(217, 119, 6, 0.3)',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                  }}
                                >
                                  ✓ No Aplica (Trato Directo)
                                </span>
                              ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <CreditCard size={13} color="var(--color-primary)" />
                                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: '0.78rem', color: 'var(--color-text-main)' }}>
                                      {inst.bankInfo?.cardNumber ? `•••• •••• •••• ${inst.bankInfo.cardNumber.slice(-4)}` : '•••• 9012'}
                                    </span>
                                  </div>
                                  <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                                    CLABE: •••• {inst.bankInfo?.clabe ? inst.bankInfo.clabe.slice(-4) : '7890'}
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Banco */}
                            <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-text-main)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Building2 size={14} color="var(--color-primary)" />
                                {inst.bankInfo?.noAplica ? 'N/A (Trato Especial)' : (inst.bankInfo?.bank || 'BBVA México')}
                              </div>
                            </td>

                            {/* Titular */}
                            <td style={{ padding: '14px', color: 'var(--color-text-main)', fontWeight: 600 }}>
                              {inst.bankInfo?.accountHolder || inst.name}
                            </td>

                            {/* Modalidad */}
                            <td style={{ padding: '14px' }}>
                              {inst.bankInfo?.noAplica ? (
                                <span style={{ fontSize: '0.74rem', color: 'var(--color-warning)', fontWeight: 700 }}>
                                  Convenio especial
                                </span>
                              ) : (
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '3px 8px',
                                    borderRadius: '9999px',
                                    background: 'var(--color-success-light)',
                                    color: 'var(--color-success)',
                                    border: '1px solid rgba(5, 150, 105, 0.25)',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                  }}
                                >
                                  <ShieldCheck size={12} /> Verificada
                                </span>
                              )}
                            </td>

                            <td style={{ padding: '14px', textAlign: 'right' }}>
                              <Button
                                variant="secondary"
                                icon={Edit3}
                                onClick={() => handleOpenBankEditModal(inst)}
                                style={{
                                  fontSize: '0.75rem',
                                  padding: '5px 10px',
                                  borderRadius: '8px',
                                }}
                              >
                                Editar Cta.
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: APROBAR CURSO Y DEFINIR PRECIO EN TIENDA                           */}
      {/* ========================================================================= */}
      {approvingCourse && (
        <ModalPortal isOpen={Boolean(approvingCourse)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setApprovingCourse(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '540px',
                width: '100%',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={24} color="var(--color-success)" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    Aprobar y Poner a la Venta
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setApprovingCourse(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleConfirmApproval} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--color-light-bg)', padding: '14px', borderRadius: '10px', border: '1px solid var(--color-light-border)' }}>
                  <strong style={{ fontSize: '0.95rem', color: 'var(--color-text-main)', display: 'block', marginBottom: '4px' }}>
                    {approvingCourse.title}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                    Instructor: {approvingCourse.instructorName} · {approvingCourse.category}
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, marginBottom: '6px' }}>
                    Precio Oficial de Venta en Tienda ($ MXN) *
                  </label>
                  <input
                    type="number"
                    min="49"
                    max="4999"
                    step="1"
                    value={approvalPrice}
                    onChange={(e) => setApprovalPrice(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)', fontSize: '1.1rem', fontWeight: 800 }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', display: 'block', marginTop: '4px' }}>
                    Precio propuesto por el autor: ${approvingCourse.proposedPrice.toFixed(2)} MXN
                  </span>
                </div>

                {/* Revenue split projection */}
                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(5, 150, 105, 0.08)', border: '1px solid rgba(5, 150, 105, 0.25)', fontSize: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Comisión Creador ({approvingCourse.suggestedCommission}%):</span>
                    <strong style={{ color: 'var(--color-text-main)' }}>${(Number(approvalPrice) * (approvingCourse.suggestedCommission / 100)).toFixed(2)} MXN</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Margen Plataforma ({100 - approvingCourse.suggestedCommission}%):</span>
                    <strong style={{ color: 'var(--color-success)' }}>${(Number(approvalPrice) * ((100 - approvingCourse.suggestedCommission) / 100)).toFixed(2)} MXN</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <Button type="button" variant="secondary" onClick={() => setApprovingCourse(null)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ background: 'linear-gradient(135deg, var(--color-success), var(--color-success))', color: '#fff', fontWeight: 800 }}
                  >
                    Publicar Inmediatamente en Tienda
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SOLICITAR CAMBIOS / OBSERVACIONES                                    */}
      {/* ========================================================================= */}
      {rejectionModalCourse && (
        <ModalPortal isOpen={Boolean(rejectionModalCourse)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setRejectionModalCourse(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '520px',
                width: '100%',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <XCircle size={22} color="#ef4444" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    Solicitar Cambios al Instructor
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRejectionModalCourse(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleConfirmRejection} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--color-light-bg)', padding: '12px', borderRadius: '8px', border: '1px solid var(--color-light-border)', fontSize: '0.82rem' }}>
                  <strong style={{ color: 'var(--color-text-main)', display: 'block' }}>{rejectionModalCourse.title}</strong>
                  <span style={{ color: 'var(--color-text-muted)' }}>Autor: {rejectionModalCourse.instructorName}</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Motivo Principal de la Revisión *
                  </label>
                  <select
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                  >
                    <option value="Ajuste de precio sugerido">Ajuste de precio sugerido (Muy alto / bajo)</option>
                    <option value="Contenido o temario incompleto">Contenido o temario incompleto</option>
                    <option value="Calidad de audio o video">Calidad de audio o video a mejorar</option>
                    <option value="Normas del catálogo comercial">No cumple normas de portada o descripción</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Notas y Recomendaciones para el Creador *
                  </label>
                  <textarea
                    rows={4}
                    value={rejectionNotes}
                    onChange={(e) => setRejectionNotes(e.target.value)}
                    placeholder="Ejemplo: Se sugiere fijar el precio en $150 MXN o agregar 4 lecciones prácticas más para justificar los $185 propuestos."
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <Button type="button" variant="secondary" onClick={() => setRejectionModalCourse(null)}>
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ background: '#ef4444', color: '#fff', fontWeight: 800 }}
                  >
                    Enviar Observaciones al Docente
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DETALLE Y TEMARIO COMPLETO DEL CURSO EN REVISIÓN                   */}
      {/* ========================================================================= */}
      {selectedCourseDetail && (
        <ModalPortal isOpen={Boolean(selectedCourseDetail)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedCourseDetail(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '680px',
                width: '100%',
                maxHeight: '85vh',
                overflowY: 'auto',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <span className="badge-pill badge-primary" style={{ fontSize: '0.72rem', marginBottom: '6px', display: 'inline-block' }}>
                    {selectedCourseDetail.category} · {selectedCourseDetail.level}
                  </span>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.3rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
                    {selectedCourseDetail.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LetterAvatar name={selectedCourseDetail.instructorName} size={24} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                      {selectedCourseDetail.instructorName}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: 'var(--color-text-muted)' }}>
                      · Enviado {selectedCourseDetail.submittedDate}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCourseDetail(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Cover Image banner */}
              <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', height: '200px' }}>
                <img
                  src={selectedCourseDetail.coverImage}
                  alt={selectedCourseDetail.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--color-text-main)' }}>
                  Descripción del Curso
                </h4>
                <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {selectedCourseDetail.description}
                </p>
              </div>

              {/* Target Audience */}
              <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'var(--color-light-bg)', borderRadius: '8px', border: '1px solid var(--color-light-border)' }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--color-text-main)', display: 'block', marginBottom: '2px' }}>
                  🎯 Público Objetivo:
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  {selectedCourseDetail.targetAudience}
                </span>
              </div>

              {/* Structured Modules */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--color-text-main)' }}>
                  Estructura del Temario ({selectedCourseDetail.lessonsCount} lecciones · {selectedCourseDetail.durationHours} hrs)
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedCourseDetail.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'var(--color-light-bg)',
                        border: '1px solid var(--color-light-border)',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--color-text-main)',
                      }}
                    >
                      {mod}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Controls */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button variant="secondary" onClick={() => setSelectedCourseDetail(null)}>
                  Cerrar
                </Button>
                {selectedCourseDetail.status === 'pending' && (
                  <Button
                    variant="primary"
                    icon={CheckCircle2}
                    onClick={() => {
                      setSelectedCourseDetail(null);
                      handleOpenApproveModal(selectedCourseDetail);
                    }}
                    style={{ background: 'linear-gradient(135deg, var(--color-success), var(--color-success))', color: '#fff' }}
                  >
                    Aprobar Curso
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE PERFIL DETALLADO DEL INSTRUCTOR                                  */}
      {/* ========================================================================= */}
      {selectedProfileInstructor && (
        <ModalPortal isOpen={Boolean(selectedProfileInstructor)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedProfileInstructor(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '28px',
                borderRadius: '18px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
                color: 'var(--color-text-main)',
              }}
            >
              {/* Header Modal */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <LetterAvatar name={selectedProfileInstructor.name} size={64} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
                        {selectedProfileInstructor.name}
                      </h3>
                      <span
                        style={{
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background: selectedProfileInstructor.status === 'active'
                            ? 'rgba(59, 130, 246, 0.12)'
                            : 'var(--color-warning-light)',
                          color: selectedProfileInstructor.status === 'active'
                            ? 'var(--color-primary)'
                            : 'var(--color-warning)',
                          border: '1px solid var(--color-light-border)',
                        }}
                      >
                        {selectedProfileInstructor.status === 'active' ? '● Activo Titular' : 'En Revisión'}
                      </span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: '0.86rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                      {selectedProfileInstructor.title || selectedProfileInstructor.specialty || 'Docente & Especialista'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      {selectedProfileInstructor.email || 'instructor@masteracademy.com'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedProfileInstructor(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Dynamic Metrics Cards Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Facturación Bruta</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', fontWeight: 900 }}>
                    ${(selectedProfileInstructor.totalRevenue || 0).toLocaleString('es-MX')} MXN
                  </strong>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Saldo Pendiente</span>
                  <strong style={{ fontSize: '1.05rem', color: selectedProfileInstructor.pendingBalance > 0 ? 'var(--color-primary)' : 'var(--color-text-main)', fontWeight: 900 }}>
                    ${(selectedProfileInstructor.pendingBalance || 0).toLocaleString('es-MX')} MXN
                  </strong>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Compradores</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-text-main)', fontWeight: 900 }}>
                    {(selectedProfileInstructor.totalStudents || 0).toLocaleString()}
                  </strong>
                </div>

                <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Valoración</span>
                  <strong style={{ fontSize: '1.05rem', color: 'var(--color-warning)', fontWeight: 900 }}>
                    ★ {(selectedProfileInstructor.averageRating ?? selectedProfileInstructor.rating ?? 5.0)}
                  </strong>
                </div>
              </div>

              {/* Section 1: Datos de Comisiones & Esquema */}
              <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '12px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Percent size={16} color="var(--color-primary)" /> Esquema de Comisión & Contrato
                  </h4>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                    {selectedProfileInstructor.commissionRate || 60}% Creador / {100 - (selectedProfileInstructor.commissionRate || 60)}% Plataforma
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                  Este creador percibe el {selectedProfileInstructor.commissionRate || 60}% sobre cada venta neta registrada en el catálogo. Las dispersiones se procesan mediante transferencia SPEI.
                </p>
              </div>

              {/* Section 2: Datos Bancarios Registrados */}
              <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '12px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={16} color="var(--color-primary)" /> Cuenta Bancaria SPEI Registrada
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Institución Bancaria:</span>
                    <strong style={{ color: 'var(--color-text-main)' }}>
                      {selectedProfileInstructor.bankInfo?.bank || selectedProfileInstructor.bank_info?.bank || (selectedProfileInstructor.bankInfo?.noAplica ? 'N/A (Trato Especial)' : 'Sin Banco Registrado')}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>CLABE Interbancaria:</span>
                    <strong style={{ color: 'var(--color-text-main)', fontFamily: 'monospace' }}>
                      {selectedProfileInstructor.bankInfo?.clabe || selectedProfileInstructor.bank_info?.clabe || 'No registrada'}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>Titular de la Cuenta:</span>
                    <strong style={{ color: 'var(--color-text-main)' }}>
                      {selectedProfileInstructor.bankInfo?.accountHolder || selectedProfileInstructor.bankInfo?.holder || selectedProfileInstructor.bank_info?.account_holder || selectedProfileInstructor.name}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.72rem' }}>RFC / Identificación Fiscal:</span>
                    <strong style={{ color: 'var(--color-text-main)' }}>
                      {selectedProfileInstructor.bankInfo?.rfc || selectedProfileInstructor.bankInfo?.taxId || selectedProfileInstructor.bank_info?.rfc || selectedProfileInstructor.bank_info?.tax_id || 'Sin RFC registrado'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Section 2.5: Desglose de Ganancias por Cursos Impartidos */}
              {(() => {
                const instName = selectedProfileInstructor.name || '';
                const instFirstName = instName.split(' ')[0].toLowerCase();
                
                // Cursos vinculados del catálogo / solicitudes / ranking
                const topMatch = (metrics.topSellingCourses || []).filter((c) =>
                  c.instructor && c.instructor.toLowerCase().includes(instFirstName)
                );
                const reqMatch = (courseRequests || []).filter((c) =>
                  (c.instructorName && c.instructorName.toLowerCase().includes(instFirstName)) ||
                  (c.instructor && c.instructor.toLowerCase().includes(instFirstName))
                );

                const courseMap = new Map();
                topMatch.forEach((c) => courseMap.set(c.id || c.title, c));
                reqMatch.forEach((c) => {
                  if (!courseMap.has(c.id || c.title)) {
                    courseMap.set(c.id || c.title, c);
                  }
                });

                let instructorCourses = Array.from(courseMap.values());

                // Si es un instructor activo con ingresos o cursos y no tiene cursos en el ranking rápido
                if (instructorCourses.length === 0) {
                  instructorCourses = [
                    {
                      id: 991,
                      title: `${selectedProfileInstructor.specialty || 'Capacitación Profesional'} - Curso Titular`,
                      price: 349,
                      sales: selectedProfileInstructor.totalStudents || 4,
                      revenue: selectedProfileInstructor.totalRevenue || 1396,
                      status: selectedProfileInstructor.status || 'active',
                    },
                  ];
                }

                const commissionRate = selectedProfileInstructor.commissionRate || 60;
                const teacherShareRatio = commissionRate / 100;
                const platformShareRatio = (100 - commissionRate) / 100;

                return (
                  <div style={{ marginBottom: '20px', padding: '16px', borderRadius: '12px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <BookOpen size={16} color="var(--color-primary)" /> Desglose de Ganancias por Cursos Impartidos ({instructorCourses.length})
                      </h4>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                        Comisión Pactada: {commissionRate}% Creador
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {instructorCourses.map((c, idx) => {
                        const gross = Number(c.revenue || (c.price * (c.sales || 0)) || 0);
                        const teacherEarnings = gross * teacherShareRatio;
                        const platformCut = gross * platformShareRatio;

                        return (
                          <div
                            key={idx}
                            style={{
                              padding: '12px 14px',
                              borderRadius: '10px',
                              background: 'var(--color-card-bg)',
                              border: '1px solid var(--color-light-border)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
                              <div>
                                <strong style={{ fontSize: '0.86rem', color: 'var(--color-text-main)', display: 'block' }}>
                                  #{idx + 1} {c.title || c.name}
                                </strong>
                                <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                                  Precio PVP: ${Number(c.price || c.proposedPrice || 349).toLocaleString('es-MX')} MXN • {(c.sales || c.totalStudents || 0)} Compradores / Alumnos
                                </span>
                              </div>
                              <span
                                style={{
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.7rem',
                                  fontWeight: 800,
                                  background: c.status === 'pending' ? 'var(--color-warning-light)' : 'rgba(59, 130, 246, 0.12)',
                                  color: c.status === 'pending' ? 'var(--color-warning)' : 'var(--color-primary)',
                                  border: '1px solid var(--color-light-border)',
                                }}
                              >
                                {c.status === 'pending' ? 'En Revisión' : 'Publicado en Tienda'}
                              </span>
                            </div>

                            {/* Triple split grid */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                                gap: '8px',
                                padding: '8px 12px',
                                background: 'var(--color-light-bg)',
                                borderRadius: '8px',
                                border: '1px solid var(--color-light-border)',
                                fontSize: '0.76rem',
                              }}
                            >
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>Facturado Bruto:</span>
                                <strong style={{ color: 'var(--color-text-main)', fontWeight: 800 }}>
                                  ${gross.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                </strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>Ganancia Creador ({commissionRate}%):</span>
                                <strong style={{ color: 'var(--color-primary)', fontWeight: 800 }}>
                                  ${teacherEarnings.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                </strong>
                              </div>
                              <div>
                                <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.68rem', textTransform: 'uppercase', fontWeight: 700 }}>Retención Academia ({100 - commissionRate}%):</span>
                                <strong style={{ color: 'var(--color-text-muted)', fontWeight: 700 }}>
                                  ${platformCut.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                                </strong>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Section 3: Permisos Comerciales RBAC */}
              <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'var(--color-light-bg)', border: '1px solid var(--color-light-border)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={16} color="var(--color-primary)" /> Capacidad Comercial (Permisos RBAC)
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {permissionsCatalog.map((perm) => {
                    const hasPerm = (selectedProfileInstructor.permissions || []).includes(perm.key);
                    return (
                      <span
                        key={perm.key}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          background: hasPerm ? 'var(--color-primary-light)' : 'var(--color-card-bg)',
                          color: hasPerm ? 'var(--color-primary)' : 'var(--color-text-muted)',
                          border: '1px solid var(--color-light-border)',
                        }}
                      >
                        {hasPerm ? <Check size={13} /> : <Lock size={12} />}
                        {perm.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setSelectedProfileInstructor(null)}
                >
                  Cerrar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  icon={Edit3}
                  onClick={() => {
                    const inst = selectedProfileInstructor;
                    setSelectedProfileInstructor(null);
                    openEditModal(inst);
                  }}
                >
                  Editar Comisión
                </Button>
                {selectedProfileInstructor.pendingBalance > 0 && (
                  <Button
                    type="button"
                    variant="primary"
                    icon={DollarSign}
                    onClick={() => {
                      const inst = selectedProfileInstructor;
                      setSelectedProfileInstructor(null);
                      handleOpenSettlementModal(inst);
                    }}
                  >
                    Liquidar Payout SPEI
                  </Button>
                )}
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE EDICIÓN DE PERFIL Y ESQUEMA DE COMISIÓN DE INSTRUCTOR             */}
      {/* ========================================================================= */}
      {editingInstructor && (
        <ModalPortal isOpen={Boolean(editingInstructor)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingInstructor(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '560px',
                width: '100%',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Edit3 size={22} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    Editar Perfil y Comisión de Creador
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingInstructor(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Nombre del Creador *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(p => ({ ...p, name: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Especialidad Comercial *
                  </label>
                  <input
                    type="text"
                    value={editForm.specialty}
                    onChange={(e) => setEditForm(p => ({ ...p, specialty: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Comisión Creador (%)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="90"
                      value={editForm.commissionRate}
                      onChange={(e) => setEditForm(p => ({ ...p, commissionRate: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      Retención plataforma: {100 - Number(editForm.commissionRate)}%
                    </span>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Estado del Creador
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                    >
                      <option value="active">Activo en Catálogo</option>
                      <option value="review">En Revisión de Cursos</option>
                      <option value="suspended">Venta Pausada</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <Button type="button" variant="secondary" onClick={() => setEditingInstructor(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary">
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE INSTRUCTOR                       */}
      {/* ========================================================================= */}
      {deletingInstructor && (
        <ModalPortal isOpen={Boolean(deletingInstructor)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeletingInstructor(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '460px',
                width: '100%',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
                color: 'var(--color-text-main)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={26} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    ¿Eliminar Instructor?
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Confirmación de baja definitiva de la plataforma
                  </p>
                </div>
              </div>

              <div
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-light-border)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
                  {deletingInstructor.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  {deletingInstructor.email || 'instructor@masteracademy.com'} • {deletingInstructor.title || 'Docente'}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', fontWeight: 600, marginTop: '6px' }}>
                  Comisión: {deletingInstructor.commissionRate || 70}% • Saldo acumulado: ${Number(deletingInstructor.pendingBalance || 0).toLocaleString()} MXN
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '24px' }}>
                Al dar de baja a este instructor, se revocará su acceso al panel de docentes y sus cursos dejarán de recibir nuevas asignaciones. Esta acción no se puede deshacer.
              </p>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  onClick={() => setDeletingInstructor(null)}
                >
                  Cancelar
                </Button>

                <button
                  type="button"
                  onClick={confirmDeleteInstructor}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#ef4444',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                  }}
                >
                  <Trash2 size={16} />
                  Sí, Dar de baja
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PROCESAR DISPERSIÓN BANCARIA SPEI A CREADOR                      */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {settlingInstructor && (
        <ModalPortal isOpen={Boolean(settlingInstructor)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSettlingInstructor(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '580px',
                width: '100%',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={22} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                      Procesar Dispersión Bancaria SPEI
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Liquidación de comisiones realizada por fuera (transferencia bancaria externa)
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSettlingInstructor(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Creator & Bank Summary Card */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'var(--color-light-bg)',
                  border: '1px solid var(--color-light-border)',
                  marginBottom: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <LetterAvatar name={settlingInstructor.name} size={42} />
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--color-text-main)' }}>
                      {settlingInstructor.name}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                      RFC: <strong style={{ color: 'var(--color-text-main)', fontFamily: 'monospace' }}>{settlingInstructor.bankInfo?.rfc || 'XAXX010101000'}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(30, 64, 175, 0.1)',
                      color: 'var(--color-primary)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                    }}
                  >
                    <Building2 size={12} /> {settlingInstructor.bankInfo?.bank || 'BBVA México'}
                  </span>
                  <div style={{ fontSize: '0.72rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', marginTop: '3px' }}>
                    CLABE: {settlingInstructor.bankInfo?.clabe || '012180001234567890'}
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleExecutePayout} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Monto a transferir */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                      Monto a Liquidar (MXN) *
                    </label>
                    <button
                      type="button"
                      onClick={() => setPayoutAmount(settlingInstructor.pendingBalance || 0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Liquidar saldo total (${(settlingInstructor.pendingBalance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN)
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                      $
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      max={settlingInstructor.pendingBalance || 999999}
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 30px',
                        borderRadius: '8px',
                        border: '2px solid rgba(5, 150, 105, 0.4)',
                        background: 'var(--color-card-bg)',
                        color: 'var(--color-text-main)',
                        fontSize: '1.2rem',
                        fontWeight: 900,
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                    Saldo actual acumulado: ${(settlingInstructor.pendingBalance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>

                {/* Clave de Rastreo SPEI y Concepto */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Clave de Rastreo SPEI
                    </label>
                    <input
                      type="text"
                      value={payoutTrackingKey}
                      onChange={(e) => setPayoutTrackingKey(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '9px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-light-border)',
                        background: 'var(--color-card-bg)',
                        color: 'var(--color-text-main)',
                        fontFamily: 'monospace',
                        fontSize: '0.76rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                      Cuenta de Origen Concentradora
                    </label>
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-light-bg)',
                        border: '1px solid var(--color-light-border)',
                        fontSize: '0.75rem',
                        color: 'var(--color-text-main)',
                        fontWeight: 600,
                      }}
                    >
                      BBVA Corp •••• 4492 (Master Academy)
                    </div>
                  </div>
                </div>

                {/* Concepto de Pago */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-text-main)' }}>
                    Concepto de Pago (SPEI)
                  </label>
                  <input
                    type="text"
                    value={payoutConcept}
                    onChange={(e) => setPayoutConcept(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-light-border)',
                      background: 'var(--color-card-bg)',
                      color: 'var(--color-text-main)',
                      fontSize: '0.82rem',
                    }}
                  />
                </div>

                {/* Campo para Subir el Recibo de Transferencia Bancaria (Pago por Fuera) */}
                <div style={{ padding: '14px', borderRadius: '10px', background: 'var(--color-light-bg)', border: '1.5px dashed var(--color-light-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Paperclip size={15} color="var(--color-primary)" />
                      Comprobante / Recibo de Transferencia Externa *
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                      Pago hecho por fuera
                    </span>
                  </div>

                  {transferReceiptFile ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'rgba(5, 150, 105, 0.1)',
                        border: '1px solid rgba(5, 150, 105, 0.3)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <CheckCircle2 size={18} color="var(--color-success)" />
                        <div>
                          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                            {transferReceiptFile.name}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {transferReceiptFile.size} • Comprobante adjuntado con éxito
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setTransferReceiptFile(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          textDecoration: 'underline',
                        }}
                      >
                        Cambiar archivo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <label
                        htmlFor="transfer_receipt_file_input"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                          borderRadius: '8px',
                          background: 'var(--color-card-bg)',
                          border: '1px solid var(--color-light-border)',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <Upload size={22} color="var(--color-primary)" style={{ marginBottom: '6px' }} />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-primary)' }}>
                          Haz clic para subir el recibo de transferencia bancaria
                        </span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          Formatos: PDF, JPG, PNG o captura de pantalla de banca en línea
                        </span>
                      </label>
                      <input
                        id="transfer_receipt_file_input"
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleReceiptFileChange}
                        style={{ display: 'none' }}
                      />
                    </div>
                  )}
                </div>

                {/* Casilla de confirmación */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '14px 16px',
                    background: 'rgba(5, 150, 105, 0.08)',
                    borderRadius: '12px',
                    border: '1px solid rgba(5, 150, 105, 0.25)',
                    marginTop: '16px',
                  }}
                >
                  <input
                    type="checkbox"
                    id="confirm_treasury"
                    checked={payoutAuthorized}
                    onChange={(e) => setPayoutAuthorized(e.target.checked)}
                    required
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      flexShrink: 0,
                      accentColor: 'var(--color-success)',
                    }}
                  />
                  <label
                    htmlFor="confirm_treasury"
                    style={{
                      fontSize: '0.81rem',
                      color: 'var(--color-text-main)',
                      cursor: 'pointer',
                      lineHeight: 1.45,
                      fontWeight: 600,
                      userSelect: 'none',
                    }}
                  >
                    Confirmo que los fondos están verificados en la cuenta concentradora y autorizo la dispersión bancaria inmediata por <strong style={{ color: 'var(--color-success)', fontWeight: 900 }}>${Number(payoutAmount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong>.
                  </label>
                </div>

                {/* Botones de acción */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSettlingInstructor(null)}
                    disabled={isSubmittingPayout}
                    style={{ borderRadius: '10px', padding: '10px 18px', fontWeight: 700 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Send}
                    disabled={!payoutAuthorized || isSubmittingPayout}
                    isLoading={isSubmittingPayout}
                    style={{
                      background: payoutAuthorized
                        ? 'var(--color-primary)'
                        : 'var(--color-light-bg)',
                      color: payoutAuthorized ? '#ffffff' : 'var(--color-text-muted)',
                      borderRadius: '10px',
                      padding: '10px 22px',
                      fontWeight: 800,
                      boxShadow: payoutAuthorized ? 'var(--shadow-sm)' : 'none',
                      opacity: payoutAuthorized ? 1 : 0.5,
                      cursor: payoutAuthorized && !isSubmittingPayout ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Confirmar Dispersión SPEI (${Number(payoutAmount || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN)
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LIQUIDACIÓN MASIVA DEL PERIODO (BULK PAYOUT)                     */}
      {/* ========================================================================= */}
      {isBulkPayoutModalOpen && (
        <ModalPortal isOpen={isBulkPayoutModalOpen}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsBulkPayoutModalOpen(false);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '620px',
                width: '100%',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-success-light)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Banknote size={24} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                      Dispersión en Lote - Corte Quincenal
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
                      Liquidación simultánea de comisiones a todos los creadores con saldo acumulado
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsBulkPayoutModalOpen(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Lista de creadores a liquidar */}
              <div style={{ marginBottom: '18px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.04em', display: 'block', marginBottom: '8px' }}>
                  Transferencias Programadas ({pendingInstructors.length} Creadores)
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                  {pendingInstructors.map((inst) => (
                    <div
                      key={inst.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        background: 'var(--color-light-bg)',
                        border: '1px solid var(--color-light-border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <LetterAvatar name={inst.name} size={32} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.84rem', color: 'var(--color-text-main)' }}>
                            {inst.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                            {inst.bankInfo?.bank || 'BBVA'} •••• {inst.bankInfo?.clabe ? inst.bankInfo.clabe.slice(-4) : '7890'}
                          </div>
                        </div>
                      </div>

                      <span style={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--color-success)' }}>
                        ${(inst.pendingBalance || 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Card */}
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(5, 150, 105, 0.08)',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-success)' }}>
                    Total a Dispersar por Lote SPEI
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                    {pendingInstructors.length} órdenes bancarias electrónicas con comprobante individual
                  </div>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-success)', letterSpacing: '-0.02em' }}>
                  ${totalPendingSettlement.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '0.85rem' }}>MXN</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <Button type="button" variant="secondary" onClick={() => setIsBulkPayoutModalOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  icon={Send}
                  onClick={handleExecuteBulkPayout}
                  style={{
                    background: 'var(--color-primary)',
                    color: '#ffffff',
                    borderRadius: '10px',
                    padding: '10px 22px',
                    fontWeight: 800,
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Ejecutar Dispersión Masiva (${totalPendingSettlement.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN)
                </Button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: COMPROBANTE OFICIAL DE PAGO DIGITAL SPEI                         */}
      {/* ========================================================================= */}
      {selectedReceipt && (
        <ModalPortal isOpen={Boolean(selectedReceipt)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setSelectedReceipt(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '640px',
                width: '100%',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
                position: 'relative',
              }}
            >
              {/* Header de Recibo */}
              <div style={{ borderBottom: '2px dashed var(--color-light-border)', paddingBottom: '18px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                      Master Academy S.A.P.I. de C.V.
                    </span>
                    <h2 style={{ margin: '2px 0 0', fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
                      Comprobante Electrónico de Pago (SPEI)
                    </h2>
                    <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                      RFC Emisor: MAC210815AB3 • Régimen General de Personas Morales
                    </span>
                  </div>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: 'var(--color-success-light)',
                      color: 'var(--color-success)',
                      border: '1px solid rgba(5, 150, 105, 0.3)',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                    }}
                  >
                    <CheckCircle2 size={13} /> LIQUIDADO
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '8px', fontSize: '0.76rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Folio Operación:</span>{' '}
                    <strong style={{ color: 'var(--color-text-main)', fontFamily: 'monospace' }}>{selectedReceipt.folio || selectedReceipt.id}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-text-muted)' }}>Fecha y Hora:</span>{' '}
                    <strong style={{ color: 'var(--color-text-main)' }}>{selectedReceipt.date}</strong>
                  </div>
                </div>
              </div>

              {/* Comprobante de Transferencia Externa Adjunto */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  background: 'rgba(30, 64, 175, 0.07)',
                  border: '1px solid rgba(30, 64, 175, 0.25)',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(30, 64, 175, 0.14)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Paperclip size={18} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.04em' }}>
                      Recibo de Transferencia Externa Adjunto
                    </span>
                    <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                      {selectedReceipt.receiptFileName || 'comprobante_bancario_transferencia.pdf'}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: 'var(--color-success-light)',
                    color: 'var(--color-success)',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                  }}
                >
                  <CheckCircle2 size={13} /> Pago Realizado por Fuera
                </span>
              </div>

              {/* Importe Central */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px',
                  borderRadius: '12px',
                  background: 'var(--color-light-bg)',
                  border: '1px solid var(--color-light-border)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Importe Liquidado
                </div>
                <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--color-success)', letterSpacing: '-0.02em', margin: '4px 0' }}>
                  ${Number(selectedReceipt.amount).toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span style={{ fontSize: '1rem', fontWeight: 700 }}>MXN</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                  Moneda Nacional Mexicana • Sin retención adicional aplicada
                </div>
              </div>

              {/* Datos de la Transferencia */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-light-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Beneficiario:</span>
                  <strong style={{ color: 'var(--color-text-main)' }}>{selectedReceipt.instructorName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-light-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>RFC Beneficiario:</span>
                  <strong style={{ color: 'var(--color-text-main)', fontFamily: 'monospace' }}>{selectedReceipt.rfc || 'XAXX010101000'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-light-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Banco Receptor:</span>
                  <strong style={{ color: 'var(--color-text-main)' }}>{selectedReceipt.bankName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-light-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Cuenta / CLABE:</span>
                  <strong style={{ color: 'var(--color-text-main)', fontFamily: 'monospace' }}>{selectedReceipt.clabe}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-light-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Clave de Rastreo SPEI:</span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      color: 'var(--color-primary)',
                      background: 'rgba(30, 64, 175, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                    }}
                  >
                    {selectedReceipt.trackingKey}
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--color-light-border)' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Concepto:</span>
                  <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{selectedReceipt.concept}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Autorizado por:</span>
                  <span style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>{selectedReceipt.authorizedBy}</span>
                </div>
              </div>

              {/* Sello Digital */}
              <div style={{ padding: '10px 12px', background: 'var(--color-light-bg)', borderRadius: '8px', border: '1px solid var(--color-light-border)', marginBottom: '20px' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                  Sello Digital de Autenticidad (SHA-256)
                </span>
                <span style={{ fontSize: '0.66rem', fontFamily: 'monospace', color: 'var(--color-text-muted)', wordBreak: 'break-all', lineHeight: 1.3, display: 'block' }}>
                  ||2026/10/01|SPEI|{selectedReceipt.trackingKey}|{selectedReceipt.amount}|{selectedReceipt.rfc}||e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855||
                </span>
              </div>

              {/* Footer Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                <Button variant="primary" onClick={() => setSelectedReceipt(null)}>
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: EDITAR DATOS BANCARIOS DEL CREADOR                                */}
      {/* ========================================================================= */}
      {editingBankInstructor && (
        <ModalPortal isOpen={Boolean(editingBankInstructor)}>
          <div
            className="modal-overlay-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) setEditingBankInstructor(null);
            }}
          >
            <div
              className="modal-content-card animate-scale-up"
              style={{
                maxWidth: '540px',
                width: '100%',
                padding: '28px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-xl)',
                background: 'var(--color-card-bg)',
                border: '1px solid var(--color-light-border)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building2 size={22} color="var(--color-primary)" />
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    Editar Datos Bancarios de Creador
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingBankInstructor(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBankEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Botón / Toggle No Aplica (Trato Directo) */}
                <div style={{ padding: '12px 14px', borderRadius: '8px', background: bankEditForm.noAplica ? 'var(--color-warning-light)' : 'var(--color-light-bg)', border: bankEditForm.noAplica ? '1.5px solid rgba(217, 119, 6, 0.4)' : '1px solid var(--color-light-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '0.84rem', color: bankEditForm.noAplica ? 'var(--color-warning)' : 'var(--color-text-main)', display: 'block' }}>
                      {bankEditForm.noAplica ? '✓ Modo "No Aplica" Activo (Trato Directo)' : '¿Este creador tiene otro trato comercial?'}
                    </strong>
                    <span style={{ fontSize: '0.73rem', color: 'var(--color-text-muted)' }}>
                      Omite el registro de tarjeta y cuenta bancaria para liquidación.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setBankEditForm(p => ({ ...p, noAplica: !p.noAplica }))}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: bankEditForm.noAplica ? 'var(--color-warning)' : 'var(--color-card-bg)',
                      color: bankEditForm.noAplica ? '#ffffff' : 'var(--color-text-main)',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    {bankEditForm.noAplica ? 'Desactivar No Aplica' : 'Marcar "No Aplica"'}
                  </button>
                </div>

                {bankEditForm.noAplica ? (
                  <div style={{ padding: '14px', borderRadius: '8px', background: 'rgba(217, 119, 6, 0.06)', border: '1px dashed rgba(217, 119, 6, 0.3)' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '6px', color: 'var(--color-warning)' }}>
                      Motivo o Tipo de Convenio Especial
                    </label>
                    <input
                      type="text"
                      value={bankEditForm.noAplicaReason}
                      onChange={(e) => setBankEditForm(p => ({ ...p, noAplicaReason: e.target.value }))}
                      placeholder="Ej. Convenio corporativo directo / Facturación mensual externa"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                    />
                  </div>
                ) : (
                  <>
                    {/* Número de Tarjeta */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                        Número de Tarjeta (16 dígitos) *
                      </label>
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4152 3134 5678 9012"
                        value={bankEditForm.cardNumber}
                        onChange={(e) => setBankEditForm(p => ({ ...p, cardNumber: e.target.value }))}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)', fontFamily: 'monospace', fontSize: '0.88rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                        Institución Bancaria *
                      </label>
                  <select
                    value={bankEditForm.bank}
                    onChange={(e) => setBankEditForm((p) => ({ ...p, bank: e.target.value }))}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                  >
                    <option value="BBVA México">BBVA México</option>
                    <option value="Santander">Santander</option>
                    <option value="Banorte">Banorte</option>
                    <option value="Citibanamex">Citibanamex</option>
                    <option value="HSBC México">HSBC México</option>
                    <option value="Scotiabank">Scotiabank</option>
                    <option value="Inbursa">Inbursa</option>
                    <option value="BanRegio">BanRegio</option>
                    <option value="Mercado Pago Wallet">Mercado Pago Wallet</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    CLABE Interbancaria (18 dígitos) *
                  </label>
                  <input
                    type="text"
                    maxLength={18}
                    pattern="[0-9]{18}"
                    value={bankEditForm.clabe}
                    onChange={(e) => setBankEditForm((p) => ({ ...p, clabe: e.target.value.replace(/[^0-9]/g, '') }))}
                    placeholder="18 dígitos numéricos"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)', fontFamily: 'monospace' }}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                    {bankEditForm.clabe.length}/18 dígitos requeridos por el Sistema SPEI (Banxico)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      RFC Fiscal *
                    </label>
                    <input
                      type="text"
                      maxLength={13}
                      value={bankEditForm.rfc}
                      onChange={(e) => setBankEditForm((p) => ({ ...p, rfc: e.target.value.toUpperCase() }))}
                      required
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                      Tipo de Cuenta
                    </label>
                    <select
                      value={bankEditForm.accountType}
                      onChange={(e) => setBankEditForm((p) => ({ ...p, accountType: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                    >
                      <option value="Débito / Tarjeta">Débito / Tarjeta</option>
                      <option value="Cheques / Nómina">Cheques / Nómina</option>
                      <option value="Cuenta Digital">Cuenta Digital</option>
                      <option value="Cuenta Premier">Cuenta Premier</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>
                    Titular de la Cuenta *
                  </label>
                  <input
                    type="text"
                    value={bankEditForm.accountHolder}
                    onChange={(e) => setBankEditForm((p) => ({ ...p, accountHolder: e.target.value }))}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--color-light-border)', background: 'var(--color-card-bg)', color: 'var(--color-text-main)' }}
                  />
                </div>
                  </>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <Button type="button" variant="secondary" onClick={() => setEditingBankInstructor(null)}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary">
                    Guardar Datos Bancarios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ModalPortal>
      )}
    </div>
  );
}

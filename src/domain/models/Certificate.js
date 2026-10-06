export class Certificate {
  constructor({
    id,
    uid,
    uuid,
    verification_uuid,
    folio,
    studentName,
    recipient_name,
    studentEmail,
    email,
    studentId,
    user_id,
    courseTitle,
    course_title,
    courseId,
    course_id,
    courseHours = 20,
    course_hours,
    issuedDate = null,
    issued_at = null,
    grade = '95/100',
    status = 'issued',
    qr_code_url = null,
    metadata = {}
  }) {
    this.id = id || `cert_${Date.now()}`;
    this.uid = uid || uuid || verification_uuid || `MA-${Date.now()}`;
    this.uuid = verification_uuid || uuid || uid || this.uid;
    this.folio = folio || `CERT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    this.studentName = studentName || recipient_name || metadata?.student_name || 'Estudiante';
    this.studentEmail = studentEmail || email || metadata?.student_email || '';
    this.studentId = studentId || user_id || null;
    this.courseTitle = courseTitle || course_title || 'Programa Formativo';
    this.courseId = courseId || course_id || null;
    this.courseHours = courseHours || course_hours || 20;
    this.issuedDate = (issuedDate || issued_at || new Date().toISOString()).split('T')[0];
    this.issued_at = issued_at || issuedDate || new Date().toISOString();
    this.grade = grade || metadata?.grade || '95/100';
    this.status = (status === 'issued' || status === 'valid') ? 'valid' : 'revoked';
    this.backendStatus = status;
    this.qr_code_url = qr_code_url || `https://masteracademy.mx/verify/${this.uuid}`;
    this.metadata = metadata;
  }
}
export class Inquiry {
  constructor({
    id,
    studentName,
    studentAvatar,
    courseId,
    courseTitle,
    lessonTitle,
    subject,
    message,
    status = 'pending',
    reply = null,
    createdAt = null
  }) {
    this.id = id;
    this.studentName = studentName;
    this.studentAvatar = studentAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120';
    this.courseId = courseId;
    this.courseTitle = courseTitle;
    this.lessonTitle = lessonTitle || 'Consulta General del Curso';
    this.subject = subject;
    this.message = message;
    this.status = status; // 'pending' | 'answered'
    this.reply = reply;
    this.createdAt = createdAt || new Date().toISOString();
  }
}
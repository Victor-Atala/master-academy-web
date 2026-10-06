export class StudentEnrollment {
  constructor({
    id,
    studentId,
    studentName,
    email,
    avatar,
    courseId,
    courseTitle,
    progressPercentage = 0,
    completedLessons = 0,
    totalLessons = 1,
    enrolledAt = null,
    lastActiveAt = null
  }) {
    this.id = id;
    this.studentId = studentId;
    this.studentName = studentName;
    this.email = email;
    this.avatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120';
    this.courseId = courseId;
    this.courseTitle = courseTitle;
    this.progressPercentage = Number(progressPercentage) || 0;
    this.completedLessons = Number(completedLessons) || 0;
    this.totalLessons = Number(totalLessons) || 1;
    this.enrolledAt = enrolledAt || new Date().toISOString().split('T')[0];
    this.lastActiveAt = lastActiveAt || 'Hoy';
  }

  get isGraduated() {
    return this.progressPercentage >= 100;
  }
}
export class Quiz {
  constructor({
    id,
    courseId,
    courseTitle = '',
    moduleId = null,
    moduleTitle = '',
    title,
    description = '',
    isFinal = false,
    passingScore = 70,
    questions = [],
    createdAt = null,
    updatedAt = null,
  } = {}) {
    this.id = id || `quiz_${Date.now()}`;
    this.courseId = courseId;
    this.courseTitle = courseTitle;
    this.moduleId = moduleId;
    this.moduleTitle = moduleTitle;
    this.title = title || (isFinal ? 'Evaluación Final de Certificación' : 'Evaluación de Módulo');
    this.description = description;
    this.isFinal = Boolean(isFinal);
    this.passingScore = Number(passingScore) || 70;
    this.questions = questions || [];
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  get totalPoints() {
    return (this.questions || []).reduce(
      (acc, q) => acc + (Number(q.weightPoints) || 0),
      0
    );
  }

  get questionsCount() {
    return (this.questions || []).length;
  }
}

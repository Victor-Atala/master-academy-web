import { INITIAL_DEMO_QUIZZES, INITIAL_DEMO_ATTEMPTS } from "./quizDemoData";

const STORAGE_QUIZZES_KEY = 'ma_quizzes_data';
const STORAGE_ATTEMPTS_KEY = 'ma_quiz_attempts_data';

export function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export class QuizRepository {
    static normalizeQuiz(q) {
        if (!q) return null;
        const isFinal = Boolean(q.isFinal);
        return {
            ...q,
            description: q.description || q.descripcion || '',
            questions: q.questions || q.question || [],
            isFinal: isFinal,
            attemptsAllowed: isFinal ? 5 : null,
            unlimitedRetries: !isFinal,
            moduleTitle: isFinal ? (q.moduleTitle || 'Módulo Final: Examen de Certificación Global') : (q.moduleTitle || '')
        };
    }

    static getQuizzes() {
        try {
            const stored = localStorage.getItem(STORAGE_QUIZZES_KEY);
            if (!stored) {
                const normalizedDemo = INITIAL_DEMO_QUIZZES.map(this.normalizeQuiz);
                localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(normalizedDemo));
                return normalizedDemo;
            }
            const parsed = JSON.parse(stored);
            let list = Array.isArray(parsed) ? parsed.map(this.normalizeQuiz) : [];
            let updated = false;
            INITIAL_DEMO_QUIZZES.forEach(demoQ => {
                if (!list.some(q => String(q.id) === String(demoQ.id))) {
                    list.push(this.normalizeQuiz(demoQ));
                    updated = true;
                }
            });
            if (updated) {
                try {
                    localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(list));
                } catch (e) {}
            }
            return list;
        } catch {
            return INITIAL_DEMO_QUIZZES.map(this.normalizeQuiz);
        }
    }

    static getQuizById(id) {
        const quizzes = this.getQuizzes();
        return quizzes.find(q => String(q.id) === String(id)) || null;
    }

    static getQuizzesByCourse(courseId) {
        const quizzes = this.getQuizzes();
        return quizzes.filter(q => String(q.courseId) === String(courseId));
    }

    static saveQuiz(quizData) {
        if (!quizData) throw new Error('Datos de evaluación no proporcionados');

        const quizzes = this.getQuizzes();
        const now = new Date().toISOString();
        const quizId = quizData.id || ('quiz_' + Date.now());

        const rawQuestions = quizData.questions || quizData.question || [];
        const normalizedQuestions = rawQuestions.map((q, idx) => ({
            id: q.id || ('q_' + Date.now() + '_' + idx),
            text: q.text || '',
            weightPoints: Number(q.weightPoints) || 25,
            explanation: q.explanation || '',
            options: (q.options || []).map((opt, oIdx) => ({
                id: opt.id || ('opt_' + Date.now() + '_' + oIdx),
                text: opt.text || '',
                isCorrect: Boolean(opt.isCorrect)
            }))
        }));

        const isFinal = Boolean(quizData.isFinal);

        const cleanQuiz = {
            id: quizId,
            courseId: Number(quizData.courseId) || 1,
            courseTitle: quizData.courseTitle || 'Curso',
            moduleId: isFinal ? null : (quizData.moduleId ? Number(quizData.moduleId) : null),
            moduleTitle: isFinal ? 'Módulo Final: Examen de Certificación Global' : (quizData.moduleTitle || 'Módulo'),
            title: quizData.title || (isFinal ? 'Examen Global de Certificación' : 'Evaluación de Módulo'),
            description: quizData.description || quizData.descripcion || '',
            isFinal: isFinal,
            attemptsAllowed: isFinal ? 5 : null,
            unlimitedRetries: !isFinal,
            passingScore: Number(quizData.passingScore) || 70,
            questions: normalizedQuestions,
            updatedAt: now
        };

        const existingIndex = quizzes.findIndex(q => String(q.id) === String(quizId));

        if (existingIndex >= 0) {
            cleanQuiz.createdAt = quizzes[existingIndex].createdAt || now;
            quizzes[existingIndex] = cleanQuiz;
        } else {
            cleanQuiz.createdAt = quizData.createdAt || now;
            quizzes.unshift(cleanQuiz);
        }

        try {
            localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(quizzes));
        } catch (e) {
            console.error('Error al guardar quiz en localStorage:', e);
        }

        return cleanQuiz;
    }

    static deleteQuiz(quizId) {
        const quizzes = this.getQuizzes();
        const filtered = quizzes.filter(q => String(q.id) !== String(quizId));
        try {
            localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(filtered));
            return true;
        } catch (e) {
            console.error('Error al eliminar quiz en localStorage:', e);
            return false;
        }
    }

    static getAttempts() {
        try {
            const stored = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
            if (!stored) {
                localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(INITIAL_DEMO_ATTEMPTS));
                return INITIAL_DEMO_ATTEMPTS;
            }
            return JSON.parse(stored);
        } catch {
            return INITIAL_DEMO_ATTEMPTS;
        }
    }

    static getAttemptsByQuiz(quizId) {
        const attempts = this.getAttempts();
        return attempts.filter(a => String(a.quizId) === String(quizId));
    }

    static startAttempt(quizId, studentId = 'usr_current') {
        const quizzes = this.getQuizzes();
        const quiz = quizzes.find(q => String(q.id) === String(quizId));
        if (!quiz) throw new Error('Evaluación no encontrada');

        const attempts = this.getAttempts();
        const previousAttempts = attempts.filter(
            a => String(a.quizId) === String(quizId) && String(a.studentId) === String(studentId)
        );

        if (quiz.isFinal) {
            const maxAttempts = 5;
            const hasPassed = previousAttempts.some(a => a.isPassed);
            if (hasPassed) {
                throw new Error('Ya has aprobado satisfactoriamente este examen de certificación.');
            }
            if (previousAttempts.length >= maxAttempts) {
                throw new Error(
                    'Has alcanzado el límite estricto de 5 intentos para el examen de certificación. ' +
                    'Tu progreso del curso ha sido reiniciado y debes volver a adquirir el curso.'
                );
            }
        }

        const questionsList = quiz.questions || quiz.question || [];
        const randomizedQuestions = questionsList.map(q => ({
            id: q.id,
            text: q.text,
            weightPoints: q.weightPoints,
            options: shuffleArray((q.options || []).map(opt => ({
                id: opt.id,
                text: opt.text
            })))
        }));

        return {
            attemptId: 'att_' + Date.now(),
            quizId: quiz.id,
            title: quiz.title,
            isFinal: quiz.isFinal,
            attemptsAllowed: quiz.isFinal ? 5 : null,
            unlimitedRetries: !quiz.isFinal,
            attemptNumber: previousAttempts.length + 1,
            passingScore: quiz.passingScore,
            questions: randomizedQuestions
        };
    }

    static submitAttempt({ quizId, studentId = 'usr_current', studentName = 'Instructor / Alumno Demo', answers = {} }) {
        const quizzes = this.getQuizzes();
        const quiz = quizzes.find(q => String(q.id) === String(quizId));
        if (!quiz) throw new Error('Evaluación no encontrada');

        const attempts = this.getAttempts();
        const previousAttempts = attempts.filter(
            a => String(a.quizId) === String(quiz.id) && String(a.studentId) === String(studentId)
        );

        const attemptNumber = previousAttempts.length + 1;
        const questionsList = quiz.questions || quiz.question || [];
        let totalPoints = 0;
        let earnedPoints = 0;

        questionsList.forEach(q => {
            const weight = Number(q.weightPoints) || 0;
            totalPoints += weight;

            const selectedOptId = answers[q.id];
            const correctOpt = (q.options || []).find(opt => opt.isCorrect);

            if (correctOpt && selectedOptId === correctOpt.id){
                earnedPoints += weight;
            }
        });

        const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
        const isPassed = score >= quiz.passingScore;
        const isAptoParaCertificado = quiz.isFinal ? isPassed : false;

        let resultMessage = '';
        let courseReset = false;
        let requiresRepurchase = false;
        let remainingAttempts = null;

        if (quiz.isFinal) {
            const maxAttempts = 5;
            remainingAttempts = Math.max(0, maxAttempts - attemptNumber);

            if (isPassed) {
                resultMessage = `¡Excelente! Has alcanzado la nota requerida (${score}% / mín. ${quiz.passingScore}%). El estudiante es APTO PARA CERTIFICACIÓN OFICIAL (Intento ${attemptNumber} de ${maxAttempts}).`;
            } else {
                if (attemptNumber >= maxAttempts) {
                    courseReset = true;
                    requiresRepurchase = true;
                    remainingAttempts = 0;
                    resultMessage = `¡ATENCIÓN! Has agotado tus 5 intentos permitidos para el Examen de Certificación con ${score}%. El curso ha sido reiniciado a 0% de progreso y la matrícula ha quedado bloqueada. Deberás volver a adquirir el curso para tener una nueva oportunidad.`;
                } else {
                    resultMessage = `No alcanzaste el mínimo requerido (${score}% / mín. ${quiz.passingScore}%). Intento ${attemptNumber} de ${maxAttempts} realizado. Te quedan ${remainingAttempts} intento(s) antes de que el curso sea reiniciado.`;
                }
            }
        } else {
            // Módulo con reintentos ilimitados
            resultMessage = isPassed
                ? `¡Muy bien! Has superado la evaluación formativa de este módulo con ${score}%.`
                : `Puntaje obtenido: ${score}%. Recuerda que las evaluaciones de módulo tienen reintentos ilimitados: puedes repasar los contenidos y reintentar las veces que desees.`;
        }

        const newAttempt = {
            id: 'att_' + Date.now(),
            quizId: quiz.id,
            quizTitle: quiz.title,
            studentId,
            studentName,
            courseId: quiz.courseId,
            score,
            isPassed,
            isFinal: Boolean(quiz.isFinal),
            attemptsAllowed: quiz.isFinal ? 5 : null,
            unlimitedRetries: !quiz.isFinal,
            attemptNumber,
            remainingAttempts,
            courseReset,
            requiresRepurchase,
            isAptoParaCertificado,
            message: resultMessage,
            completedAt: new Date().toISOString()
        };

        attempts.unshift(newAttempt);
        try {
            localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(attempts));
        } catch (e) {
            console.error('Error al guardar intento en localStorage:', e);
        }

        return {
            score,
            passingScore: quiz.passingScore,
            isPassed,
            isFinal: quiz.isFinal,
            attemptNumber,
            attemptsAllowed: quiz.isFinal ? 5 : null,
            remainingAttempts,
            courseReset,
            requiresRepurchase,
            isAptoParaCertificado,
            message: resultMessage
        };
    }

    static verifyCertificateEligibility(courseId, studentId) {
        const quizzes = this.getQuizzes();
        const finalQuiz = quizzes.find(q => String(q.courseId) === String(courseId) && q.isFinal === true);

        if (!finalQuiz) {
            return {
                allowed: true,
                status: 'Apto (Curso sin examen obligatorio)',
                score: null,
                reason: null
            };
        }

        const attempts = this.getAttempts();
        const passedAttempt = attempts.find(
            att => String(att.courseId) === String(courseId) && String(att.quizId) === String(finalQuiz.id) && att.studentId === studentId && att.isPassed === true
        );

        if (passedAttempt) {
            return {
                allowed: true,
                status: 'Apto para Certificación',
                score: passedAttempt.score,
                attemptNumber: passedAttempt.attemptNumber || 1,
                reason: null
            };
        }

        const studentAttempts = attempts.filter(
            att => String(att.courseId) === String(courseId) && String(att.quizId) === String(finalQuiz.id) && att.studentId === studentId
        );

        if (studentAttempts.length >= 5) {
            const lastAttempt = studentAttempts[0];
            return {
                allowed: false,
                status: 'Bloqueado (5 intentos agotados - Reinicio de Curso)',
                score: lastAttempt ? lastAttempt.score : null,
                passingScore: finalQuiz.passingScore,
                quizTitle: finalQuiz.title,
                courseReset: true,
                requiresRepurchase: true,
                reason: `Has agotado los 5 intentos del examen de certificación (${lastAttempt?.score || 0}%). Tu curso ha sido reiniciado a 0% y requiere ser adquirido nuevamente.`
            };
        }

        const failedAttempt = studentAttempts[0];

        return {
            allowed: false,
            status: 'No Apto (Pendiente)',
            score: failedAttempt ? failedAttempt.score : null,
            passingScore: finalQuiz.passingScore,
            quizTitle: finalQuiz.title,
            courseReset: false,
            requiresRepurchase: false,
            attemptsUsed: studentAttempts.length,
            remainingAttempts: 5 - studentAttempts.length,
            reason: failedAttempt 
                ? (`Último intento: ${failedAttempt.score}%. Se requiere mínimo ${finalQuiz.passingScore}%. Te quedan ${5 - studentAttempts.length} intento(s) de 5.`) 
                : (`Aún no ha aprobado el examen obligatorio del Módulo Final ("${finalQuiz.title}").`)
        };
    }

    static resetToDemo() {
        try {
            const normalizedDemo = INITIAL_DEMO_QUIZZES.map(this.normalizeQuiz);
            localStorage.setItem(STORAGE_QUIZZES_KEY, JSON.stringify(normalizedDemo));
            localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify(INITIAL_DEMO_ATTEMPTS));
            return { quizzes: normalizedDemo, attempts: INITIAL_DEMO_ATTEMPTS };
        } catch (e) {
            console.error('Error al resetear demo en localStorage:', e);
            return null;
        }
    }
}

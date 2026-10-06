import React from 'react';
import { Plus, Trash2, Award, CheckCircle2, HelpCircle, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export function QuizEditorSection({
  quiz = {
    title: 'Evaluación Final de Certificación',
    passingScore: 75,
    questions: []
  },
  onChange,
  onRemove,
  isFinal = true,
  stepNumber = 4
}) {
  const questions = quiz?.questions || [];

  // Calcular la suma de puntos ponderados acumulados (máximo 100 pts)
  const totalPoints = questions.reduce((acc, q) => acc + (Number(q.weightPoints) || 0), 0);

  const handleUpdateField = (field, value) => {
    if (!onChange) return;
    onChange({
      ...quiz,
      [field]: value
    });
  };

  const handleAddQuestion = () => {
    if (!onChange) return;

    if (totalPoints >= 100) {
      alert('Esta evaluación ya ha alcanzado el límite de 100 puntos ponderados. Para agregar otra pregunta, reduce primero el puntaje de alguna pregunta existente o utiliza "Distribuir 100 pts".');
      return;
    }

    const remainingPoints = Math.max(1, 100 - totalPoints);
    const defaultWeight = Math.min(25, remainingPoints);

    const newQuestion = {
      id: 'q_' + Date.now(),
      text: '',
      weightPoints: defaultWeight,
      options: [
        { id: 'opt_' + Date.now() + '_1', text: '', isCorrect: true },
        { id: 'opt_' + Date.now() + '_2', text: '', isCorrect: false },
        { id: 'opt_' + Date.now() + '_3', text: '', isCorrect: false },
        { id: 'opt_' + Date.now() + '_4', text: '', isCorrect: false }
      ]
    };

    onChange({
      ...quiz,
      questions: [...questions, newQuestion]
    });
  };

  const handleRemoveQuestion = (questionId) => {
    if (!onChange) return;
    onChange({
      ...quiz,
      questions: questions.filter(q => q.id !== questionId)
    });
  };

  const handleUpdateQuestion = (qIndex, field, value) => {
    if (!onChange) return;
    const updated = [...questions];

    if (field === 'weightPoints') {
      let numVal = Number(value);
      if (isNaN(numVal) || numVal < 1) numVal = 1;

      // Calcular puntos de las demás preguntas
      const otherQuestionsTotal = questions.reduce(
        (acc, q, idx) => idx === qIndex ? acc : acc + (Number(q.weightPoints) || 0),
        0
      );

      // El máximo permitido para esta pregunta para no sobrepasar 100 pts en total
      const maxAllowed = Math.max(1, 100 - otherQuestionsTotal);
      if (numVal > maxAllowed) {
        numVal = maxAllowed;
      }

      updated[qIndex] = { ...updated[qIndex], weightPoints: numVal };
    } else {
      updated[qIndex] = { ...updated[qIndex], [field]: value };
    }

    onChange({ ...quiz, questions: updated });
  };

  // Distribuir 100 puntos de manera equitativa entre todas las preguntas existentes
  const handleAutoDistributePoints = () => {
    if (!onChange || questions.length === 0) return;
    const count = questions.length;
    const basePoints = Math.floor(100 / count);
    const remainder = 100 % count;

    const updated = questions.map((q, idx) => ({
      ...q,
      weightPoints: basePoints + (idx < remainder ? 1 : 0)
    }));

    onChange({ ...quiz, questions: updated });
  };

  const handleUpdateOption = (qIndex, optIndex, text) => {
    if (!onChange) return;
    const updated = [...questions];
    const updatedOptions = [...updated[qIndex].options];
    updatedOptions[optIndex] = { ...updatedOptions[optIndex], text };
    updated[qIndex] = { ...updated[qIndex], options: updatedOptions };
    onChange({ ...quiz, questions: updated });
  };

  const handleSetCorrectOption = (qIndex, optIndex) => {
    if (!onChange) return;
    const updated = [...questions];
    updated[qIndex] = {
      ...updated[qIndex],
      options: updated[qIndex].options.map((opt, i) => ({
        ...opt,
        isCorrect: i === optIndex
      }))
    };
    onChange({ ...quiz, questions: updated });
  };

  const handleAddOptionToQuestion = (qIndex) => {
    if (!onChange) return;
    const updated = [...questions];
    const updatedOptions = [
      ...updated[qIndex].options,
      {
        id: 'opt_' + Date.now(),
        text: '',
        isCorrect: false
      }
    ];
    updated[qIndex] = { ...updated[qIndex], options: updatedOptions };
    onChange({ ...quiz, questions: updated });
  };

  const handleRemoveOptionFromQuestion = (qIndex, optIndex) => {
    if (!onChange) return;
    const updated = [...questions];
    if (updated[qIndex].options.length <= 2) {
      alert('Una pregunta debe tener al menos 2 opciones de respuesta.');
      return;
    }
    const updatedOptions = updated[qIndex].options.filter((_, i) => i !== optIndex);
    if (!updatedOptions.some(o => o.isCorrect)) {
      updatedOptions[0] = { ...updatedOptions[0], isCorrect: true };
    }
    updated[qIndex] = { ...updated[qIndex], options: updatedOptions };
    onChange({ ...quiz, questions: updated });
  };

  return (
    <div
      className={isFinal ? 'form-card' : ''}
      style={{
        marginTop: isFinal ? '24px' : '16px',
        background: isFinal ? 'var(--color-card-bg)' : 'var(--color-input-bg)',
        border: isFinal ? '1px solid var(--color-light-border)' : '1.5px dashed var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
        padding: isFinal ? '28px' : '20px',
        boxShadow: isFinal ? 'var(--shadow-sm)' : 'none',
      }}
    >
      {/* Cabecera de la Sección */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--color-light-border)'
      }}>
        <div>
          {stepNumber && (
            <span className="section-step-indicator" style={{ display: 'inline-block', marginBottom: '6px' }}>
              Paso {stepNumber}
            </span>
          )}
          <h2 style={{
            fontSize: isFinal ? '1.4rem' : '1.15rem',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: 0
          }}>
            {isFinal ? (
              <>
                <Award size={24} color="var(--color-warning)" />
                Evaluación Final Obligatoria (Certificación)
              </>
            ) : (
              <>
                <BookOpen size={20} color="var(--color-primary)" />
                Evaluación de Módulo (Opcional)
              </>
            )}
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--color-text-muted)', marginTop: '4px', marginBottom: 0 }}>
            {isFinal 
              ? 'El estudiante debe aprobar este examen obligatoriamente para desbloquear y recibir su certificado oficial.'
              : 'Evaluación formativa de opción múltiple para medir la comprensión de este módulo.'}
          </p>
        </div>

        {/* Resumen de Puntos y Acciones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: totalPoints === 100 ? 'var(--color-success-light)' : totalPoints > 100 ? 'rgba(239, 68, 68, 0.12)' : 'var(--color-card-bg)',
            border: totalPoints === 100 ? '1.5px solid var(--color-success)' : totalPoints > 100 ? '1.5px solid var(--color-danger)' : '1px solid var(--color-light-border)',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--color-text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>Puntos acumulados:</span>
            <span style={{
              color: totalPoints === 100 ? 'var(--color-success)' : totalPoints > 100 ? 'var(--color-danger)' : 'var(--color-warning)',
              fontWeight: 800
            }}>
              {totalPoints} / 100 pts
            </span>

            {totalPoints === 100 ? (
              <span style={{ fontSize: '0.74rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <CheckCircle2 size={13} /> Completo
              </span>
            ) : (
              questions.length > 1 && (
                <button
                  type="button"
                  onClick={handleAutoDistributePoints}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-primary)',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    padding: 0,
                    marginLeft: '4px'
                  }}
                  title="Distribuir 100 puntos equitativamente entre las preguntas"
                >
                  Distribuir 100 pts
                </button>
              )
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            icon={Plus}
            onClick={handleAddQuestion}
            disabled={totalPoints >= 100}
            title={totalPoints >= 100 ? 'Ya se alcanzó el límite de 100 puntos' : 'Añadir una nueva pregunta a esta evaluación'}
          >
            Pregunta
          </Button>

          {!isFinal && onRemove && (
            <Button
              variant="dangerSubtle"
              size="sm"
              icon={Trash2}
              onClick={onRemove}
              title="Quitar evaluación de este módulo"
            >
              Quitar Examen
            </Button>
          )}
        </div>
      </div>

      {/* Configuración de Título y Nota Aprobatoria */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '22px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-label)', marginBottom: '6px' }}>
            Título de la evaluación *
          </label>
          <Input
            value={quiz?.title || ''}
            onChange={(e) => handleUpdateField('title', e.target.value)}
            placeholder={isFinal ? 'Ej. Evaluación Final de Certificación' : 'Ej. Quiz de Repaso del Módulo'}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-label)', marginBottom: '6px' }}>
            Calificación mínima aprobatoria (%) *
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="number"
              min="1"
              max="100"
              value={quiz?.passingScore ?? 75}
              onChange={(e) => handleUpdateField('passingScore', Number(e.target.value))}
              style={{
                width: '88px',
                padding: '9px 12px',
                borderRadius: '8px',
                background: 'var(--color-input-bg)',
                border: '1px solid var(--color-input-border)',
                color: 'var(--color-text-main)',
                fontWeight: 700,
                fontSize: '0.92rem',
                textAlign: 'center'
              }}
              required
            />
            <span style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              % de respuestas correctas requeridas para aprobar {isFinal ? 'y desbloquear el diploma' : 'este módulo'}.
            </span>
          </div>
        </div>
      </div>

      {/* Alerta informativa de ponderación si faltan o sobran puntos */}
      {totalPoints !== 100 && (
        <div style={{
          padding: '10px 14px',
          borderRadius: '8px',
          background: totalPoints > 100 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(217, 119, 6, 0.1)',
          border: totalPoints > 100 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(217, 119, 6, 0.3)',
          marginBottom: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          fontSize: '0.82rem',
          color: totalPoints > 100 ? 'var(--color-danger)' : '#b45309'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={16} />
            <span>
              {totalPoints > 100
                ? 'El total de puntos (' + totalPoints + ' pts) supera el límite máximo de 100 puntos. Ajusta los pesos de las preguntas.'
                : 'Puntos actuales: ' + totalPoints + ' / 100 pts. Faltan ' + (100 - totalPoints) + ' pts para completar la ponderación del 100%.'}
            </span>
          </div>
          {questions.length > 0 && (
            <Button
              variant="outline"
              size="xs"
              onClick={handleAutoDistributePoints}
            >
              Ajustar a 100 pts automáticamente
            </Button>
          )}
        </div>
      )}

      {/* Lista de Preguntas */}
      {questions.length === 0 ? (
        <div style={{
          padding: '36px 20px',
          textAlign: 'center',
          background: 'var(--color-card-bg)',
          borderRadius: '12px',
          border: '1.5px dashed var(--color-light-border)'
        }}>
          <HelpCircle size={32} color="var(--color-text-muted)" style={{ margin: '0 auto 10px' }} />
          <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '4px' }}>
            No hay preguntas agregadas todavía
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '14px' }}>
            Agrega al menos una pregunta para conformar la evaluación.
          </p>
          <Button variant="secondary" size="sm" icon={Plus} onClick={handleAddQuestion}>
            Pregunta
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {questions.map((q, qIndex) => {
            const otherQuestionsTotal = questions.reduce(
              (acc, item, idx) => idx === qIndex ? acc : acc + (Number(item.weightPoints) || 0),
              0
            );
            const maxPointsThisQuestion = Math.max(1, 100 - otherQuestionsTotal);

            return (
              <div
                key={q.id || qIndex}
                style={{
                  background: 'var(--color-card-bg)',
                  border: '1px solid var(--color-light-border)',
                  borderLeft: '4px solid var(--color-primary)',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {/* Encabezado de Pregunta con Ponderación y Eliminar */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    padding: '4px 10px',
                    borderRadius: '6px'
                  }}>
                    PREGUNTA #{qIndex + 1}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                        Puntos / Peso:
                      </span>
                      <input
                        type="number"
                        min="1"
                        max={maxPointsThisQuestion}
                        value={q.weightPoints ?? 25}
                        onChange={(e) => handleUpdateQuestion(qIndex, 'weightPoints', Number(e.target.value))}
                        style={{
                          width: '72px',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          background: 'var(--color-input-bg)',
                          border: '1px solid var(--color-input-border)',
                          color: 'var(--color-text-main)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          textAlign: 'center'
                        }}
                        title={'Puntos que vale esta pregunta (máx permitido: ' + maxPointsThisQuestion + ' pts para no superar 100 pts)'}
                      />
                      <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>pts</span>
                    </div>

                    <Button
                      variant="dangerSubtle"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleRemoveQuestion(q.id)}
                      title="Eliminar esta pregunta"
                    />
                  </div>
                </div>

                {/* Enunciado de la Pregunta */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-label)', marginBottom: '5px' }}>
                    Enunciado de la pregunta *
                  </label>
                  <Input
                    value={q.text || ''}
                    onChange={(e) => handleUpdateQuestion(qIndex, 'text', e.target.value)}
                    placeholder="Ej. ¿Cuál es el principio medular del modelo de seguridad Zero Trust?"
                    required
                  />
                </div>

                {/* Opciones de Respuesta con Radio Button de la Correcta */}
                <div>
                  <span style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    Opciones de respuesta (Marca el círculo de la opción que es correcta):
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(q.options || []).map((opt, optIndex) => (
                      <div
                        key={opt.id || optIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: opt.isCorrect ? 'rgba(5, 150, 105, 0.08)' : 'var(--color-input-bg)',
                          border: opt.isCorrect ? '1.5px solid var(--color-success)' : '1px solid var(--color-input-border)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          transition: 'border 150ms ease, background 150ms ease'
                        }}
                      >
                        <input
                          type="radio"
                          name={'correct_q_' + (q.id || qIndex)}
                          checked={Boolean(opt.isCorrect)}
                          onChange={() => handleSetCorrectOption(qIndex, optIndex)}
                          style={{ cursor: 'pointer', width: '18px', height: '18px', accentColor: 'var(--color-success)' }}
                          title="Marcar como respuesta correcta"
                        />

                        <input
                          type="text"
                          value={opt.text || ''}
                          onChange={(e) => handleUpdateOption(qIndex, optIndex, e.target.value)}
                          placeholder={'Opción ' + (optIndex + 1) + '...'}
                          style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-text-main)',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />

                        {opt.isCorrect && (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            color: 'var(--color-success)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            whiteSpace: 'nowrap'
                          }}>
                            <CheckCircle2 size={14} /> Correcta
                          </span>
                        )}

                        {q.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionFromQuestion(qIndex, optIndex)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title="Eliminar opción"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleAddOptionToQuestion(qIndex)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-primary)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: '4px 0',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      + Añadir otra opción de respuesta
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '6px' }}>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              onClick={handleAddQuestion}
              disabled={totalPoints >= 100}
            >
              Añadir pregunta al examen
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

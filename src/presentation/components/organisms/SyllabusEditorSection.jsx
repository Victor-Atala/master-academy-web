import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  FolderPlus, 
  ChevronDown, 
  ChevronsUpDown,
  BookOpen, 
  Layers,
  Sparkles,
  HelpCircle,
  Award,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SectionHeader } from '../molecules/SectionHeader';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Badge } from '../atoms/Badge';
import { LessonItem } from '../molecules/LessonItem';
import { QuizEditorSection } from './QuizEditorSection';

export function SyllabusEditorSection({
  modulos = [],
  onAddModule,
  onUpdateModuleTitle,
  onRemoveModule,
  onAddLesson,
  onUpdateLesson,
  onRemoveLesson,
  onUpdateModuleQuiz,
  onRemoveModuleQuiz,
  finalQuiz = null,
  onUpdateFinalQuiz = null,
}) {
  const [openModules, setOpenModules] = useState(() => {
    return new Set(modulos.map(m => m.id));
  });

  const [isFinalModuleOpen, setIsFinalModuleOpen] = useState(true);

  useEffect(() => {
    setOpenModules(prev => {
      const next = new Set(prev);
      modulos.forEach(m => {
        if (!next.has(m.id)) {
          next.add(m.id);
        }
      });
      return next;
    });
  }, [modulos]);

  const toggleModule = (moduleId) => {
    setOpenModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const expandAll = () => {
    setOpenModules(new Set(modulos.map(m => m.id)));
    setIsFinalModuleOpen(true);
  };

  const collapseAll = () => {
    setOpenModules(new Set());
    setIsFinalModuleOpen(false);
  };

  const isAllExpanded = modulos.length > 0 && openModules.size === modulos.length && isFinalModuleOpen;

  return (
    <div className="form-card">
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-light-border)' }}>
        <div>
          <span className="section-step-indicator">Paso 3</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-main)', letterSpacing: '-0.02em' }}>
            Estructura del temario y evaluaciones
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            Organiza tus clases en módulos temáticos con evaluaciones formativas opcionales, y culmina con el <strong>Último Módulo de Certificación Global</strong> que evalúa si el alumno es apto para recibir el diploma.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {modulos.length > 1 && (
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronsUpDown}
              onClick={isAllExpanded ? collapseAll : expandAll}
            >
              {isAllExpanded ? 'Colapsar todos' : 'Expandir todos'}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            icon={FolderPlus}
            onClick={onAddModule}
          >
            + Agregar módulo
          </Button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
        {modulos.map((modulo, modIndex) => {
          const isOpen = openModules.has(modulo.id);
          const lessonCount = modulo.lecciones ? modulo.lecciones.length : 0;
          const formattedIndex = String(modIndex + 1).padStart(2, '0');

          return (
            <div
              key={modulo.id}
              style={{
                border: isOpen ? '2px solid var(--color-primary)' : '1px solid var(--color-light-border)',
                borderLeft: '6px solid var(--color-primary)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: 'var(--color-card-bg)',
                boxShadow: isOpen ? '0 8px 24px var(--color-primary-glow)' : 'var(--shadow-sm)',
                transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                onClick={() => toggleModule(modulo.id)}
                style={{
                  background: isOpen ? 'var(--color-primary-light)' : 'var(--color-light-bg)',
                  padding: '16px 22px',
                  borderBottom: isOpen ? '1px solid var(--color-light-border)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background 180ms ease',
                }}
                title={isOpen ? 'Clic para colapsar pestaña' : 'Clic para desplegar pestaña'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '220px' }}>
                  <div
                    style={{
                      background: 'var(--color-secondary)',
                      color: '#ffffff',
                      padding: '5px 12px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    MÓDULO {formattedIndex}
                  </div>

                  <div style={{ flex: 1 }} onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={modulo.titulo}
                      onChange={(e) => onUpdateModuleTitle(modulo.id, e.target.value)}
                      placeholder={'Título del Módulo ' + formattedIndex + '...'}
                      required
                      style={{ fontWeight: 700, fontSize: '1rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <span
                    style={{
                      background: 'var(--color-light-bg)',
                      color: 'var(--color-text-muted)',
                      border: '1px solid var(--color-light-border)',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    {lessonCount} {lessonCount === 1 ? 'lección' : 'lecciones'}
                  </span>

                  {modulo.evaluacion && (
                    <span
                      style={{
                        background: 'rgba(37, 99, 235, 0.15)',
                        color: '#0284c7',
                        border: '1px solid rgba(37, 99, 235, 0.3)',
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Este módulo contiene una evaluación formativa opcional"
                    >
                      <HelpCircle size={12} /> Examen de Módulo
                    </span>
                  )}

                  {isOpen && (
                    <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Plus}
                        onClick={() => onAddLesson(modulo.id)}
                        title="Agregar nueva lección a este módulo"
                      >
                        Clase
                      </Button>

                      {modulos.length > 1 && (
                        <Button
                          variant="dangerSubtle"
                          size="sm"
                          icon={Trash2}
                          onClick={() => onRemoveModule(modulo.id)}
                          title="Eliminar este módulo por completo"
                        />
                      )}
                    </div>
                  )}

                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: isOpen ? 'var(--color-primary)' : 'var(--color-light-bg)',
                      color: isOpen ? '#ffffff' : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 240ms cubic-bezier(0.16, 1, 0.3, 1), background 180ms ease, color 180ms ease',
                    }}
                  >
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div
                  style={{
                    padding: '24px 22px',
                    background: 'var(--color-light-bg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    borderTop: '1px solid var(--color-light-border)',
                  }}
                >
                  <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Contenido Académico del Módulo {formattedIndex}
                    </span>
                  </div>

                  {modulo.lecciones.map((leccion, lesIndex) => (
                    <LessonItem
                      key={leccion.id}
                      lessonNumber={lesIndex + 1}
                      lesson={leccion}
                      onChange={(field, val) => onUpdateLesson(modulo.id, leccion.id, field, val)}
                      onRemove={() => onRemoveLesson(modulo.id, leccion.id)}
                      canRemove={modulo.lecciones.length > 1}
                    />
                  ))}

                  {modulo.evaluacion && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(37, 99, 235, 0.08)',
                        border: '1px solid rgba(37, 99, 235, 0.25)',
                        borderRadius: '8px',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <HelpCircle size={16} color="#0284c7" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0369a1' }}>
                            Examen de Módulo {formattedIndex} (Evaluación Formativa Opcional)
                          </span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                          Práctica para afianzar conceptos del módulo
                        </span>
                      </div>

                      <QuizEditorSection
                        isFinal={false}
                        stepNumber={null}
                        quiz={modulo.evaluacion}
                        onChange={(qData) => onUpdateModuleQuiz && onUpdateModuleQuiz(modulo.id, qData)}
                        onRemove={() => onRemoveModuleQuiz && onRemoveModuleQuiz(modulo.id)}
                      />
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <Button
                      variant="softPrimary"
                      size="sm"
                      icon={Plus}
                      onClick={() => onAddLesson(modulo.id)}
                      style={{
                        border: '1.5px dashed var(--color-primary)',
                        background: 'rgba(30, 64, 175, 0.09)',
                        color: 'var(--color-primary)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      {'Añadir clase al Módulo ' + formattedIndex}
                    </Button>

                    {!modulo.evaluacion && onUpdateModuleQuiz && (
                      <Button
                        variant="softSecondary"
                        size="sm"
                        icon={HelpCircle}
                        onClick={() => onUpdateModuleQuiz(modulo.id, {
                          title: 'Evaluación de Repaso: Módulo ' + formattedIndex,
                          passingScore: 60,
                          questions: [
                            {
                              id: 'q_mod_' + modulo.id + '_1',
                              text: '¿Cuál es el concepto clave estudiado en el Módulo ' + formattedIndex + '?',
                              weightPoints: 100,
                              options: [
                                { id: 'opt_' + Date.now() + '_1', text: 'Aplicación práctica de los fundamentos del módulo.', isCorrect: true },
                                { id: 'opt_' + Date.now() + '_2', text: 'Omitir las buenas prácticas y patrones recomendados.', isCorrect: false },
                                { id: 'opt_' + Date.now() + '_3', text: 'Ignorar la estructura modular del temario.', isCorrect: false }
                              ]
                            }
                          ]
                        })}
                        style={{
                          border: '1.5px dashed var(--color-secondary)',
                          color: 'var(--color-secondary)',
                          background: 'rgba(64, 81, 137, 0.08)',
                          fontWeight: 700,
                          fontSize: '0.84rem'
                        }}
                      >
                        Agregar examen al Módulo (Opcional)
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ⭐ ÚLTIMO MÓDULO DEL CURSO: EXAMEN GLOBAL DE CERTIFICACIÓN */}
        {finalQuiz && onUpdateFinalQuiz && (
          <div
            style={{
              border: isFinalModuleOpen ? '2px solid #eab308' : '1px solid rgba(234, 179, 8, 0.4)',
              borderLeft: '6px solid #eab308',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              background: 'var(--color-card-bg)',
              boxShadow: isFinalModuleOpen ? '0 8px 24px rgba(234, 179, 8, 0.2)' : 'var(--shadow-sm)',
              transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              onClick={() => setIsFinalModuleOpen(!isFinalModuleOpen)}
              style={{
                background: isFinalModuleOpen ? 'rgba(234, 179, 8, 0.12)' : 'rgba(234, 179, 8, 0.05)',
                padding: '16px 22px',
                borderBottom: isFinalModuleOpen ? '1px solid rgba(234, 179, 8, 0.3)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'background 180ms ease',
              }}
              title="Módulo Final de Certificación Global"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                <div
                  style={{
                    background: 'linear-gradient(135deg, #eab308, #ca8a04)',
                    color: '#ffffff',
                    padding: '5px 12px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(234, 179, 8, 0.4)',
                  }}
                >
                  <Award size={15} /> MÓDULO FINAL (OBLIGATORIO)
                </div>

                <div>
                  <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    Examen Global de Certificación Oficial
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#a16207', fontWeight: 600 }}>
                    Requisito de Aptitud para Certificación Oficial
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    background: 'rgba(234, 179, 8, 0.2)',
                    color: '#ca8a04',
                    border: '1px solid rgba(234, 179, 8, 0.35)',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                  }}
                >
                  Mín. {finalQuiz.passingScore || 75}% para Aprobar
                </span>

                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isFinalModuleOpen ? '#eab308' : 'rgba(234, 179, 8, 0.2)',
                    color: isFinalModuleOpen ? '#ffffff' : '#ca8a04',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: isFinalModuleOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 240ms ease',
                  }}
                >
                  <ChevronDown size={18} />
                </div>
              </div>
            </div>

            {isFinalModuleOpen && (
              <div
                style={{
                  padding: '24px 22px',
                  background: 'var(--color-light-bg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    background: 'rgba(234, 179, 8, 0.1)',
                    border: '1px solid rgba(234, 179, 8, 0.3)',
                    borderRadius: '10px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <ShieldCheck size={22} color="#ca8a04" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#a16207' }}>
                      Módulo Final de Evaluación para Diploma Oficial
                    </h4>
                    <p style={{ fontSize: '0.84rem', color: 'var(--color-text-main)', marginTop: '2px', lineHeight: 1.45 }}>
                      Este módulo final evalúa de manera global e integradora las competencias adquiridas en todos los módulos precedentes. El alumno debe superar este examen con el puntaje mínimo configurado para ser declarado <strong>APTO</strong> para la emisión de su certificado digital con código UUID.
                    </p>
                  </div>
                </div>

                <QuizEditorSection
                  stepNumber={null}
                  isFinal={true}
                  quiz={finalQuiz}
                  onChange={onUpdateFinalQuiz}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
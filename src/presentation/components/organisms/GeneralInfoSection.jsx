import React from 'react';
import { SectionHeader } from '../molecules/SectionHeader';
import { FormField } from '../molecules/FormField';
import { Input } from '../atoms/Input';
import { Textarea } from '../atoms/Textarea';
import { CoverUploader } from '../molecules/CoverUploader';

export function GeneralInfoSection({
  titulo,
  resumen,
  descripcion,
  portada_path,
  onUpdate,
}) {
  return (
    <div className="form-card">
      <SectionHeader
        stepNumber="Paso 1"
        title="Información general"
        subtitle="Datos visibles en la portada y catálogo público de la academia."
      />

      <div className="form-grid grid-1">
        <FormField label="Título del curso" required htmlFor="titulo">
          <Input
            id="titulo"
            placeholder="Ej. Arquitectura Web y Seguridad en APIs"
            value={titulo}
            onChange={(e) => onUpdate('titulo', e.target.value)}
            required
          />
        </FormField>

        <FormField
          label="Resumen ejecutivo"
          required
          htmlFor="resumen"
          hint="Breve introducción de una o dos oraciones que sintetice el valor del curso."
        >
          <Input
            id="resumen"
            placeholder="Ej. Domina la construcción de aplicaciones reactivas, servicios concurrentes y microservicios protegidos."
            value={resumen}
            onChange={(e) => onUpdate('resumen', e.target.value)}
            required
          />
        </FormField>

        <FormField
          label="Descripción detallada"
          required
          htmlFor="descripcion"
          hint="Detalla las competencias que desarrollará el estudiante y metodología de aprendizaje."
        >
          <Textarea
            id="descripcion"
            rows={4}
            placeholder="Describe los temas clave, proyectos prácticos y requisitos recomendados..."
            value={descripcion}
            onChange={(e) => onUpdate('descripcion', e.target.value)}
            required
          />
        </FormField>

        <FormField label="Imagen de portada" hint="Recomendado: formato 16:9 de alta resolución.">
          <CoverUploader
            value={portada_path}
            onChange={(url) => onUpdate('portada_path', url)}
          />
        </FormField>
      </div>
    </div>
  );
}

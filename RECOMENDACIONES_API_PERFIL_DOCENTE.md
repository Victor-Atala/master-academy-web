# 🎓 Recomendaciones de Arquitectura y Endpoints: Módulo de Perfil e Instructor
**Proyecto:** Master Academy • Instructor Studio (`admin_web`) & API Backend (`api-masteracademy`)  
**Fecha:** Septiembre 2026  
**Estado Actual:** Implementación temporal en frontend con endpoints existentes (`/auth/profile`, `/auth/password`, `/auth/me`, `/auth/login`, `/auth/register`).

---

## 📌 1. Diagnóstico del Estado Actual vs. Brecha Funcional (Gap Analysis)

Durante la auditoría del backend Laravel (`api-masteracademy`), se identificó lo siguiente:

| Componente en Backend | Estado en BD / Modelos | Rutas en `routes/api.php` | Controlador / Endpoints |
| :--- | :--- | :--- | :--- |
| **Usuario Base (`User`)** | ✅ Campos `id`, `name`, `email`, `biografia`, `instructor` | ✅ `/auth/login`, `/auth/register`, `/auth/me`, `/auth/profile`, `/auth/password`, `/auth/logout` | ✅ `AuthController.php`, `UserProfileController.php` |
| **Perfil Docente (`InstructorProfile`)** | ✅ Tabla `instructor_profiles` (`headline`, `bio`, `website_url`, `status`, `verified_at`, `payout_preferences`, `metadata`) | ❌ **0 rutas definidas** | ❌ **Inexistente** (El modelo está huérfano) |
| **Carga de Avatar / Foto** | ❌ Campo tipo string sin carga de archivos en almacenamiento local/S3 | ❌ **0 rutas de subida multipart/form-data** | ❌ No existe controller para subida de imágenes de perfil |
| **Monetización y Liquidaciones** | ✅ Relación `settlements()` en modelo `User`, columna `payout_preferences` en `instructor_profiles` | ❌ **0 rutas para configurar cuenta de retiro** | ❌ No hay endpoints para CLABE, PayPal o Stripe |
| **Acreditación / Verificación** | ✅ Columna `status` ('pending', 'approved', 'rejected') y `verified_at` | ❌ **0 rutas de postulación docente** | ❌ No hay flujo para solicitar ser docente |

### 🛠️ ¿Cómo se resolvió temporalmente en `admin_web`?
Se conectó la interfaz moderna y maximalista al endpoint existente `PATCH /api/v1/auth/profile` para editar nombre, email y biografía general del usuario, y a `PUT /api/v1/auth/password` para seguridad. Para los datos docentes extendidos (headline, estado de verificación, especialidad y redes), el frontend consume los datos estructurados con persistencia reactiva y fallback inteligente, listo para recibir los endpoints definitivos sin alterar la experiencia de usuario.

---

## 🚀 2. Recomendaciones de Nuevos Endpoints y Justificación Técnica / de Negocio

A continuación se detallan los 5 módulos recomendados para ser implementados en la API de Laravel:

### 💡 Recomendación 1: Endpoints Dedicados para el Perfil Docente (`/api/v1/instructor/profile`)
* **Endpoints propuestos:**
  - `GET /api/v1/instructor/profile`: Obtiene el perfil docente completo junto con métricas agregadas (cursos publicados, estudiantes activos, calificación promedio, estatus de verificación).
  - `PUT /api/v1/instructor/profile`: Actualiza los datos profesionales del docente (`headline`, `bio`, `website_url`, `social_links`, `specialties`).
* **¿Por qué es una excelente sugerencia implementarlo?**
  1. **Principio de Responsabilidad Única (SRP):** Un usuario en la plataforma puede ser estudiante y docente al mismo tiempo. Sobrecargar la tabla `users` con datos docentes (como especialidades, sitio web o RFC) rompe la normalización y ensucia la autenticación básica.
  2. **Aprovechamiento de la Arquitectura Existente:** El modelo `App\Models\InstructorProfile` y la migración `create_instructor_profiles_table` **ya existen** en el proyecto Laravel. Crear estos endpoints activa código que actualmente está inactivo e infrautilizado.
  3. **Consumo Unificado Móvil/Web:** Tanto la app móvil Flutter/Kotlin (`MA_movil`) como el panel administrativo web (`admin_web`) podrán mostrar la ficha pública del docente y su pantalla de edición con exactamente el mismo contrato JSON.

---

### 💡 Recomendación 2: Subida de Fotografía de Perfil / Avatar (`POST /api/v1/auth/avatar`)
* **Endpoint propuesto:**
  - `POST /api/v1/auth/avatar` (`Content-Type: multipart/form-data`, campo `avatar: file|image|mimes:jpeg,png,webp|max:2048`).
* **¿Por qué es una excelente sugerencia implementarlo?**
  1. **Credibilidad y Confianza de los Estudiantes:** En plataformas educativas, los estudiantes compran cursos impartidos por instructores con presencia real y profesional. Los avatares por defecto o enlaces externos genéricos reducen las tasas de conversión de cursos.
  2. **Seguridad y Optimización en Storage:** Permite a Laravel utilizar `Storage::disk('public')` o Amazon S3, aplicando redimensionamiento automático (por ejemplo con `Intervention Image` o WebP optimizado) y evitando que los usuarios inserten URLs externas que puedan ser rotas o maliciosas.

---

### 💡 Recomendación 3: Configuración de Preferencias de Pago y Liquidación (`/api/v1/instructor/payout-preferences`)
* **Endpoints propuestos:**
  - `GET /api/v1/instructor/payout-preferences`
  - `PUT /api/v1/instructor/payout-preferences`
* **Campos sugeridos en el JSON:**
  ```json
  {
    "payment_method": "spei", // "spei" | "paypal" | "stripe"
    "clabe": "012180015678901234",
    "bank_name": "BBVA México",
    "beneficiary_name": "Nombre Fiscal del Instructor",
    "rfc": "XAXX010101000",
    "paypal_email": "pagos@docente.mx"
  }
  ```
* **¿Por qué es una excelente sugerencia implementarlo?**
  1. **Monetización Real y Cierre de Ventas:** El backend ya cuenta con el modelo `Settlement` y la columna `payout_preferences`. Sin este endpoint, el sistema de venta de cursos no tiene forma de transferir las regalías o comisiones ganadas a los docentes.
  2. **Cumplimiento Fiscal y Bancario:** Provee una estructura cifrada para guardar datos sensibles como CLABE interbancaria o RFC, esencial para la emisión de comprobantes y pagos automáticos a fin de mes.

---

### 💡 Recomendación 4: Flujo de Acreditación y Verificación Docente (`/api/v1/instructor/apply` y `/admin/instructors/{id}/verify`)
* **Endpoints propuestos:**
  - `POST /api/v1/instructor/apply`: Formulario donde un usuario solicita convertirse en docente, adjuntando CV, LinkedIn y áreas de especialidad.
  - `PATCH /api/v1/admin/instructors/{id}/status`: Endpoint para administradores para aprobar (`approved`), rechazar (`rejected`) o verificar (`verified_at = now()`).
* **¿Por qué es una excelente sugerencia implementarlo?**
  1. **Control de Calidad Académica de Master Academy:** Protege el prestigio de la institución asegurando que solo instructores calificados y validados puedan publicar cursos de pago en el catálogo general.
  2. **Incentivo y Gamificación (Badge de Verificado):** Mostrar el distintivo "Docente Verificado" en la web y la app móvil incrementa el valor percibido de los cursos y estimula a los profesores a completar su perfil al 100%.

---

### 💡 Recomendación 5: Roles y Permisos Granulares vía Spatie (`spatie/laravel-permission`)
* **Propuesta:** Asegurar que los endpoints `/auth/me` y `/auth/login` retornen los arrays:
  ```json
  {
    "roles": ["INSTRUCTOR"],
    "permissions": [
      "courses.create",
      "courses.update",
      "inquiries.reply",
      "coupons.manage",
      "certificates.issue"
    ]
  }
  ```
* **¿Por qué es una excelente sugerencia implementarlo?**
  1. **Seguridad Robusta en Backend:** Permite proteger rutas con `$this->authorize('update', $course)` o Form Requests que verifiquen `$user->can('courses.create')`.
  2. **UI Adaptativa en Frontend:** La barra lateral y los botones del panel docente (`admin_web`) pueden ocultar o deshabilitar acciones según los permisos exactos otorgados por la institución sin necesidad de hardcodear lógica en el cliente.

---

## 💻 3. Código Sugerido para Implementar en Laravel (`api-masteracademy`)

A continuación se entregan los archivos listos para copiar y pegar en el proyecto Laravel cuando se decida implementar la fase definitiva:

### 1) En `routes/api.php`:
```php
use App\Http\Controllers\Api\InstructorProfileController;

Route::prefix('v1')->middleware(['auth:sanctum'])->group(function () {
    // Perfil de Instructor
    Route::get('instructor/profile', [InstructorProfileController::class, 'show']);
    Route::put('instructor/profile', [InstructorProfileController::class, 'update']);
    Route::put('instructor/payout-preferences', [InstructorProfileController::class, 'updatePayoutPreferences']);
    Route::post('instructor/avatar', [InstructorProfileController::class, 'uploadAvatar']);
});
```

### 2) Controlador `app/Http/Controllers/Api/InstructorProfileController.php`:
```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InstructorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InstructorProfileController extends Controller
{
    /**
     * Obtener el perfil docente del usuario autenticado.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = $user->instructorProfile ?? InstructorProfile::firstOrCreate([
            'user_id' => $user->id,
        ], [
            'headline' => 'Instructor en Master Academy',
            'status' => $user->instructor ? 'approved' : 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'data' => [
                'user_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar_url' => $user->avatar ? Storage::disk('public')->url($user->avatar) : null,
                'headline' => $profile->headline,
                'bio' => $profile->bio ?? $user->biografia,
                'website_url' => $profile->website_url,
                'status' => $profile->status,
                'verified_at' => $profile->verified_at,
                'payout_preferences' => $profile->payout_preferences,
                'courses_count' => $user->teachingCourses()->count(),
                'total_students' => $user->teachingCourses()->withCount('enrollments')->get()->sum('enrollments_count'),
            ]
        ]);
    }

    /**
     * Actualizar información académica y profesional del docente.
     */
    public function update(Request $request)
    {
        $request->validate([
            'headline' => 'nullable|string|max:120',
            'bio' => 'nullable|string|max:2000',
            'website_url' => 'nullable|url|max:255',
        ]);

        $user = $request->user();
        $profile = $user->instructorProfile()->firstOrCreate(['user_id' => $user->id]);

        $profile->update($request->only(['headline', 'bio', 'website_url']));

        if ($request->filled('bio')) {
            $user->update(['biografia' => $request->input('bio')]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Perfil docente actualizado exitosamente.',
            'data' => $profile
        ]);
    }

    /**
     * Actualizar preferencias bancarias y de liquidación.
     */
    public function updatePayoutPreferences(Request $request)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:spei,paypal,stripe',
            'clabe' => 'nullable|string|size:18',
            'bank_name' => 'nullable|string|max:100',
            'beneficiary_name' => 'nullable|string|max:150',
            'rfc' => 'nullable|string|max:13',
            'paypal_email' => 'nullable|email',
        ]);

        $user = $request->user();
        $profile = $user->instructorProfile()->firstOrCreate(['user_id' => $user->id]);

        $profile->payout_preferences = $validated;
        $profile->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Preferencias de pago guardadas con éxito.',
            'data' => $profile->payout_preferences
        ]);
    }

    /**
     * Subida y almacenamiento seguro de avatar.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = $request->user();

        if ($request->hasFile('avatar')) {
            // Eliminar avatar anterior si existe
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $path]);

            return response()->json([
                'status' => 'success',
                'message' => 'Foto de perfil actualizada.',
                'avatar_url' => Storage::disk('public')->url($path),
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'Archivo no recibido'], 400);
    }
}
```

---

## 🎯 4. Conclusión y Próximos Pasos

1. **Frontend listo:** El panel web `admin_web` ya cuenta con el sistema de autenticación (`useAuth`), protección de rutas, formulario de login/registro docente, y la pantalla de **Mi Perfil** conectada a los endpoints existentes de Sanctum (`/auth/profile` y `/auth/password`).
2. **Transición transparente:** Al momento de agregar el controlador `InstructorProfileController` en Laravel, el repositorio en frontend `src/data/repositories/authRepository.js` comenzará a utilizar de forma nativa los nuevos endpoints sin requerir rehacer la interfaz gráfica.

// Master Academy Studio - Course Management Engine

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8000/api/v1'
  : `http://${window.location.hostname}:8000/api/v1`;

let moduleCounter = 0;
let existingCourses = [];
let activeCategoryFilter = 'all';
let searchQuery = '';

// DOM Elements
const categorySelect = document.getElementById('category_id');
const courseForm = document.getElementById('courseForm');
const modulesContainer = document.getElementById('modulesContainer');
const btnAddModule = document.getElementById('btnAddModule');
const btnFillDemo = document.getElementById('btnFillDemo');
const btnClearForm = document.getElementById('btnClearForm');
const portadaInput = document.getElementById('portada_path');
const coverPreviewImg = document.getElementById('coverPreviewImg');
const btnSubmit = document.getElementById('btnSubmitCourse');
const btnSubmitText = document.getElementById('btnSubmitText');
const successModal = document.getElementById('successModal');
const btnCloseModal = document.getElementById('btnCloseModal');

// Tabs
const tabBtnCreate = document.getElementById('tabBtnCreate');
const tabBtnCatalog = document.getElementById('tabBtnCatalog');
const createView = document.getElementById('createView');
const catalogView = document.getElementById('catalogView');
const coursesCountBadge = document.getElementById('coursesCountBadge');

// Catalog Elements
const catalogGrid = document.getElementById('catalogGrid');
const catalogSearch = document.getElementById('catalogSearch');
const categoryPills = document.getElementById('categoryPills');
const btnRefreshCatalog = document.getElementById('btnRefreshCatalog');

// Syllabus Modal Elements
const syllabusModal = document.getElementById('syllabusModal');
const syllabusCourseTitle = document.getElementById('syllabusCourseTitle');
const syllabusCat = document.getElementById('syllabusCat');
const syllabusContent = document.getElementById('syllabusContent');
const btnCloseSyllabus = document.getElementById('btnCloseSyllabus');

// 1. Initial Setup
async function init() {
  await loadCategories();
  setupPresets();
  setupEventListeners();

  // Load existing courses count and catalog
  await fetchExistingCourses();

  // Add initial blank module
  addModule('Módulo 1: Fundamentos y Conceptos Clave', [
    {
      title: 'Lección 1: Introducción y Metodología',
      desc: 'Visión general del curso y preparación del entorno de trabajo.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ]);

  // Initial tab state
  switchTab('createView');
}

// 2. Tab Navigation with Button Visibility Logic
function switchTab(viewId) {
  if (viewId === 'createView') {
    tabBtnCreate.classList.add('active');
    tabBtnCatalog.classList.remove('active');
    createView.classList.add('active');
    catalogView.classList.remove('active');

    // Show Demo Course button ONLY in Create View
    btnFillDemo.style.display = 'inline-flex';
  } else {
    tabBtnCatalog.classList.add('active');
    tabBtnCreate.classList.remove('active');
    catalogView.classList.add('active');
    createView.classList.remove('active');

    // Hide Demo Course button in Catalog View
    btnFillDemo.style.display = 'none';

    fetchExistingCourses();
  }
}

// 3. Load Categories
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, { headers: { 'Accept': 'application/json' } });
    if (res.ok) {
      const json = await res.json();
      const categories = json.data || json || [];
      if (Array.isArray(categories) && categories.length > 0) {
        categorySelect.innerHTML = categories.map(c => `
          <option value="${c.id}">${c.nombre || c.name}</option>
        `).join('');
      }
    }
  } catch (e) {
    console.warn('Could not load categories:', e.message);
  }
}

// 4. Fetch & Render Catalog
async function fetchExistingCourses() {
  catalogGrid.innerHTML = `
    <div class="loading-box">
      <div class="spinner"></div>
      <p>Cargando cursos...</p>
    </div>
  `;

  try {
    const res = await fetch(`${API_BASE}/courses?per_page=50`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error('Error al consultar cursos');

    const json = await res.json();
    existingCourses = json.data || [];

    // Update count badge
    coursesCountBadge.textContent = existingCourses.length;

    renderCatalog();
  } catch (err) {
    console.error(err);
    catalogGrid.innerHTML = `
      <div class="empty-box">
        <p style="color: var(--color-danger);">No se pudieron cargar los cursos del servidor.</p>
        <button type="button" class="btn btn-outline-clean" onclick="window.fetchExistingCourses()" style="margin-top: 10px;">Reintentar</button>
      </div>
    `;
  }
}
window.fetchExistingCourses = fetchExistingCourses;

function renderCatalog() {
  const filtered = existingCourses.filter(c => {
    const catName = (c.category && (c.category.nombre || c.category.name)) || '';
    const matchCat = activeCategoryFilter === 'all' || catName.toLowerCase().includes(activeCategoryFilter.toLowerCase());

    const title = (c.title || c.titulo || '').toLowerCase();
    const summary = (c.summary || c.resumen || '').toLowerCase();
    const instructor = (c.instructor && (c.instructor.name || c.instructor.nombre) || '').toLowerCase();
    const matchSearch = !searchQuery || title.includes(searchQuery) || summary.includes(searchQuery) || instructor.includes(searchQuery);

    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    catalogGrid.innerHTML = `
      <div class="empty-box">
        <p>No se encontraron cursos con los filtros seleccionados.</p>
      </div>
    `;
    return;
  }

  catalogGrid.innerHTML = filtered.map(c => {
    const catName = (c.category && (c.category.nombre || c.category.name)) || 'General';
    const coverUrl = (c.cover && c.cover.path) || c.portada_path || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
    const level = c.level || c.nivel || 'Intermedio';
    const hours = c.hours || '12';
    const lessonsCount = c.lessons_count || c.syllabi_count || 0;
    const instructorName = (c.instructor && (c.instructor.name || c.instructor.nombre)) || 'Master Academy';

    let basePrice = '450.00';
    let promoPrice = '349.00';
    if (c.prices && c.prices.length > 0) {
      basePrice = c.prices[0].base_amount || c.prices[0].amount || basePrice;
      promoPrice = c.prices[0].promotional_amount || basePrice;
    }

    return `
      <div class="course-card-item" data-id="${c.id}">
        <div class="card-media-wrap">
          <img src="${coverUrl}" alt="${c.title || 'Curso'}" onerror="this.src='https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600'" />
          <div class="card-tags-overlay">
            <span class="card-category-badge">${catName}</span>
            <span class="card-level-badge">${level}</span>
          </div>
        </div>

        <div class="card-content">
          <h3 class="card-course-title">${c.title || c.titulo || 'Curso sin título'}</h3>
          <p class="card-course-summary">${c.summary || c.resumen || c.description || ''}</p>

          <div class="card-meta-bar">
            <span>⏱️ ${hours}h</span>
            <span>📚 ${lessonsCount} clases</span>
            <span>👤 ${instructorName.split(' ')[0]}</span>
          </div>

          <div class="card-bottom-row">
            <div class="price-box">
              ${parseFloat(promoPrice) < parseFloat(basePrice) ? `<span class="price-strike">$${parseFloat(basePrice).toFixed(0)}</span>` : ''}
              <span class="price-main">$${parseFloat(promoPrice).toFixed(0)} MXN</span>
            </div>

            <div class="card-buttons">
              <button type="button" class="btn btn-outline-clean" onclick="window.viewCourseSyllabus(${c.id}, '${encodeURIComponent(c.title || c.titulo || '')}', '${encodeURIComponent(catName)}')">
                <span>Ver temario</span>
              </button>
              <button type="button" class="btn-icon-subtle" title="Eliminar curso" onclick="window.deleteCourse(${c.id}, '${encodeURIComponent(c.title || c.titulo || '')}')">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18"/>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// 5. Syllabus Inspection Modal
async function viewCourseSyllabus(courseId, rawTitle, rawCategory) {
  const title = decodeURIComponent(rawTitle);
  const category = decodeURIComponent(rawCategory);

  syllabusCourseTitle.textContent = title;
  syllabusCat.textContent = category;
  syllabusContent.innerHTML = `
    <div class="loading-box">
      <div class="spinner"></div>
      <p>Cargando temario...</p>
    </div>
  `;
  syllabusModal.classList.add('active');

  try {
    const res = await fetch(`${API_BASE}/courses/${courseId}/syllabi`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!res.ok) throw new Error('No se pudo cargar el temario');

    const json = await res.json();
    const modules = json.data || json || [];

    if (!Array.isArray(modules) || modules.length === 0) {
      syllabusContent.innerHTML = `
        <div class="empty-box">
          <p>Este curso no tiene módulos registrados.</p>
        </div>
      `;
      return;
    }

    syllabusContent.innerHTML = modules.map((mod, idx) => {
      const lessons = mod.children || mod.lessons || [];
      return `
        <div class="syllabus-module-box">
          <div class="syllabus-module-title">
            Módulo ${idx + 1}: ${mod.title || mod.titulo || 'Módulo'}
          </div>
          <div>
            ${lessons.length === 0 ? '<p style="font-size: 0.8rem; color: var(--text-muted);">Sin lecciones registradas.</p>' : ''}
            ${lessons.map((les, lIdx) => `
              <div class="syllabus-lesson-row">
                <div>
                  <span style="font-weight: 500; color: #fff;">${lIdx + 1}. ${les.title || les.titulo || 'Lección'}</span>
                  ${les.content || les.contenido ? `<p style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 1px;">${les.content || les.contenido}</p>` : ''}
                </div>
                ${les.video ? `
                  <a href="${les.video}" target="_blank" title="Abrir video">
                    Ver video ▶
                  </a>
                ` : '<span style="font-size: 0.72rem; color: var(--text-muted);">Sin video</span>'}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    syllabusContent.innerHTML = `<p style="color: var(--color-danger);">Error al consultar el temario: ${err.message}</p>`;
  }
}
window.viewCourseSyllabus = viewCourseSyllabus;

// 6. Delete Course
async function deleteCourse(courseId, rawTitle) {
  const title = decodeURIComponent(rawTitle);
  const ok = confirm(`¿Deseas eliminar el curso "${title}"?\nEsta acción no se puede deshacer.`);
  if (!ok) return;

  try {
    const res = await fetch(`${API_BASE}/admin/courses/${courseId}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'No se pudo eliminar el curso');

    await fetchExistingCourses();
  } catch (err) {
    alert(`Error: ${err.message}`);
  }
}
window.deleteCourse = deleteCourse;

// 7. Preset Covers
function setupPresets() {
  document.querySelectorAll('.preset-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      portadaInput.value = url;
      coverPreviewImg.src = url;
    });
  });

  portadaInput.addEventListener('input', () => {
    if (portadaInput.value.trim()) {
      coverPreviewImg.src = portadaInput.value.trim();
    }
  });

  coverPreviewImg.addEventListener('error', () => {
    coverPreviewImg.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
  });
}

// 8. Modules & Lessons Form Builder
function addModule(defaultTitle = '', defaultLessons = []) {
  moduleCounter++;
  const moduleId = `module_${Date.now()}_${moduleCounter}`;

  const moduleRow = document.createElement('div');
  moduleRow.className = 'module-row';
  moduleRow.id = moduleId;

  moduleRow.innerHTML = `
    <div class="module-bar">
      <span class="module-label">Módulo ${moduleCounter}</span>
      <input type="text" class="module-title-input" value="${defaultTitle || `Módulo ${moduleCounter}`}" placeholder="Título del módulo" required />
      <button type="button" class="btn btn-outline-clean btn-sm btn-add-lesson">+ Agregar clase</button>
      <button type="button" class="btn-icon-subtle btn-remove-module" title="Eliminar módulo">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 6h18"/>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
        </svg>
      </button>
    </div>
    <div class="lessons-container"></div>
  `;

  modulesContainer.appendChild(moduleRow);

  const lessonsContainer = moduleRow.querySelector('.lessons-container');
  const btnAddLesson = moduleRow.querySelector('.btn-add-lesson');
  const btnRemoveModule = moduleRow.querySelector('.btn-remove-module');

  btnAddLesson.addEventListener('click', () => addLesson(lessonsContainer));

  btnRemoveModule.addEventListener('click', () => {
    if (modulesContainer.children.length > 1) {
      moduleRow.remove();
    } else {
      alert('El programa debe contar con al menos un módulo.');
    }
  });

  if (defaultLessons && defaultLessons.length > 0) {
    defaultLessons.forEach(l => addLesson(lessonsContainer, l.title, l.desc, l.video));
  } else {
    addLesson(lessonsContainer);
  }
}

function addLesson(container, defaultTitle = '', defaultDesc = '', defaultVideo = '') {
  const lessonCount = container.children.length + 1;
  const lessonRow = document.createElement('div');
  lessonRow.className = 'lesson-row';

  lessonRow.innerHTML = `
    <div class="lesson-header-row">
      <input type="text" class="lesson-name-input" value="${defaultTitle || `Clase ${lessonCount}`}" placeholder="Título de la clase" required />
      <button type="button" class="btn-icon-subtle btn-remove-lesson" title="Eliminar clase">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="form-grid">
      <div class="form-field">
        <label style="font-size: 0.74rem;">Descripción breve</label>
        <input type="text" class="lesson-desc-input" value="${defaultDesc || ''}" placeholder="Conceptos abordados" />
      </div>
      <div class="form-field">
        <label style="font-size: 0.74rem;">Enlace del video (MP4)</label>
        <input type="url" class="lesson-video-input" value="${defaultVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'}" placeholder="https://...mp4" required />
        <div class="video-presets-bar">
          <span style="font-size: 0.68rem; color: var(--text-muted);">Videos demo:</span>
          <span class="video-preset-btn" data-v="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">Video 1</span>
          <span class="video-preset-btn" data-v="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4">Video 2</span>
          <span class="video-preset-btn" data-v="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4">Video 3</span>
        </div>
      </div>
    </div>
  `;

  container.appendChild(lessonRow);

  const btnRemove = lessonRow.querySelector('.btn-remove-lesson');
  btnRemove.addEventListener('click', () => {
    if (container.children.length > 1) {
      lessonRow.remove();
    } else {
      alert('Cada módulo debe contener al menos una clase.');
    }
  });

  lessonRow.querySelectorAll('.video-preset-btn').forEach(chip => {
    chip.addEventListener('click', () => {
      lessonRow.querySelector('.lesson-video-input').value = chip.getAttribute('data-v');
    });
  });
}

// 9. Pre-fill with Demo Course
function fillDemoCourse() {
  switchTab('createView');
  document.getElementById('titulo').value = 'Inteligencia Artificial y Modelos LLM en Producción';
  document.getElementById('resumen').value = 'Desarrollo de agentes autónomos, pipelines RAG avanzados y despliegue de modelos de lenguaje en entornos corporativos.';
  document.getElementById('descripcion').value = 'En este programa dominarás el diseño, implementación y despliegue de soluciones de Inteligencia Artificial Generativa. Aprenderás a orquestar agentes con llamada a funciones, construir arquitecturas RAG de alta precisión e implementar guardrails de seguridad.';
  
  const demoCover = 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600';
  document.getElementById('portada_path').value = demoCover;
  coverPreviewImg.src = demoCover;

  categorySelect.value = '1';
  document.getElementById('nivel').value = 'Avanzado';
  document.getElementById('horas').value = 24;
  document.getElementById('precio').value = '549.00';
  document.getElementById('precio_promocional').value = '399.00';

  modulesContainer.innerHTML = '';
  moduleCounter = 0;

  addModule('Módulo 1: Arquitectura RAG y Embeddings Semánticos', [
    {
      title: 'Clase 1: Fundamentos de Modelos LLM y Embeddings',
      desc: 'Comprensión de espacios vectoriales y representación semántica.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      title: 'Clase 2: Bases de Datos Vectoriales y Recuperación Híbrida',
      desc: 'Indexación HNSW e integración con bases de datos vectoriales.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    }
  ]);

  addModule('Módulo 2: Agentes Autónomos y Despliegue', [
    {
      title: 'Clase 3: Orquestación de Herramientas y Tool Calling',
      desc: 'Llamada estructurada a funciones externas para flujos de trabajo autónomos.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
    },
    {
      title: 'Clase 4: Evaluación y Seguridad en Entornos Productivos',
      desc: 'Control de fidelidad, mitigación de alucinaciones y guardrails de seguridad.',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    }
  ]);
}

// 10. Clear Form Fields
function clearForm() {
  courseForm.reset();
  modulesContainer.innerHTML = '';
  moduleCounter = 0;
  coverPreviewImg.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';
  addModule();
}

// 11. Form Submission
async function handleSubmit(e) {
  e.preventDefault();

  const titulo = document.getElementById('titulo').value.trim();
  const resumen = document.getElementById('resumen').value.trim();
  const descripcion = document.getElementById('descripcion').value.trim();
  const categoryId = parseInt(categorySelect.value, 10);
  const nivel = document.getElementById('nivel').value;
  const horas = parseFloat(document.getElementById('horas').value) || 10;
  const precio = parseFloat(document.getElementById('precio').value) || 0;
  const precioPromocional = parseFloat(document.getElementById('precio_promocional').value) || precio;
  const portada = portadaInput.value.trim() || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600';

  if (!titulo) {
    alert('Por favor ingresa el título del curso.');
    return;
  }

  const modulos = [];
  const moduleRows = modulesContainer.querySelectorAll('.module-row');

  moduleRows.forEach(mr => {
    const modTitle = mr.querySelector('.module-title-input').value.trim();
    const lessons = [];
    const lessonRows = mr.querySelectorAll('.lesson-row');

    lessonRows.forEach(lr => {
      const lessonTitle = lr.querySelector('.lesson-name-input').value.trim();
      const lessonDesc = lr.querySelector('.lesson-desc-input').value.trim();
      const lessonVideo = lr.querySelector('.lesson-video-input').value.trim();

      lessons.push({
        titulo: lessonTitle || 'Clase',
        contenido: lessonDesc || null,
        video: lessonVideo || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      });
    });

    modulos.push({
      titulo: modTitle || 'Módulo',
      lecciones: lessons
    });
  });

  const payload = {
    titulo,
    resumen,
    descripcion,
    category_id: categoryId,
    nivel,
    horas,
    precio,
    precio_promocional: precioPromocional,
    portada_path: portada,
    modulos
  };

  btnSubmit.disabled = true;
  btnSubmitText.textContent = 'Publicando curso...';

  try {
    const res = await fetch(`${API_BASE}/admin/courses/create-full`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Error al publicar el curso');
    }

    const created = data.course;
    document.getElementById('modalTitle').textContent = created.title;
    document.getElementById('modalCover').src = created.cover_url;
    document.getElementById('modalCategory').textContent = created.category_name;
    document.getElementById('modalPrice').textContent = `$${parseFloat(created.price).toFixed(0)} MXN`;

    successModal.classList.add('active');

    // Reset form
    clearForm();

  } catch (err) {
    console.error(err);
    alert(`Error: ${err.message}`);
  } finally {
    btnSubmit.disabled = false;
    btnSubmitText.textContent = 'Publicar curso';
  }
}

// 12. Setup Event Listeners
function setupEventListeners() {
  tabBtnCreate.addEventListener('click', () => switchTab('createView'));
  tabBtnCatalog.addEventListener('click', () => switchTab('catalogView'));

  btnAddModule.addEventListener('click', () => addModule());
  btnFillDemo.addEventListener('click', fillDemoCourse);
  btnClearForm.addEventListener('click', clearForm);
  courseForm.addEventListener('submit', handleSubmit);

  btnCloseModal.addEventListener('click', () => {
    successModal.classList.remove('active');
    switchTab('catalogView');
  });

  btnCloseSyllabus.addEventListener('click', () => {
    syllabusModal.classList.remove('active');
  });

  btnRefreshCatalog.addEventListener('click', fetchExistingCourses);

  catalogSearch.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderCatalog();
  });

  categoryPills.querySelectorAll('.cat-filter-btn').forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.querySelectorAll('.cat-filter-btn').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategoryFilter = pill.getAttribute('data-cat');
      renderCatalog();
    });
  });
}

document.addEventListener('DOMContentLoaded', init);

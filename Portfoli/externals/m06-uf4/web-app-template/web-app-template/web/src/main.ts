// API URL
const API_URL = 'http://localhost:3000/api/categories'

// Estado
let currentPage = 1
let editingId: number | null = null

// Elementos del DOM
let btnCreate: HTMLButtonElement
let btnPrev: HTMLButtonElement
let btnNext: HTMLButtonElement
let btnCloseModal: HTMLButtonElement
let btnCancel: HTMLButtonElement
let modal: HTMLDivElement
let formCategory: HTMLFormElement
let inputName: HTMLInputElement
let modalTitle: HTMLHeadingElement
let tableBody: HTMLTableSectionElement
let pageInfo: HTMLSpanElement
let spinner: HTMLDivElement

// Inicializar cuando el DOM esté listo
function initDOM() {
  btnCreate = document.getElementById('btnCreate') as HTMLButtonElement
  btnPrev = document.getElementById('btnPrev') as HTMLButtonElement
  btnNext = document.getElementById('btnNext') as HTMLButtonElement
  btnCloseModal = document.getElementById('btnCloseModal') as HTMLButtonElement
  btnCancel = document.getElementById('btnCancel') as HTMLButtonElement
  modal = document.getElementById('modal') as HTMLDivElement
  formCategory = document.getElementById('formCategory') as HTMLFormElement
  inputName = document.getElementById('inputName') as HTMLInputElement
  modalTitle = document.getElementById('modalTitle') as HTMLHeadingElement
  tableBody = document.getElementById('tableBody') as HTMLTableSectionElement
  pageInfo = document.getElementById('pageInfo') as HTMLSpanElement
  spinner = document.getElementById('spinner') as HTMLDivElement
}

// Funciones de spinner
function showSpinner() {
  spinner.classList.remove('hidden')
}

function hideSpinner() {
  spinner.classList.add('hidden')
}

// Funciones de modal
function openModal(isEdit: boolean, id?: number) {
  editingId = id || null
  inputName.value = ''
  
  if (isEdit) {
    modalTitle.textContent = 'Editar Categoría'
  } else {
    modalTitle.textContent = 'Nueva Categoría'
  }
  
  modal.classList.remove('hidden')
  inputName.focus()
}

function closeModal() {
  modal.classList.add('hidden')
  editingId = null
}

// Cargar datos de la API
async function loadCategories(page: number = 1) {
  showSpinner()
  
  try {
    const response = await fetch(`${API_URL}?page=${page}`)
    
    if (!response.ok) {
      throw new Error('Error al cargar categorías')
    }
    
    const data = await response.json()
    
    currentPage = page
    renderTable(data.data)
    updatePagination(data)
  } catch (error) {
    console.error(error)
    tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px; color: #f56565;">Error al cargar datos</td></tr>'
  } finally {
    hideSpinner()
  }
}

// Renderizar tabla
function renderTable(categories: any[]) {
  if (categories.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="3" style="text-align: center; padding: 20px;">No hay categorías</td></tr>'
    return
  }

  tableBody.innerHTML = categories
    .map(
      (cat) => `
      <tr>
        <td>${cat.category_id}</td>
        <td>${cat.name}</td>
        <td>
          <div class="table-actions">
            <button class="btn btn-success" onclick="handleEdit(${cat.category_id})">Editar</button>
            <button class="btn btn-danger" onclick="handleDelete(${cat.category_id})">Eliminar</button>
          </div>
        </td>
      </tr>
    `
    )
    .join('')
}

// Actualizar información de paginación
function updatePagination(data: any) {
  pageInfo.textContent = `Página ${data.page} de ${data.pages}`
  
  // Desabilitar botones si es necesario
  btnPrev.disabled = data.page === 1
  btnNext.disabled = data.page === data.pages
}

// Crear nueva categoría
async function handleCreate() {
  const name = inputName.value.trim()

  if (!name) {
    alert('Por favor ingresa un nombre')
    return
  }

  showSpinner()
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })

    if (!response.ok) {
      throw new Error('Error al crear categoría')
    }

    closeModal()
    loadCategories(1)
    alert('Categoría creada exitosamente')
  } catch (error) {
    console.error(error)
    alert('Error al crear categoría')
  } finally {
    hideSpinner()
  }
}

// Actualizar categoría
async function handleUpdate(id: number) {
  const name = inputName.value.trim()

  if (!name) {
    alert('Por favor ingresa un nombre')
    return
  }

  showSpinner()
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })

    if (!response.ok) {
      throw new Error('Error al actualizar categoría')
    }

    closeModal()
    loadCategories(currentPage)
    alert('Categoría actualizada exitosamente')
  } catch (error) {
    console.error(error)
    alert('Error al actualizar categoría')
  } finally {
    hideSpinner()
  }
}

// Editar categoría (cargar datos)
async function handleEdit(id: number) {
  try {
    const response = await fetch(`${API_URL}/${id}`)
    
    if (!response.ok) {
      throw new Error('Error al cargar categoría')
    }
    
    const category = await response.json()
    inputName.value = category.name
    openModal(true, id)
  } catch (error) {
    console.error(error)
    alert('Error al cargar categoría')
  }
}

// Eliminar categoría
async function handleDelete(id: number) {
  if (!confirm('¿Estás seguro que deseas eliminar esta categoría?')) {
    return
  }

  showSpinner()
  
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error('Error al eliminar categoría')
    }

    loadCategories(currentPage)
    alert('Categoría eliminada exitosamente')
  } catch (error) {
    console.error(error)
    alert('Error al eliminar categoría')
  } finally {
    hideSpinner()
  }
}

// Configurar event listeners
function setupEventListeners() {
  btnCreate.addEventListener('click', () => openModal(false))
  btnCloseModal.addEventListener('click', closeModal)
  btnCancel.addEventListener('click', closeModal)

  formCategory.addEventListener('submit', (e) => {
    e.preventDefault()
    
    if (editingId) {
      handleUpdate(editingId)
    } else {
      handleCreate()
    }
  })

  btnPrev.addEventListener('click', () => loadCategories(currentPage - 1))
  btnNext.addEventListener('click', () => loadCategories(currentPage + 1))

  // Cerrar modal si se hace click fuera
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initDOM()
    setupEventListeners()
    loadCategories(1)
    ;(window as any).handleEdit = handleEdit
    ;(window as any).handleDelete = handleDelete
  })
} else {
  // Si el DOM ya está listo
  initDOM()
  setupEventListeners()
  loadCategories(1)
  ;(window as any).handleEdit = handleEdit
  ;(window as any).handleDelete = handleDelete
}

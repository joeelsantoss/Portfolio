# Chuleta RA7 - Estructura clara para examen

Objetivo de esta chuleta:
- Resolver rapido un examen donde tengas que picar API y CRUD.
- Cubrir exactamente lo que entra: async/await, fetch, REST, Node + Express y pg.
- Incluir lo que dijo el profe: peticiones web, bastante CRUD y posible creacion de tabla.

Caso real de ejemplo:
- Tabla: category (Sakila)
- Base URL: http://localhost:3000/api/categories

---

## 1) Flujo de trabajo recomendado en examen

1. Levanta Node + Express.
2. Conecta BD con pg (Pool).
3. Si piden, crea la tabla.
4. Implementa CRUD REST por este orden: GET all, GET by id, POST, PUT, DELETE.
5. Prueba con peticiones web (fetch, REST Client o Postman).
6. Revisa respuestas HTTP: 200/201, 400, 404, 500.

---

## 2) Programacion asincrona (async/await)

Concepto clave:
- async/await se usa porque BD y red son operaciones asincronas.

Patron que debes repetir en endpoints y frontend:

```ts
async function ejemplo() {
  try {
    const resultado = await operacionAsincrona()
    return resultado
  } catch (error) {
    console.error(error)
    throw error
  }
}
```

Ejemplo real backend:

```ts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT category_id, name FROM category ORDER BY category_id ASC')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar categorias' })
  }
})
```

---

## 3) Node + Express base

Plantilla minima:

```ts
import express from 'express'
import { router as categoriesRouter } from './routes/categories'

const app = express()
app.use(express.json())

app.use('/api/categories', categoriesRouter)

app.listen(3000, () => {
  console.log('API en http://localhost:3000')
})
```

Puntos obligatorios:
- express.json() para leer body JSON.
- Rutas separadas en router.
- try/catch en cada endpoint.

---

## 4) RESTful bien hecho (GET, POST, PUT, DELETE)

Mapa REST correcto:
- GET /api/categories
- GET /api/categories/:id
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id

Codigos HTTP esperados:
- 200: lectura, actualizacion, borrado correctos.
- 201: creacion correcta.
- 400: body invalido (por ejemplo name vacio).
- 404: id no existe.
- 500: error interno.

---

## 5) pg: conexion y creacion de tabla

Instalacion:

```bash
npm i pg
```

Conexion:

```ts
import { Pool } from 'pg'

export const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  user: 'postgres',
  password: 'tu_password',
  database: 'Sakila'
})
```

Si en examen piden crear tabla:

```sql
CREATE TABLE IF NOT EXISTS category (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
```

Prueba de conexion rapida:

```ts
await pool.query('SELECT 1')
```

---

## 6) CRUD completo con pg (listo para copiar)

```ts
import { Router } from 'express'
import { pool } from '../engine/db'

export const router = Router()

// GET all
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT category_id, name FROM category ORDER BY category_id ASC'
    )
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Error al listar categorias' })
  }
})

// GET by id
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const result = await pool.query(
      'SELECT category_id, name FROM category WHERE category_id = $1',
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoria no encontrada' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categoria' })
  }
})

// POST
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }

    const result = await pool.query(
      'INSERT INTO category (name) VALUES ($1) RETURNING category_id, name',
      [name]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al crear categoria' })
  }
})

// PUT
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }

    const result = await pool.query(
      'UPDATE category SET name = $1 WHERE category_id = $2 RETURNING category_id, name',
      [name, id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoria no encontrada' })
    }

    res.json(result.rows[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoria' })
  }
})

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    const result = await pool.query(
      'DELETE FROM category WHERE category_id = $1',
      [id]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Categoria no encontrada' })
    }

    res.json({ message: 'Categoria eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoria' })
  }
})
```

Nota de seguridad importante:
- Siempre SQL parametrizado con $1, $2 para evitar inyeccion SQL.

---

## 7) API fetch (peticiones web) con ejemplos reales

```ts
const API = 'http://localhost:3000/api/categories'

// GET all
async function getCategories() {
  const res = await fetch(API)
  if (!res.ok) throw new Error('Error GET')
  return await res.json()
}

// POST
async function createCategory(name: string) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
  if (!res.ok) throw new Error('Error POST')
  return await res.json()
}

// PUT
async function updateCategory(id: number, name: string) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  })
  if (!res.ok) throw new Error('Error PUT')
  return await res.json()
}

// DELETE
async function deleteCategory(id: number) {
  const res = await fetch(`${API}/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Error DELETE')
  return await res.json()
}
```

---

## 8) Lo que probablemente cae segun tu profe

Pistas del profe convertidas a ejercicios probables:
- "hacer peticiones web y CRUD": te pediran endpoints y pruebas con fetch.
- "bastante CRUD": prioriza que funcionen bien POST, PUT y DELETE, no solo GET.
- "se pica la API": seguramente escribir rutas desde cero en clase.
- "posible crear tabla": lleva memorizado CREATE TABLE y luego CRUD sobre esa tabla.

Estrategia si vas justo de tiempo:
1. Haz API que arranque.
2. Haz GET all y POST.
3. Haz PUT y DELETE con 404.
4. Haz una prueba fetch por cada metodo.

---

## 9) Checklist final de entrega en examen

- La API arranca sin errores.
- Hay conexion a PostgreSQL con pg.
- Si lo piden, tabla creada correctamente.
- CRUD completo implementado.
- Validacion de name en POST y PUT.
- 404 para ids inexistentes.
- 500 para errores internos.
- Ejemplos de peticiones web funcionando.

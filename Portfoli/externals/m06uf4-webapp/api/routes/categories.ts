import { Router, Request, Response } from 'express'
import db from '../engine/database'

const router = Router()

// Función auxiliar para simular delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// GET - Listar categorias con paginación
router.get('/', async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const pageSize = 10
  const offset = (page - 1) * pageSize

  try {
    // Simular delay de carga (3 segundos) - solo en la carga inicial
    await delay(3000)

    // Contar total de categorías
    const countResult = await db.db('category').count('* as total').first()
    const total = parseInt(countResult?.total as string) || 0

    // Obtener categorías de la página
    const categories = await db.db('category')
      .select('category_id', 'name')
      .limit(pageSize)
      .offset(offset)
      .orderBy('category_id', 'asc')

    res.json({
      data: categories,
      total: total,
      page: page,
      pageSize: pageSize,
      pages: Math.ceil(total / pageSize)
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categorías' })
  }
})

// GET - Obtener una categoría por ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const category = await db.db('category')
      .select('category_id', 'name')
      .where('category_id', req.params.id)
      .first()

    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json(category)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener categoría' })
  }
})

// POST - Crear categoría
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }

    // Simular delay de carga
    await delay(3000)

     const inserted = await db.db('category').insert({ name }).returning('*')
     res.json(inserted[0])
   } catch (error) {
     res.status(500).json({ error: 'Error al crear categoría' })
   }
 })

// PUT - Actualizar categoría
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'El nombre es requerido' })
    }

    // Simular delay de carga
    await delay(3000)

     const updated = await db.db('category').where('category_id', req.params.id).update({ name }).returning('*')

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json(updated[0])
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar categoría' })
  }
})

// DELETE - Eliminar categoría
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    // Simular delay de carga
    await delay(3000)

    const deleted = await db.db('category')
      .where('category_id', req.params.id)
      .del()

    if (deleted === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' })
    }

    res.json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar categoría' })
  }
})

export default router

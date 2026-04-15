import { Router } from 'express'
import { getAllBooks, getBook, createBook, updateBook, deleteBook, getCategories } from '../controllers/bookController.js'
import { protect, requireRole } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/', protect, getAllBooks)
router.get('/categories', protect, getCategories)
router.get('/:id', protect, getBook)
router.post('/', protect, requireRole('LIBRARIAN', 'ADMIN'), createBook)
router.put('/:id', protect, requireRole('LIBRARIAN', 'ADMIN'), updateBook)
router.delete('/:id', protect, requireRole('ADMIN'), deleteBook)
export default router
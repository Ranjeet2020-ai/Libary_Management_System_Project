import { Router } from 'express'
import { getAllFines, payFine, getUserFines } from '../controllers/fineController.js'
import { protect, requireRole } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/', protect, requireRole('ADMIN', 'LIBRARIAN'), getAllFines)
router.get('/user/:userId', protect, getUserFines)
router.put('/:id/pay', protect, requireRole('ADMIN', 'LIBRARIAN'), payFine)
export default router
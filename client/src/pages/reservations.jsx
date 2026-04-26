import { Router } from 'express'
import { reserveBook, cancelReservation, getAllReservations } from '../controllers/reservationController.js'
import { protect, requireRole } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/', protect, requireRole('ADMIN', 'LIBRARIAN'), getAllReservations)
router.post('/', protect, reserveBook)
router.put('/:id/cancel', protect, cancelReservation)
export default router

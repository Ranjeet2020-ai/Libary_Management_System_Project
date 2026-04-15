import { Router } from 'express'
import { getDashboardStats, getMostBorrowed, getOverdueReport, getMonthlyBorrows } from '../controllers/reportController.js'
import { protect, requireRole } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/dashboard', protect, getDashboardStats)
router.get('/most-borrowed', protect, requireRole('ADMIN', 'LIBRARIAN'), getMostBorrowed)
router.get('/overdue', protect, requireRole('ADMIN', 'LIBRARIAN'), getOverdueReport)
router.get('/monthly', protect, requireRole('ADMIN', 'LIBRARIAN'), getMonthlyBorrows)
export default router
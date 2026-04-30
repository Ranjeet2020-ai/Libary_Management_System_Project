import { Router } from 'express'
import { issueBook, returnBook, renewBook, getAllBorrows, getUserBorrows, selfBorrow } from '../controllers/borrowController.js'
import { protect, requireRole } from '../middleware/authMiddleware.js'
const router = Router()
router.get('/', protect, requireRole('ADMIN', 'LIBRARIAN'), getAllBorrows)
router.get('/user/:userId', protect, getUserBorrows)
router.post('/issue', protect, requireRole('ADMIN', 'LIBRARIAN'), issueBook)
router.post('/borrow', protect, selfBorrow)
router.put('/:id/return', protect, requireRole('ADMIN', 'LIBRARIAN'), returnBook)
router.put('/:id/renew', protect, renewBook)
export default router

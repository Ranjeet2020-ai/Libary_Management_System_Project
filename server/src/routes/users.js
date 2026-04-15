import { Router } from 'express'
import { getAllUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js'
import { protect, requireRole } from '../middleware/authMiddleware.js'

const router = Router()
router.get('/', protect, requireRole('ADMIN', 'LIBRARIAN'), getAllUsers)
router.get('/:id', protect, getUser)
router.put('/:id', protect, updateUser)
router.delete('/:id', protect, requireRole('ADMIN'), deleteUser)
export default router
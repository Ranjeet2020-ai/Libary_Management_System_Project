import prisma from '../prisma/client.js'
import bcrypt from 'bcryptjs'

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { borrows: true } } },
      orderBy: { name: 'asc' },
    })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(req.params.id) },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const data = {}
    if (name) data.name = name
    if (email) data.email = email
    if (role) data.role = role
    if (password) data.password = await bcrypt.hash(password, 10)
    const user = await prisma.user.update({ where: { id: Number(req.params.id) }, data })
    const { password: _, ...safe } = user
    res.json(safe)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
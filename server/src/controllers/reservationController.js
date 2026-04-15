import prisma from '../prisma/client.js'

export const reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body
    const userId = req.user.id
    const existing = await prisma.reservation.findFirst({
      where: { userId, bookId: Number(bookId), status: 'PENDING' },
    })
    if (existing) return res.status(400).json({ message: 'Already reserved' })
    const reservation = await prisma.reservation.create({
      data: { userId, bookId: Number(bookId) },
      include: { book: true },
    })
    res.status(201).json(reservation)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const cancelReservation = async (req, res) => {
  try {
    const reservation = await prisma.reservation.update({
      where: { id: Number(req.params.id) },
      data: { status: 'CANCELLED' },
    })
    res.json(reservation)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllReservations = async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { status: 'PENDING' },
      include: { user: { select: { id: true, name: true } }, book: true },
      orderBy: { reservedAt: 'asc' },
    })
    res.json(reservations)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
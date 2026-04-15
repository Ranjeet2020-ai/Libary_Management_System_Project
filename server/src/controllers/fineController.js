import prisma from '../prisma/client.js'

export const getAllFines = async (req, res) => {
  try {
    const where = req.query.unpaid === 'true' ? { paid: false } : {}
    const fines = await prisma.fine.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        borrowRecord: { include: { book: { select: { title: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(fines)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const payFine = async (req, res) => {
  try {
    const fine = await prisma.fine.update({
      where: { id: Number(req.params.id) },
      data: { paid: true, paidAt: new Date() },
    })
    res.json(fine)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUserFines = async (req, res) => {
  try {
    const fines = await prisma.fine.findMany({
      where: { userId: Number(req.params.userId) },
      include: { borrowRecord: { include: { book: { select: { title: true } } } } },
    })
    res.json(fines)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const autoCalculateFines = async () => {
  try {
    const overdue = await prisma.borrowRecord.findMany({
      where: { returnedAt: null, dueDate: { lt: new Date() }, fine: null },
    })
    for (const record of overdue) {
      const days = Math.floor((new Date() - record.dueDate) / 86400000)
      const amount = days * (Number(process.env.FINE_PER_DAY) || 2)
      await prisma.fine.upsert({
        where: { borrowRecordId: record.id },
        update: { amount },
        create: { userId: record.userId, borrowRecordId: record.id, amount },
      })
    }
    console.log(`Fines updated for ${overdue.length} overdue records`)
  } catch (err) {
    console.error('Fine calculation error:', err.message)
  }
}
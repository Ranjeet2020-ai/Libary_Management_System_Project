import prisma from '../prisma/client.js'

const LOAN_DAYS = Number(process.env.LOAN_DAYS) || 14

export const issueBook = async (req, res) => {
  try {
    const { userId, bookId } = req.body
    const book = await prisma.book.findUnique({ where: { id: Number(bookId) } })
    if (!book) return res.status(404).json({ message: 'Book not found' })
    if (book.available < 1) return res.status(400).json({ message: 'No copies available' })

    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + LOAN_DAYS)

    const [record] = await prisma.$transaction([
      prisma.borrowRecord.create({
        data: { userId: Number(userId), bookId: Number(bookId), dueDate },
        include: { user: { select: { name: true, email: true } }, book: true },
      }),
      prisma.book.update({ where: { id: Number(bookId) }, data: { available: { decrement: 1 } } }),
    ])
    res.status(201).json(record)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const returnBook = async (req, res) => {
  try {
    const record = await prisma.borrowRecord.findUnique({
      where: { id: Number(req.params.id) },
      include: { book: true },
    })
    if (!record) return res.status(404).json({ message: 'Borrow record not found' })
    if (record.returnedAt) return res.status(400).json({ message: 'Already returned' })

    const now = new Date()
    const overdueDays = Math.max(0, Math.floor((now - record.dueDate) / 86400000))
    const fineAmount = overdueDays * (Number(process.env.FINE_PER_DAY) || 2)

    const updates = [
      prisma.borrowRecord.update({ where: { id: record.id }, data: { returnedAt: now } }),
      prisma.book.update({ where: { id: record.bookId }, data: { available: { increment: 1 } } }),
    ]
    if (fineAmount > 0) {
      updates.push(prisma.fine.create({ data: { userId: record.userId, borrowRecordId: record.id, amount: fineAmount } }))
    }

    await prisma.$transaction(updates)
    res.json({ message: 'Book returned', overdueDays, fineAmount })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const renewBook = async (req, res) => {
  try {
    const record = await prisma.borrowRecord.findUnique({ where: { id: Number(req.params.id) } })
    if (!record) return res.status(404).json({ message: 'Record not found' })
    if (record.returnedAt) return res.status(400).json({ message: 'Already returned' })
    if (record.renewed) return res.status(400).json({ message: 'Already renewed once' })

    const newDue = new Date(record.dueDate)
    newDue.setDate(newDue.getDate() + LOAN_DAYS)

    const updated = await prisma.borrowRecord.update({
      where: { id: record.id },
      data: { dueDate: newDue, renewed: true },
    })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllBorrows = async (req, res) => {
  try {
    const where = req.query.active === 'true' ? { returnedAt: null } : {}
    const borrows = await prisma.borrowRecord.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } }, book: true },
      orderBy: { dueDate: 'asc' },
    })
    res.json(borrows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getUserBorrows = async (req, res) => {
  try {
    const borrows = await prisma.borrowRecord.findMany({
      where: { userId: Number(req.params.userId) },
      include: { book: true, fine: true },
      orderBy: { borrowedAt: 'desc' },
    })
    res.json(borrows)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
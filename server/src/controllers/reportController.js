import prisma from '../prisma/client.js'

export const getDashboardStats = async (req, res) => {
  try {
    const [totalBooks, activeborrows, totalMembers, unpaidFines, overdueCount] = await Promise.all([
      prisma.book.aggregate({ _sum: { totalCopies: true } }),
      prisma.borrowRecord.count({ where: { returnedAt: null } }),
      prisma.user.count(),
      prisma.fine.aggregate({ where: { paid: false }, _sum: { amount: true } }),
      prisma.borrowRecord.count({ where: { returnedAt: null, dueDate: { lt: new Date() } } }),
    ])
    res.json({
      totalBooks: totalBooks._sum.totalCopies || 0,
      activeBorrows: activeborrows,
      totalMembers,
      unpaidFines: unpaidFines._sum.amount || 0,
      overdueCount,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMostBorrowed = async (req, res) => {
  try {
    const data = await prisma.borrowRecord.groupBy({
      by: ['bookId'],
      _count: { bookId: true },
      orderBy: { _count: { bookId: 'desc' } },
      take: 10,
    })
    const withBooks = await Promise.all(
      data.map(async (r) => {
        const book = await prisma.book.findUnique({ where: { id: r.bookId } })
        return { book, count: r._count.bookId }
      })
    )
    res.json(withBooks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getOverdueReport = async (req, res) => {
  try {
    const overdue = await prisma.borrowRecord.findMany({
      where: { returnedAt: null, dueDate: { lt: new Date() } },
      include: { user: { select: { name: true, email: true } }, book: { select: { title: true } }, fine: true },
      orderBy: { dueDate: 'asc' },
    })
    res.json(overdue)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMonthlyBorrows = async (req, res) => {
  try {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
    const borrows = await prisma.borrowRecord.findMany({
      where: { borrowedAt: { gte: sixMonthsAgo } },
      select: { borrowedAt: true },
    })
    const monthly = {}
    borrows.forEach(b => {
      const key = `${b.borrowedAt.getFullYear()}-${String(b.borrowedAt.getMonth() + 1).padStart(2, '0')}`
      monthly[key] = (monthly[key] || 0) + 1
    })
    res.json(monthly)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
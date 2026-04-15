import prisma from '../prisma/client.js'

export const getAllBooks = async (req, res) => {
  try {
    const { search, category } = req.query
    const where = {}
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { isbn: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (category) where.category = category
    const books = await prisma.book.findMany({ where, orderBy: { title: 'asc' } })
    res.json(books)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getBook = async (req, res) => {
  try {
    const book = await prisma.book.findUnique({ where: { id: Number(req.params.id) } })
    if (!book) return res.status(404).json({ message: 'Book not found' })
    res.json(book)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const createBook = async (req, res) => {
  try {
    const { title, author, isbn, category, description, totalCopies, coverColor } = req.body
    if (!title || !author || !isbn || !category)
      return res.status(400).json({ message: 'Title, author, ISBN and category required' })
    const book = await prisma.book.create({
      data: { title, author, isbn, category, description, totalCopies: totalCopies || 1, available: totalCopies || 1, coverColor: coverColor || '#3c2a1e' },
    })
    res.status(201).json(book)
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ message: 'ISBN already exists' })
    res.status(500).json({ message: err.message })
  }
}

export const updateBook = async (req, res) => {
  try {
    const book = await prisma.book.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    })
    res.json(book)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteBook = async (req, res) => {
  try {
    await prisma.book.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Book deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getCategories = async (req, res) => {
  try {
    const cats = await prisma.book.findMany({ select: { category: true }, distinct: ['category'] })
    res.json(cats.map(c => c.category))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import bookRoutes from './routes/books.js'
import userRoutes from './routes/users.js'
import borrowRoutes from './routes/borrows.js'
import fineRoutes from './routes/fines.js'
import reservationRoutes from './routes/reservations.js'
import reportRoutes from './routes/reports.js'
import { autoCalculateFines } from './controllers/fineController.js'
import cron from 'node-cron'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)
app.use('/api/users', userRoutes)
app.use('/api/borrows', borrowRoutes)
app.use('/api/fines', fineRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/reports', reportRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

// Run fine calculation every day at midnight
cron.schedule('0 0 * * *', () => {
  console.log('Running daily fine calculation...')
  autoCalculateFines()
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
import { useEffect, useState } from 'react'
import api from '../services/api'

export default function BorrowReturn() {
  const [borrows, setBorrows] = useState([])
  const [users, setUsers] = useState([])
  const [books, setBooks] = useState([])
  const [form, setForm] = useState({ userId:'', bookId:'' })
  const [loading, setLoading] = useState(true)
  const [issuing, setIssuing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadBorrows = () => api.get('/borrows?active=true').then(r => setBorrows(r.data))

  useEffect(() => {
    Promise.all([
      api.get('/users'),
      api.get('/books'),
      api.get('/borrows?active=true'),
    ]).then(([u, b, br]) => {
      setUsers(u.data)
      setBooks(b.data.filter(b => b.available > 0))
      setBorrows(br.data)
    }).finally(() => setLoading(false))
  }, [])

  const issue = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (!form.userId || !form.bookId) return setError('Select a member and a book.')
    setIssuing(true)
    try {
      await api.post('/borrows/issue', { userId: form.userId, bookId: form.bookId })
      setSuccess('Book issued successfully.')
      setForm({ userId:'', bookId:'' })
      loadBorrows()
      api.get('/books').then(r => setBooks(r.data.filter(b => b.available > 0)))
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to issue book.')
    } finally { setIssuing(false) }
  }

  const returnBook = async (id) => {
    await api.put(`/borrows/${id}/return`)
    loadBorrows()
  }

  const renew = async (id) => {
    try {
      await api.put(`/borrows/${id}/renew`)
      setSuccess('Book renewed for 14 more days.')
      loadBorrows()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not renew.')
    }
  }

  const now = new Date()
  const sel = { width:'100%', padding:'9px 12px', background:'#0f0e0c', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontFamily:'DM Sans,sans-serif', fontSize:13, outline:'none', cursor:'pointer' }

  return (
    <div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>Issue / Return</div>
      <div style={{ fontSize:12, color:'#4a4035', marginBottom:20 }}>Issue books to members and process returns.</div>

      <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, padding:'18px 20px', marginBottom:20 }}>
        <div style={{ fontSize:11, color:'#9a7c45', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:500, marginBottom:14 }}>Issue a book</div>
        {error && <div style={{ fontSize:12, color:'#e07070', background:'rgba(180,60,60,.1)', padding:'8px 12px', borderRadius:7, marginBottom:12 }}>{error}</div>}
        {success && <div style={{ fontSize:12, color:'#5a8a5a', background:'rgba(90,138,90,.1)', padding:'8px 12px', borderRadius:7, marginBottom:12 }}>{success}</div>}
        <form onSubmit={issue}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
            <div>
              <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>Member</label>
              <select style={sel} value={form.userId} onChange={e=>setForm(f=>({...f,userId:e.target.value}))}>
                <option value="">Select member…</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:6 }}>Book (available only)</label>
              <select style={sel} value={form.bookId} onChange={e=>setForm(f=>({...f,bookId:e.target.value}))}>
                <option value="">Select book…</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title} ({b.available} left)</option>)}
              </select>
            </div>
          </div>
          <button type="submit" disabled={issuing} style={{ padding:'9px 20px', background:'#9a7c45', border:'none', borderRadius:8, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', opacity: issuing ? 0.6 : 1 }}>
            {issuing ? 'Issuing…' : 'Issue book (14 days)'}
          </button>
        </form>
      </div>

      <div style={{ fontSize:11, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:12 }}>Currently borrowed ({borrows.length})</div>
      {loading ? <div style={{ color:'#3a3530', fontSize:13 }}>Loading…</div> : borrows.map(b => {
        const due = new Date(b.dueDate)
        const overdue = due < now
        const daysLeft = Math.ceil((due - now) / 86400000)
        return (
          <div key={b.id} style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:8, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:6, background: b.book?.coverColor || '#3c2a1e', flexShrink:0 }}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, color:'#c0b090', fontWeight:500 }}>{b.user?.name}</div>
              <div style={{ fontSize:11, color:'#4a4035' }}>{b.book?.title}</div>
            </div>
            <div style={{ fontSize:11, color: overdue ? '#e07070' : daysLeft <= 2 ? '#b08d50' : '#9a7c45', marginRight:8, flexShrink:0 }}>
              {overdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
            </div>
            <div style={{ display:'flex', gap:6, flexShrink:0 }}>
              {!b.renewed && <button onClick={() => renew(b.id)} style={{ padding:'5px 10px', background:'#1f1c18', border:'1px solid #3a3530', borderRadius:6, color:'#9a7c45', fontSize:11, cursor:'pointer' }}>Renew</button>}
              <button onClick={() => returnBook(b.id)} style={{ padding:'5px 10px', background:'#1f1c18', border:'1px solid #3a3530', borderRadius:6, color:'#c0b090', fontSize:11, cursor:'pointer' }}>Return</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

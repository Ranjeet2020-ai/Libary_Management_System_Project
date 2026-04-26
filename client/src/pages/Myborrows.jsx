import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function MyBorrows() {
  const { user } = useAuth()
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const load = () => {
    setLoading(true)
    api.get(`/borrows/user/${user.id}`).then(r => setBorrows(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [user.id])

  const renew = async (id) => {
    setError(''); setSuccess('')
    try {
      await api.put(`/borrows/${id}/renew`)
      setSuccess('Renewed for 14 more days.')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not renew.')
    }
  }

  const reserve = async (bookId) => {
    try {
      await api.post('/reservations', { bookId })
      setSuccess('Book reserved! You will be notified when it is available.')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reserve.')
    }
  }

  const now = new Date()
  const active = borrows.filter(b => !b.returnedAt)
  const history = borrows.filter(b => b.returnedAt)

  const BorrowCard = ({ b }) => {
    const due = new Date(b.dueDate)
    const overdue = due < now && !b.returnedAt
    const daysLeft = Math.ceil((due - now) / 86400000)
    return (
      <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:8, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:12 }}>
        <div style={{ width:38, height:50, borderRadius:6, background: b.book?.coverColor || '#3c2a1e', flexShrink:0 }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, color:'#c0b090', fontWeight:500, marginBottom:2 }}>{b.book?.title}</div>
          <div style={{ fontSize:11, color:'#4a4035', marginBottom:4 }}>{b.book?.author}</div>
          {b.returnedAt ? (
            <div style={{ fontSize:11, color:'#3a3530' }}>Returned {new Date(b.returnedAt).toLocaleDateString()}</div>
          ) : (
            <div style={{ fontSize:11, color: overdue ? '#e07070' : daysLeft <= 2 ? '#b08d50' : '#5a8a5a' }}>
              {overdue ? `Overdue by ${Math.abs(daysLeft)} day(s)` : daysLeft === 0 ? 'Due today' : `Due in ${daysLeft} day(s)`}
            </div>
          )}
          {b.fine && <div style={{ fontSize:11, color:'#e07070', marginTop:2 }}>Fine: ${b.fine.amount.toFixed(2)} {b.fine.paid ? '(paid)' : '(unpaid)'}</div>}
        </div>
        {!b.returnedAt && !b.renewed && (
          <button onClick={() => renew(b.id)} style={{ padding:'6px 12px', background:'#1f1c18', border:'1px solid #3a3530', borderRadius:6, color:'#9a7c45', fontSize:11, cursor:'pointer', flexShrink:0 }}>Renew</button>
        )}
        {!b.returnedAt && b.renewed && (
          <span style={{ fontSize:10, color:'#3a3530', flexShrink:0 }}>Renewed</span>
        )}
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>My borrows</div>
      <div style={{ fontSize:12, color:'#4a4035', marginBottom:20 }}>Your borrowing history and active loans.</div>

      {error && <div style={{ fontSize:12, color:'#e07070', background:'rgba(180,60,60,.1)', padding:'8px 12px', borderRadius:7, marginBottom:14 }}>{error}</div>}
      {success && <div style={{ fontSize:12, color:'#5a8a5a', background:'rgba(90,138,90,.1)', padding:'8px 12px', borderRadius:7, marginBottom:14 }}>{success}</div>}

      {loading ? <div style={{ color:'#3a3530', fontSize:13 }}>Loading…</div> : (
        <>
          <div style={{ fontSize:11, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Active loans ({active.length})</div>
          {active.length === 0 ? <div style={{ fontSize:13, color:'#3a3530', marginBottom:24 }}>No active borrows.</div> : active.map(b => <BorrowCard key={b.id} b={b}/>)}
          {history.length > 0 && (
            <>
              <div style={{ fontSize:11, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', margin:'20px 0 10px' }}>History ({history.length})</div>
              {history.map(b => <BorrowCard key={b.id} b={b}/>)}
            </>
          )}
        </>
      )}
    </div>
  )
}

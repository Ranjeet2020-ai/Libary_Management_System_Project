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

  const now = new Date()
  const active = borrows.filter(b => !b.returnedAt)
  const history = borrows.filter(b => b.returnedAt)

  const formatDate = (d) => new Date(d).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })

  const StatusBadge = ({ overdue, daysLeft }) => {
    if (overdue) return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(220,50,50,0.2)', color:'#ff6b6b', border:'1px solid rgba(220,50,50,0.4)' }}>🔴 {Math.abs(daysLeft)}d overdue</span>
    if (daysLeft === 0) return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(255,165,0,0.2)', color:'#ffa500', border:'1px solid rgba(255,165,0,0.4)' }}>⚠️ Due today</span>
    if (daysLeft <= 3) return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(255,165,0,0.15)', color:'#ffb347', border:'1px solid rgba(255,165,0,0.3)' }}>⏰ {daysLeft}d left</span>
    return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(50,205,50,0.15)', color:'#5aff5a', border:'1px solid rgba(50,205,50,0.3)' }}>✅ {daysLeft}d left</span>
  }

  const BorrowCard = ({ b }) => {
    const due = new Date(b.dueDate)
    const issued = new Date(b.borrowedAt)
    const overdue = due < now && !b.returnedAt
    const daysLeft = Math.ceil((due - now) / 86400000)

    return (
      <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:8, padding:'14px 16px', marginBottom:10, display:'flex', alignItems:'center', gap:12, transition:'border-color .2s' }}
        onMouseEnter={e=>e.currentTarget.style.borderColor='#9a7c45'} onMouseLeave={e=>e.currentTarget.style.borderColor='#2a2520'}>
        <div style={{ width:40, height:52, borderRadius:6, background: b.book?.coverColor || '#3c2a1e', flexShrink:0 }}/>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, color:'#e0d0b0', fontWeight:600, marginBottom:2 }}>{b.book?.title}</div>
          <div style={{ fontSize:11, color:'#7a6a4a', marginBottom:6 }}>{b.book?.author}</div>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
            <div style={{ fontSize:11 }}>
              <span style={{ color:'#6a6050' }}>📅 Issued:</span> <span style={{ color:'#b0a080' }}>{formatDate(issued)}</span>
            </div>
            {b.returnedAt ? (
              <div style={{ fontSize:11 }}>
                <span style={{ color:'#6a6050' }}>✅ Returned:</span> <span style={{ color:'#5aff5a' }}>{formatDate(b.returnedAt)}</span>
              </div>
            ) : (
              <div style={{ fontSize:11 }}>
                <span style={{ color:'#6a6050' }}>📆 Due:</span> <span style={{ color: overdue ? '#ff6b6b' : '#b0a080' }}>{formatDate(due)}</span>
              </div>
            )}
          </div>
          {b.fine && (
            <div style={{ marginTop:6, fontSize:11, padding:'2px 8px', borderRadius:10, display:'inline-block', background: b.fine.paid ? 'rgba(50,205,50,.15)' : 'rgba(220,50,50,.15)', color: b.fine.paid ? '#5aff5a' : '#ff6b6b', border: `1px solid ${b.fine.paid ? 'rgba(50,205,50,.3)' : 'rgba(220,50,50,.3)'}` }}>
              💰 Fine: ${b.fine.amount.toFixed(2)} {b.fine.paid ? '(paid)' : '(unpaid)'}
            </div>
          )}
        </div>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8, flexShrink:0 }}>
          {!b.returnedAt && <StatusBadge overdue={overdue} daysLeft={daysLeft} />}
          {b.returnedAt && <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(100,100,100,0.2)', color:'#888', border:'1px solid rgba(100,100,100,0.3)' }}>Returned</span>}
          {!b.returnedAt && !b.renewed && (
            <button onClick={() => renew(b.id)} style={{ padding:'5px 12px', background:'rgba(154,124,69,.15)', border:'1px solid rgba(154,124,69,.4)', borderRadius:6, color:'#d4a843', fontSize:11, fontWeight:500, cursor:'pointer' }}>Renew</button>
          )}
          {!b.returnedAt && b.renewed && (
            <span style={{ fontSize:10, padding:'3px 8px', borderRadius:10, background:'rgba(100,100,100,.1)', color:'#5a5040', border:'1px solid #2a2520' }}>Renewed</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>My borrows</div>
      <div style={{ fontSize:12, color:'#4a4035', marginBottom:20 }}>Your borrowing history and active loans.</div>

      {error && <div style={{ fontSize:12, color:'#ff6b6b', background:'rgba(220,50,50,.15)', padding:'8px 12px', borderRadius:7, marginBottom:14, border:'1px solid rgba(220,50,50,.3)' }}>{error}</div>}
      {success && <div style={{ fontSize:12, color:'#5aff5a', background:'rgba(50,205,50,.15)', padding:'8px 12px', borderRadius:7, marginBottom:14, border:'1px solid rgba(50,205,50,.3)' }}>{success}</div>}

      {loading ? <div style={{ color:'#3a3530', fontSize:13 }}>Loading…</div> : (
        <>
          <div style={{ fontSize:11, color:'#6a6050', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:10 }}>Active loans ({active.length})</div>
          {active.length === 0 ? <div style={{ fontSize:13, color:'#3a3530', marginBottom:24 }}>No active borrows.</div> : active.map(b => <BorrowCard key={b.id} b={b}/>)}
          {history.length > 0 && (
            <>
              <div style={{ fontSize:11, color:'#6a6050', textTransform:'uppercase', letterSpacing:'0.5px', margin:'20px 0 10px' }}>History ({history.length})</div>
              {history.map(b => <BorrowCard key={b.id} b={b}/>)}
            </>
          )}
        </>
      )}
    </div>
  )
}

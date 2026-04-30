import { useEffect, useState } from 'react'
import api from '../services/api'

const Bar = ({ label, value, max, color='#3b82f6' }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
    <div style={{ fontSize:12, color:'#475569', width:130, textAlign:'right', flexShrink:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</div>
    <div style={{ flex:1, background:'#f1f5f9', borderRadius:6, height:26, overflow:'hidden' }}>
      <div style={{ width:`${Math.round((value/max)*100)}%`, height:'100%', background:color, borderRadius:6, display:'flex', alignItems:'center', padding:'0 10px', transition:'width .6s ease', minWidth:30 }}>
        <span style={{ fontSize:11, color:'#fff', fontWeight:700 }}>{value}</span>
      </div>
    </div>
  </div>
)

export default function Reports() {
  const [most, setMost] = useState([])
  const [monthly, setMonthly] = useState({})
  const [overdue, setOverdue] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/reports/most-borrowed'),
      api.get('/reports/monthly'),
      api.get('/reports/overdue'),
    ]).then(([m, mo, o]) => {
      setMost(m.data)
      setMonthly(mo.data)
      setOverdue(o.data)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color:'#64748b', fontSize:13 }}>Loading reports…</div>

  const maxMost = Math.max(...most.map(m => m.count), 1)
  const monthlyEntries = Object.entries(monthly).sort().slice(-6)
  const maxMonth = Math.max(...monthlyEntries.map(([,v]) => v), 1)
  const now = new Date()

  const colors = ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f59e0b','#22c55e']

  return (
    <div>
      <div style={{ fontSize:28, fontWeight:700, color:'#1e293b', marginBottom:4 }}>📊 Reports</div>
      <div style={{ fontSize:13, color:'#64748b', marginBottom:28 }}>Borrowing analytics and library insights.</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:20 }}>
        <div style={{ background:'#fff', borderRadius:12, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:18 }}>🏆 Most Borrowed Books</div>
          {most.length === 0 ? <div style={{ fontSize:13, color:'#94a3b8' }}>No data yet.</div> : most.map(({ book, count }, i) => (
            <Bar key={book.id} label={book.title} value={count} max={maxMost} color={colors[i % colors.length]}/>
          ))}
        </div>
        <div style={{ background:'#fff', borderRadius:12, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:18 }}>📅 Borrows Per Month</div>
          {monthlyEntries.length === 0 ? <div style={{ fontSize:13, color:'#94a3b8' }}>No data yet.</div> : monthlyEntries.map(([month, count], i) => (
            <Bar key={month} label={month} value={count} max={maxMonth} color={colors[i % colors.length]}/>
          ))}
        </div>
      </div>

      <div style={{ background:'#fff', borderRadius:12, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:18 }}>
          🔴 Overdue Books Report ({overdue.length})
        </div>
        {overdue.length === 0 ? (
          <div style={{ fontSize:14, color:'#22c55e', fontWeight:600, padding:'20px 0', textAlign:'center' }}>✅ No overdue books!</div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ background:'#f8fafc' }}>
                {['Member','Book','Issued','Due Date','Days Overdue','Fine'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:11, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:700, borderBottom:'2px solid #e2e8f0' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {overdue.map(b => {
                const due = new Date(b.dueDate)
                const issued = new Date(b.borrowedAt)
                const days = Math.floor((now - due) / 86400000)
                return (
                  <tr key={b.id} style={{ borderBottom:'1px solid #f1f5f9' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#f8fafc'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                    <td style={{ padding:'12px 14px', fontSize:13, color:'#1e293b', fontWeight:600 }}>{b.user?.name}</td>
                    <td style={{ padding:'12px 14px', fontSize:13, color:'#475569' }}>{b.book?.title}</td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#64748b' }}>{issued.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</td>
                    <td style={{ padding:'12px 14px', fontSize:12, color:'#ef4444', fontWeight:600 }}>{due.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</td>
                    <td style={{ padding:'12px 14px' }}>
                      <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:700, background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)' }}>
                        {days}d overdue
                      </span>
                    </td>
                    <td style={{ padding:'12px 14px', fontSize:13, color:'#ef4444', fontWeight:700 }}>{b.fine ? `$${b.fine.amount.toFixed(2)}` : `$${(days*2).toFixed(2)}`}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

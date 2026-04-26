import { useEffect, useState } from 'react'
import api from '../services/api'

const Bar = ({ label, value, max, color='#9a7c45' }) => (
  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
    <div style={{ fontSize:11, color:'#6a6050', width:120, textAlign:'right', flexShrink:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</div>
    <div style={{ flex:1, background:'#1a1814', borderRadius:4, height:22, overflow:'hidden' }}>
      <div style={{ width:`${Math.round((value/max)*100)}%`, height:'100%', background:color, borderRadius:4, display:'flex', alignItems:'center', padding:'0 8px', transition:'width .6s ease' }}>
        <span style={{ fontSize:10, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>{value}</span>
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

  if (loading) return <div style={{ color:'#3a3530', fontSize:13 }}>Loading reports…</div>

  const maxMost = Math.max(...most.map(m => m.count), 1)
  const monthlyEntries = Object.entries(monthly).sort().slice(-6)
  const maxMonth = Math.max(...monthlyEntries.map(([,v]) => v), 1)

  const now = new Date()

  return (
    <div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>Reports</div>
      <div style={{ fontSize:12, color:'#4a4035', marginBottom:24 }}>Borrowing analytics and library insights.</div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:20 }}>
        <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, padding:'16px 18px' }}>
          <div style={{ fontSize:11, color:'#9a7c45', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:500, marginBottom:14 }}>Most borrowed books</div>
          {most.length === 0 ? <div style={{ fontSize:12, color:'#3a3530' }}>No data yet.</div> : most.map(({ book, count }) => (
            <Bar key={book.id} label={book.title} value={count} max={maxMost}/>
          ))}
        </div>
        <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, padding:'16px 18px' }}>
          <div style={{ fontSize:11, color:'#9a7c45', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:500, marginBottom:14 }}>Borrows per month</div>
          {monthlyEntries.length === 0 ? <div style={{ fontSize:12, color:'#3a3530' }}>No data yet.</div> : monthlyEntries.map(([month, count]) => (
            <Bar key={month} label={month} value={count} max={maxMonth} color='#7a5c35'/>
          ))}
        </div>
      </div>

      <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, padding:'16px 18px' }}>
        <div style={{ fontSize:11, color:'#9a7c45', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:500, marginBottom:14 }}>
          Overdue books report ({overdue.length})
        </div>
        {overdue.length === 0 ? (
          <div style={{ fontSize:13, color:'#3a3530' }}>No overdue books.</div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid #2a2520' }}>
                {['Member','Book','Due date','Days overdue','Fine'].map(h => (
                  <th key={h} style={{ padding:'8px 12px', textAlign:'left', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {overdue.map(b => {
                const due = new Date(b.dueDate)
                const days = Math.floor((now - due) / 86400000)
                return (
                  <tr key={b.id} style={{ borderBottom:'1px solid #1a1814' }}>
                    <td style={{ padding:'9px 12px', fontSize:12, color:'#c0b090', fontWeight:500 }}>{b.user?.name}</td>
                    <td style={{ padding:'9px 12px', fontSize:12, color:'#6a6050' }}>{b.book?.title}</td>
                    <td style={{ padding:'9px 12px', fontSize:12, color:'#6a6050' }}>{due.toLocaleDateString()}</td>
                    <td style={{ padding:'9px 12px', fontSize:12, color:'#e07070' }}>{days} day{days !== 1 ? 's' : ''}</td>
                    <td style={{ padding:'9px 12px', fontSize:12, color:'#e07070' }}>{b.fine ? `$${b.fine.amount.toFixed(2)}` : `$${(days*2).toFixed(2)}`}</td>
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

import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Fines() {
  const [fines, setFines] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    const params = filter === 'unpaid' ? { unpaid: true } : {}
    api.get('/fines', { params }).then(r => setFines(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [filter])

  const pay = async (id) => {
    await api.put(`/fines/${id}/pay`)
    load()
  }

  const total = fines.filter(f => !f.paid).reduce((s, f) => s + f.amount, 0)

  return (
    <div>
      <div style={{ fontSize:28, fontWeight:700, color:'#1e293b', marginBottom:4 }}>💰 Fines</div>
      <div style={{ fontSize:13, color:'#64748b', marginBottom:24 }}>Track and collect overdue fines.</div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8 }}>
          {['all','unpaid'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:'8px 18px', borderRadius:8, border:'none', fontSize:13, cursor:'pointer', fontWeight:600, transition:'all .15s',
              background: filter===f ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : '#fff',
              color: filter===f ? '#fff' : '#64748b',
              boxShadow: filter===f ? '0 2px 8px rgba(99,102,241,0.4)' : '0 1px 3px rgba(0,0,0,0.08)' }}>
              {f === 'all' ? '📋 All fines' : '⚠️ Unpaid only'}
            </button>
          ))}
        </div>
        {total > 0 && (
          <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:10, padding:'8px 16px', fontSize:13, color:'#ef4444', fontWeight:600 }}>
            Total unpaid: <span style={{ fontSize:20, fontWeight:700 }}>${total.toFixed(2)}</span>
          </div>
        )}
      </div>

      {loading ? <div style={{ color:'#64748b', fontSize:13 }}>Loading…</div> : fines.length === 0 ? (
        <div style={{ fontSize:14, color:'#94a3b8', padding:40, textAlign:'center', background:'#fff', borderRadius:12, boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>✅ No fines found.</div>
      ) : fines.map(fine => (
        <div key={fine.id} style={{ background:'#fff', borderRadius:12, padding:'16px 20px', marginBottom:10, display:'flex', alignItems:'center', gap:16, boxShadow:'0 1px 4px rgba(0,0,0,0.08)', border:`1px solid ${fine.paid ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
          <div style={{ minWidth:70, textAlign:'center' }}>
            <div style={{ fontSize:24, fontWeight:800, color: fine.paid ? '#22c55e' : '#ef4444' }}>${fine.amount.toFixed(2)}</div>
            <div style={{ fontSize:10, color:'#94a3b8', fontWeight:500, marginTop:2 }}>FINE</div>
          </div>
          <div style={{ width:1, height:40, background:'#e2e8f0' }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, color:'#1e293b', fontWeight:600, marginBottom:2 }}>👤 {fine.user?.name}</div>
            <div style={{ fontSize:12, color:'#64748b', marginBottom:4 }}>📚 {fine.borrowRecord?.book?.title}</div>
            {fine.paid && fine.paidAt && (
              <div style={{ fontSize:11, color:'#22c55e', fontWeight:500 }}>✅ Paid on {new Date(fine.paidAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</div>
            )}
          </div>
          {fine.paid ? (
            <span style={{ padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, background:'rgba(34,197,94,0.15)', color:'#22c55e', border:'1px solid rgba(34,197,94,0.3)' }}>✅ Paid</span>
          ) : (
            <button onClick={() => pay(fine.id)} style={{ padding:'8px 18px', background:'linear-gradient(135deg,#22c55e,#16a34a)', border:'none', borderRadius:8, color:'#fff', fontSize:12, fontWeight:600, cursor:'pointer', boxShadow:'0 2px 6px rgba(34,197,94,0.4)' }}>Mark paid</button>
          )}
        </div>
      ))}
    </div>
  )
}

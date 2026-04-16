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
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>Fines</div>
      <div style={{ fontSize:12, color:'#4a4035', marginBottom:20 }}>Track and collect overdue fines.</div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
        <div style={{ display:'flex', gap:6 }}>
          {['all','unpaid'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding:'6px 14px', borderRadius:8, border:'1px solid', fontSize:12, cursor:'pointer', transition:'all .15s', fontFamily:'DM Sans,sans-serif', borderColor: filter===f ? '#9a7c45' : '#2a2520', background: filter===f ? 'rgba(154,124,69,.1)' : 'none', color: filter===f ? '#9a7c45' : '#4a4035' }}>
              {f === 'all' ? 'All fines' : 'Unpaid only'}
            </button>
          ))}
        </div>
        {total > 0 && (
          <div style={{ fontSize:13, color:'#e07070' }}>Total unpaid: <span style={{ fontFamily:'Playfair Display,serif', fontSize:18 }}>${total.toFixed(2)}</span></div>
        )}
      </div>

      {loading ? <div style={{ color:'#3a3530', fontSize:13 }}>Loading…</div> : fines.length === 0 ? (
        <div style={{ fontSize:13, color:'#3a3530', padding:24, textAlign:'center', background:'#161410', borderRadius:10, border:'1px solid #2a2520' }}>No fines found.</div>
      ) : fines.map(fine => (
        <div key={fine.id} style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:8, padding:'12px 16px', marginBottom:8, display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:22, color: fine.paid ? '#5a8a5a' : '#e07070', minWidth:64 }}>
            ${fine.amount.toFixed(2)}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:13, color:'#c0b090', fontWeight:500 }}>{fine.user?.name}</div>
            <div style={{ fontSize:11, color:'#4a4035' }}>{fine.borrowRecord?.book?.title} — overdue fine</div>
            {fine.paid && fine.paidAt && <div style={{ fontSize:10, color:'#3a3530', marginTop:2 }}>Paid {new Date(fine.paidAt).toLocaleDateString()}</div>}
          </div>
          {fine.paid ? (
            <span style={{ fontSize:11, padding:'4px 10px', background:'rgba(90,138,90,.1)', border:'1px solid rgba(90,138,90,.15)', borderRadius:6, color:'#5a8a5a' }}>Paid</span>
          ) : (
            <button onClick={() => pay(fine.id)} style={{ padding:'6px 14px', background:'rgba(90,138,90,.12)', border:'1px solid rgba(90,138,90,.2)', borderRadius:6, color:'#5a8a5a', fontSize:12, cursor:'pointer' }}>Mark paid</button>
          )}
        </div>
      ))}
    </div>
  )
}

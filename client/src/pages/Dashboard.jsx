import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{ background:'#fff', borderRadius:12, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)', border:`1px solid ${color}30` }}>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
      <div style={{ fontSize:11, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.8px', fontWeight:600 }}>{label}</div>
      <span style={{ fontSize:18 }}>{icon}</span>
    </div>
    <div style={{ fontSize:30, fontWeight:700, color:'#1e293b', marginBottom:4 }}>{value}</div>
    <div style={{ fontSize:12, color, fontWeight:500 }}>{sub}</div>
  </div>
)

const StatusBadge = ({ overdue, daysLeft }) => {
  if (overdue) return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)' }}>🔴 {Math.abs(daysLeft)}d overdue</span>
  if (daysLeft === 0) return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)' }}>⚠️ Due today</span>
  if (daysLeft <= 3) return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(245,158,11,0.15)', color:'#f59e0b', border:'1px solid rgba(245,158,11,0.3)' }}>⏰ {daysLeft}d left</span>
  return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:'rgba(34,197,94,0.15)', color:'#22c55e', border:'1px solid rgba(34,197,94,0.3)' }}>✅ {daysLeft}d left</span>
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [borrows, setBorrows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/reports/dashboard'),
      api.get(user.role === 'STUDENT' ? `/borrows/user/${user.id}` : '/borrows?active=true'),
    ]).then(([s, b]) => {
      setStats(s.data)
      setBorrows(b.data.slice(0, 5))
    }).finally(() => setLoading(false))
  }, [user])

  if (loading) return <div style={{ color:'#64748b', fontSize:13 }}>Loading dashboard…</div>

  const isStaff = user.role !== 'STUDENT'
  const now = new Date()

  return (
    <div>
      <div style={{ fontSize:28, fontWeight:700, color:'#1e293b', marginBottom:4 }}>
        Good {now.getHours() < 12 ? '🌅 morning' : now.getHours() < 17 ? '☀️ afternoon' : '🌙 evening'}, {user.name.split(' ')[0]}
      </div>
      <div style={{ fontSize:13, color:'#64748b', marginBottom:28 }}>Here's what's happening in your library today.</div>

      {isStaff && stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:28 }}>
          <StatCard label="Total Books" value={stats.totalBooks.toLocaleString()} sub={`${stats.activeBorrows} currently out`} color="#3b82f6" icon="📚"/>
          <StatCard label="Active Borrows" value={stats.activeBorrows} sub={stats.overdueCount > 0 ? `⚠️ ${stats.overdueCount} overdue` : '0 overdue'} color={stats.overdueCount > 0 ? '#ef4444' : '#22c55e'} icon="📖"/>
          <StatCard label="Members" value={stats.totalMembers.toLocaleString()} sub="Registered users" color="#8b5cf6" icon="👥"/>
          <StatCard label="Fines Pending" value={`$${stats.unpaidFines.toFixed(2)}`} sub={stats.unpaidFines > 0 ? "Needs collection" : "All clear!"} color={stats.unpaidFines > 0 ? '#ef4444' : '#22c55e'} icon="💰"/>
        </div>
      )}

      <div style={{ background:'#fff', borderRadius:12, padding:'20px 22px', boxShadow:'0 1px 4px rgba(0,0,0,0.08)' }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#1e293b', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:16 }}>
          {isStaff ? '📋 Active Borrows (Due Soonest)' : '📋 Your Current Borrows'}
        </div>
        {borrows.length === 0 ? (
          <div style={{ fontSize:13, color:'#94a3b8', padding:'20px 0', textAlign:'center' }}>No active borrows found.</div>
        ) : borrows.map(b => {
          const due = new Date(b.dueDate)
          const issued = new Date(b.borrowedAt)
          const overdue = due < now && !b.returnedAt
          const daysLeft = Math.ceil((due - now) / 86400000)
          return (
            <div key={b.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom:'1px solid #f1f5f9' }}>
              <div style={{ width:40, height:52, borderRadius:8, background: b.book?.coverColor || '#3b82f6', flexShrink:0, boxShadow:'0 2px 6px rgba(0,0,0,0.2)' }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:'#1e293b', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{b.book?.title}</div>
                {isStaff && <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>👤 {b.user?.name}</div>}
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
                  📅 Issued: {issued.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })} &nbsp;|&nbsp;
                  📆 Due: {due.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}
                </div>
              </div>
              <StatusBadge overdue={overdue} daysLeft={daysLeft} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const StatCard = ({ label, value, sub, danger }) => (
  <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, padding:'16px 18px' }}>
    <div style={{ fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:8 }}>{label}</div>
    <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>{value}</div>
    <div style={{ fontSize:11, color: danger ? '#e07070' : '#5a8a5a' }}>{sub}</div>
  </div>
)

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

  if (loading) return <div style={{ color:'#4a4035', fontSize:13 }}>Loading dashboard…</div>

  const isStaff = user.role !== 'STUDENT'
  const now = new Date()

  return (
    <div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>
        Good {now.getHours() < 12 ? 'morning' : now.getHours() < 17 ? 'afternoon' : 'evening'}, {user.name.split(' ')[0]}
      </div>
      <div style={{ fontSize:12, color:'#4a4035', marginBottom:24 }}>Here's what's happening in your library today.</div>

      {isStaff && stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginBottom:24 }}>
          <StatCard label="Total books" value={stats.totalBooks.toLocaleString()} sub={`${stats.activeBorrows} currently out`}/>
          <StatCard label="Active borrows" value={stats.activeBorrows} sub={`${stats.overdueCount} overdue`} danger={stats.overdueCount > 0}/>
          <StatCard label="Members" value={stats.totalMembers.toLocaleString()} sub="Registered users"/>
          <StatCard label="Fines pending" value={`$${stats.unpaidFines.toFixed(2)}`} sub="Uncollected" danger={stats.unpaidFines > 0}/>
        </div>
      )}

      <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, padding:'16px 18px' }}>
        <div style={{ fontSize:11, color:'#9a7c45', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:14, fontWeight:500 }}>
          {isStaff ? 'Active borrows (due soonest)' : 'Your current borrows'}
        </div>
        {borrows.length === 0 ? (
          <div style={{ fontSize:13, color:'#3a3530', padding:'12px 0' }}>No active borrows found.</div>
        ) : borrows.map(b => {
          const due = new Date(b.dueDate)
          const overdue = due < now && !b.returnedAt
          const daysLeft = Math.ceil((due - now) / 86400000)
          return (
            <div key={b.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'9px 0', borderBottom:'1px solid #1a1814' }}>
              <div style={{ width:34, height:34, borderRadius:6, background: b.book?.coverColor || '#3c2a1e', flexShrink:0 }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, color:'#c0b090', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{b.book?.title}</div>
                {isStaff && <div style={{ fontSize:11, color:'#4a4035' }}>{b.user?.name}</div>}
              </div>
              <div style={{ fontSize:11, color: overdue ? '#e07070' : daysLeft <= 2 ? '#b08d50' : '#5a8a5a', flexShrink:0 }}>
                {overdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

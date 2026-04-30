import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const s = {
  wrap: { display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f0f4ff' },
  topbar: { height:56, background:'#1e293b', borderBottom:'1px solid #334155', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0, position:'sticky', top:0, zIndex:100, boxShadow:'0 2px 8px rgba(0,0,0,0.3)' },
  logo: { fontFamily:'Playfair Display,serif', fontSize:20, color:'#fff', letterSpacing:'-0.3px', display:'flex', alignItems:'center', gap:8 },
  logoDot: { width:10, height:10, background:'#38bdf8', borderRadius:3 },
  topRight: { display:'flex', alignItems:'center', gap:12 },
  userName: { fontSize:13, color:'#94a3b8', fontWeight:500 },
  logoutBtn: { background:'rgba(239,68,68,0.15)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'6px 14px', color:'#f87171', fontSize:12, cursor:'pointer', fontWeight:500 },
  body: { display:'flex', flex:1, minHeight:0 },
  sidebar: { width:210, background:'#1e293b', borderRight:'1px solid #334155', padding:'16px 10px', display:'flex', flexDirection:'column', gap:2, flexShrink:0 },
  sLabel: { fontSize:10, color:'#475569', textTransform:'uppercase', letterSpacing:'1.5px', padding:'16px 10px 6px', fontWeight:700 },
  content: { flex:1, overflowY:'auto', padding:'28px 32px', background:'#f0f4ff' },
}

const navStyle = ({ isActive }) => ({
  display:'flex', alignItems:'center', gap:9, padding:'9px 12px', borderRadius:8,
  color: isActive ? '#fff' : '#94a3b8',
  background: isActive ? 'linear-gradient(135deg,#3b82f6,#6366f1)' : 'none',
  fontSize:13, fontWeight:500, textDecoration:'none', transition:'all 0.15s',
  border:'none', cursor:'pointer', width:'100%',
  boxShadow: isActive ? '0 2px 8px rgba(99,102,241,0.4)' : 'none',
})

const Icon = ({ d, d2 }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>{d2 && <path d={d2}/>}
  </svg>
)

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={s.wrap}>
      <div style={s.topbar}>
        <div style={s.logo}><div style={s.logoDot}/>CodeX</div>
        <div style={s.topRight}>
          <span style={{ fontSize:12, padding:'4px 10px', borderRadius:20, fontWeight:600,
            background: user?.role==='ADMIN' ? 'rgba(239,68,68,0.2)' : user?.role==='LIBRARIAN' ? 'rgba(245,158,11,0.2)' : 'rgba(34,197,94,0.2)',
            color: user?.role==='ADMIN' ? '#f87171' : user?.role==='LIBRARIAN' ? '#fbbf24' : '#4ade80',
            border: `1px solid ${user?.role==='ADMIN' ? 'rgba(239,68,68,0.4)' : user?.role==='LIBRARIAN' ? 'rgba(245,158,11,0.4)' : 'rgba(34,197,94,0.4)'}` }}>
            {user?.role}
          </span>
          <span style={s.userName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </div>
      <div style={s.body}>
        <nav style={s.sidebar}>
          <div style={s.sLabel}>Main</div>
          <NavLink to="/dashboard" style={navStyle}><Icon d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>Dashboard</NavLink>
          <NavLink to="/books" style={navStyle}><Icon d="M4 19.5A2.5 2.5 0 016.5 17H20" d2="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>Books</NavLink>
          <NavLink to="/my-borrows" style={navStyle}><Icon d="M12 2H2v20l4-4h6" d2="M17 17l5 5M17 22l5-5"/>My borrows</NavLink>
          {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
            <>
              <div style={s.sLabel}>Circulation</div>
              <NavLink to="/members" style={navStyle}><Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" d2="M9 7a4 4 0 100 8 4 4 0 000-8z"/>Members</NavLink>
              <NavLink to="/borrow-return" style={navStyle}><Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" d2="M14 2v6h6M12 18v-6M9 15h6"/>Issue / Return</NavLink>
              <NavLink to="/fines" style={navStyle}><Icon d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>Fines</NavLink>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <>
              <div style={s.sLabel}>Analytics</div>
              <NavLink to="/reports" style={navStyle}><Icon d="M18 20V10M12 20V4M6 20v-6"/>Reports</NavLink>
            </>
          )}
        </nav>
        <main style={s.content}><Outlet /></main>
      </div>
    </div>
  )
}

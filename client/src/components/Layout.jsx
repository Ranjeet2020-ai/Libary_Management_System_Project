import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const s = {
  wrap: { display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f7f4ef' },
  topbar: { height:52, background:'#edeae3', borderBottom:'1px solid #d4cfc4', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', flexShrink:0, position:'sticky', top:0, zIndex:100 },
  logo: { fontFamily:'Playfair Display,serif', fontSize:18, color:'#2c2c2c', letterSpacing:'-0.3px', display:'flex', alignItems:'center', gap:8 },
  logoDot: { width:8, height:8, background:'#4a7c59', borderRadius:2 },
  topRight: { display:'flex', alignItems:'center', gap:12 },
  userName: { fontSize:13, color:'#7a7a72' },
  logoutBtn: { background:'none', border:'1px solid #d4cfc4', borderRadius:8, padding:'5px 12px', color:'#7a7a72', fontSize:12, cursor:'pointer', transition:'all 0.15s' },
  body: { display:'flex', flex:1, minHeight:0 },
  sidebar: { width:200, background:'#edeae3', borderRight:'1px solid #d4cfc4', padding:'16px 10px', display:'flex', flexDirection:'column', gap:2, flexShrink:0 },
  sLabel: { fontSize:10, color:'#b0b0a6', textTransform:'uppercase', letterSpacing:'1px', padding:'12px 10px 4px', fontWeight:500 },
  content: { flex:1, overflowY:'auto', padding:'28px 32px', background:'#f7f4ef' },
}

const navStyle = ({ isActive }) => ({
  display:'flex', alignItems:'center', gap:8, padding:'8px 10px', borderRadius:8,
  color: isActive ? '#2c2c2c' : '#9a9a90', background: isActive ? '#dedad0' : 'none',
  fontSize:13, fontWeight:500, textDecoration:'none', transition:'all 0.15s',
  border:'none', cursor:'pointer', width:'100%',
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
          <span style={s.userName}>{user?.name} · {user?.role}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign out</button>
        </div>
      </div>
      <div style={s.body}>
        <nav style={s.sidebar}>
          <div style={s.sLabel}>Main</div>
          <NavLink to="/dashboard" style={navStyle}>
            <Icon d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"/>Dashboard
          </NavLink>
          <NavLink to="/books" style={navStyle}>
            <Icon d="M4 19.5A2.5 2.5 0 016.5 17H20" d2="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>Books
          </NavLink>
          <NavLink to="/my-borrows" style={navStyle}>
            <Icon d="M12 2H2v20l4-4h6" d2="M17 17l5 5M17 22l5-5"/>My borrows
          </NavLink>

          {(user?.role === 'ADMIN' || user?.role === 'LIBRARIAN') && (
            <>
              <div style={s.sLabel}>Circulation</div>
              <NavLink to="/members" style={navStyle}>
                <Icon d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" d2="M9 7a4 4 0 100-8 4 4 0 000 8z"/>Members
              </NavLink>
              <NavLink to="/borrow-return" style={navStyle}>
                <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" d2="M14 2v6h6M12 18v-6M9 15h6"/>Issue / Return
              </NavLink>
              <NavLink to="/fines" style={navStyle}>
                <Icon d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>Fines
              </NavLink>
            </>
          )}

          {user?.role === 'ADMIN' && (
            <>
              <div style={s.sLabel}>Analytics</div>
              <NavLink to="/reports" style={navStyle}>
                <Icon d="M18 20V10M12 20V4M6 20v-6"/>Reports
              </NavLink>
            </>
          )}
        </nav>
        <main style={s.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

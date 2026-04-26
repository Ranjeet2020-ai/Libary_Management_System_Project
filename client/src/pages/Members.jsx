import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const roleStyle = { STUDENT: { bg:'rgba(55,138,221,.12)', color:'#5090c0' }, LIBRARIAN: { bg:'rgba(154,124,69,.15)', color:'#9a7c45' }, ADMIN: { bg:'rgba(180,80,80,.12)', color:'#b06060' } }

export default function Members() {
  const { user } = useAuth()
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/users').then(r => setMembers(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  const deleteUser = async (id) => {
    if (!confirm('Delete this member?')) return
    await api.delete(`/users/${id}`)
    load()
  }

  const initials = (name) => name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)

  return (
    <div>
      <div style={{ fontFamily:'Playfair Display,serif', fontSize:26, color:'#f0eadc', marginBottom:4 }}>Members</div>
      <div style={{ fontSize:12, color:'#4a4035', marginBottom:20 }}>Manage students, librarians and admins.</div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or email…"
          style={{ flex:1, padding:'9px 14px', background:'#161410', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13, outline:'none', fontFamily:'DM Sans,sans-serif' }}/>
      </div>

      <div style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', tableLayout:'fixed' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #2a2520' }}>
              {['Member','Email','Role','Borrows','Joined','Action'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding:24, textAlign:'center', fontSize:13, color:'#3a3530' }}>Loading…</td></tr>
            ) : filtered.map(m => {
              const rs = roleStyle[m.role] || roleStyle.STUDENT
              return (
                <tr key={m.id} style={{ borderBottom:'1px solid #1a1814' }}>
                  <td style={{ padding:'10px 14px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background:'#2a2520', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'#9a7c45', fontWeight:500, flexShrink:0 }}>{initials(m.name)}</div>
                      <span style={{ fontSize:13, color:'#c0b090', fontWeight:500 }}>{m.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'#6a6050' }}>{m.email}</td>
                  <td style={{ padding:'10px 14px' }}>
                    <span style={{ fontSize:10, padding:'2px 8px', borderRadius:10, fontWeight:500, background:rs.bg, color:rs.color }}>{m.role}</span>
                  </td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'#6a6050' }}>{m._count?.borrows || 0}</td>
                  <td style={{ padding:'10px 14px', fontSize:12, color:'#4a4035' }}>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding:'10px 14px' }}>
                    {user.role === 'ADMIN' && m.id !== user.id && (
                      <button onClick={() => deleteUser(m.id)} style={{ padding:'4px 10px', background:'none', border:'1px solid #3a3530', borderRadius:6, color:'#8a5a5a', fontSize:11, cursor:'pointer' }}>Remove</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

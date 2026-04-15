import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'STUDENT' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) return setError('All fields are required.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', form)
      login(data.token, data.user, false)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inp = { width:'100%', padding:'11px 14px', background:'#edeae3', border:'1px solid #d4cfc4', borderRadius:10, color:'#2c2c2c', fontFamily:'DM Sans,sans-serif', fontSize:13, outline:'none' }
  const lbl = { display:'block', fontSize:11, fontWeight:500, letterSpacing:'1px', textTransform:'uppercase', color:'#9a9a90', marginBottom:7 }

  return (
    <div style={{ minHeight:'100vh', background:'#f7f4ef', display:'flex', alignItems:'center', justifyContent:'center', padding:24, fontFamily:'DM Sans,sans-serif' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:36 }}>
          <div style={{ fontFamily:'Playfair Display,serif', fontSize:28, color:'#2c2c2c', marginBottom:8 }}>Create an <em style={{ fontStyle:'italic', color:'#4a7c59' }}>account</em></div>
          <div style={{ fontSize:13, color:'#9a9a90' }}>Join CodeX today</div>
        </div>

        {error && (
          <div style={{ background:'rgba(192,57,43,.08)', border:'1px solid rgba(192,57,43,.2)', borderRadius:8, padding:'10px 14px', fontSize:12, color:'#c0392b', marginBottom:18 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div>
            <label style={lbl}>Full name</label>
            <input style={inp} placeholder="Your full name" value={form.name} onChange={set('name')} autoComplete="name"/>
          </div>
          <div>
            <label style={lbl}>Email address</label>
            <input style={inp} type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} autoComplete="email"/>
          </div>
          <div>
            <label style={lbl}>Password</label>
            <input style={inp} type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} autoComplete="new-password"/>
          </div>
          <div>
            <label style={lbl}>Role</label>
            <select style={{ ...inp, cursor:'pointer' }} value={form.role} onChange={set('role')}>
              <option value="STUDENT">Student</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{ padding:'13px', background:'#4a7c59', border:'none', borderRadius:10, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer', marginTop:4, opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={{ textAlign:'center', marginTop:20, fontSize:12, color:'#b0b0a6' }}>
          Already have an account? <Link to="/login" style={{ color:'#4a7c59', textDecoration:'none', fontWeight:500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}

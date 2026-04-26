import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.lr{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;font-family:'DM Sans',sans-serif}
.lp{position:relative;background:#2c3a2e;display:flex;flex-direction:column;justify-content:space-between;padding:48px;overflow:hidden}
.lp::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 20% 80%,rgba(74,124,89,.3) 0%,transparent 60%),radial-gradient(ellipse 50% 60% at 85% 15%,rgba(40,80,50,.2) 0%,transparent 55%);pointer-events:none}
.brand{position:relative;z-index:1}
.brand-mark{display:flex;align-items:center;gap:10px;margin-bottom:8px}
.brand-icon{width:36px;height:36px;background:rgba(255,255,255,.15);border-radius:8px;display:flex;align-items:center;justify-content:center}
.brand-name{font-family:'Playfair Display',serif;font-size:18px;font-weight:600;color:#f0f7f2}
.brand-tag{font-size:11px;color:rgba(240,247,242,.5);letter-spacing:.5px;text-transform:uppercase;margin-left:46px}
.hero{position:relative;z-index:1}
.eyebrow{font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:#8ec9a0;margin-bottom:20px;display:flex;align-items:center;gap:10px}
.eyebrow::before{content:'';width:28px;height:1px;background:#8ec9a0}
.h1{font-family:'Playfair Display',serif;font-size:clamp(32px,4vw,50px);line-height:1.12;color:#f0f7f2;margin-bottom:24px;letter-spacing:-1px}
.h1 em{font-style:italic;color:#8ec9a0}
.hsub{font-size:14px;line-height:1.7;color:rgba(240,247,242,.6);max-width:340px;font-weight:300}
.stats{display:flex;gap:32px;position:relative;z-index:1}
.stat{display:flex;flex-direction:column;gap:2px}
.sn{font-family:'Playfair Display',serif;font-size:24px;font-weight:600;color:#f0f7f2}
.sl{font-size:11px;color:rgba(240,247,242,.5);text-transform:uppercase;letter-spacing:.5px}
.sdiv{width:1px;background:rgba(240,247,242,.2);align-self:stretch}
.rp{background:#f7f4ef;display:flex;align-items:center;justify-content:center;padding:48px;position:relative}
.rp::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 30%,rgba(74,124,89,.05) 0%,transparent 60%);pointer-events:none}
.fc{width:100%;max-width:380px;position:relative;z-index:1}
.fh{margin-bottom:36px}
.fw{font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:#4a7c59;margin-bottom:12px}
.ft{font-family:'Playfair Display',serif;font-size:28px;font-weight:600;color:#2c2c2c;letter-spacing:-.5px}
.ft span{font-style:italic;color:#4a7c59}
.roles{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:28px}
.rb{padding:9px 6px;background:#edeae3;border:1px solid #d4cfc4;border-radius:8px;color:#9a9a90;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;text-align:center}
.rb:hover{border-color:#bfb9ac;color:#7a7a72}
.rb.on{border-color:#4a7c59;color:#4a7c59;background:rgba(74,124,89,.08)}
.field{margin-bottom:18px}
.fl{display:block;font-size:11px;font-weight:500;letter-spacing:1px;text-transform:uppercase;color:#9a9a90;margin-bottom:7px}
.iw{position:relative}
.iw svg.ii{position:absolute;left:13px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:#bfb9ac;pointer-events:none;transition:color .2s}
.fi{width:100%;padding:12px 12px 12px 40px;background:#edeae3;border:1px solid #d4cfc4;border-radius:10px;color:#2c2c2c;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:400;outline:none;transition:border-color .2s}
.fi::placeholder{color:#bfb9ac}
.fi:focus{border-color:#4a7c59;background:#fff}
.fi:focus~svg.ii,.iw:focus-within svg.ii{color:#4a7c59}
.eye{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#bfb9ac;display:flex;align-items:center;transition:color .2s;padding:0}
.eye:hover{color:#4a7c59}
.eye svg{width:15px;height:15px}
.fi.ep{padding-right:40px}
.or{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.rl{display:flex;align-items:center;gap:7px;cursor:pointer;font-size:12px;color:#9a9a90;user-select:none}
.rc{appearance:none;-webkit-appearance:none;width:15px;height:15px;border:1px solid #d4cfc4;border-radius:4px;background:#edeae3;cursor:pointer;position:relative;transition:all .2s;flex-shrink:0}
.rc:checked{background:#4a7c59;border-color:#4a7c59}
.rc:checked::after{content:'';position:absolute;left:4px;top:1px;width:5px;height:8px;border:1.5px solid #fff;border-top:none;border-left:none;transform:rotate(45deg)}
.fa{font-size:12px;color:#9a9a90;text-decoration:none;transition:color .2s}
.fa:hover{color:#4a7c59}
.sb{width:100%;padding:13px;background:#4a7c59;border:none;border-radius:10px;color:#fff;font-family:'DM Sans',sans-serif;font-size:13px;font-weight:500;letter-spacing:.3px;cursor:pointer;transition:background .2s,transform .1s;display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:20px}
.sb:hover{background:#3d6b4a}
.sb:active{transform:scale(.99)}
.sb:disabled{opacity:.5;cursor:not-allowed;transform:none}
.spin{width:15px;height:15px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:sp .7s linear infinite}
@keyframes sp{to{transform:rotate(360deg)}}
.err{background:rgba(192,57,43,.08);border:1px solid rgba(192,57,43,.2);border-radius:8px;padding:10px 13px;font-size:12px;color:#c0392b;margin-bottom:18px;display:flex;align-items:center;gap:7px}
.err svg{width:13px;height:13px;flex-shrink:0}
.ff{text-align:center;font-size:12px;color:#b0b0a6}
.ff a{color:#4a7c59;text-decoration:none;font-weight:500}
.ff a:hover{color:#3d6b4a}
@media(max-width:768px){.lr{grid-template-columns:1fr}.lp{display:none}.rp{padding:32px 20px}}
`

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(false)
  const [role, setRole] = useState('STUDENT')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      login(data.token, data.user, remember)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="lr">
        <div className="lp">
          <div className="brand">
            <div className="brand-mark">
              <div className="brand-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f0f7f2" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
              </div>
              <span className="brand-name">CodeX</span>
            </div>
            <div className="brand-tag">Library Management System</div>
          </div>
          <div className="hero">
            <div className="eyebrow">Knowledge Portal</div>
            <h1 className="h1">Every great story<br/>begins with a <em>single page.</em></h1>
            <p className="hsub">Manage collections, track borrowings, and connect readers with the books they love.</p>
          </div>
          <div className="stats">
            <div className="stat"><span className="sn">12,400</span><span className="sl">Books</span></div>
            <div className="sdiv"/>
            <div className="stat"><span className="sn">3,200</span><span className="sl">Members</span></div>
            <div className="sdiv"/>
            <div className="stat"><span className="sn">98%</span><span className="sl">Satisfaction</span></div>
          </div>
        </div>
        <div className="rp">
          <div className="fc">
            <div className="fh">
              <div className="fw">Welcome back</div>
              <h2 className="ft">Sign in to your <span>account</span></h2>
            </div>
            <div className="roles">
              {['STUDENT','LIBRARIAN','ADMIN'].map(r => (
                <button key={r} type="button" className={`rb${role===r?' on':''}`} onClick={() => setRole(r)}>
                  {r.charAt(0)+r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} noValidate>
              {error && <div className="err"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>{error}</div>}
              <div className="field">
                <label className="fl" htmlFor="email">Email address</label>
                <div className="iw">
                  <input id="email" type="email" className="fi" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/>
                  <svg className="ii" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/></svg>
                </div>
              </div>
              <div className="field">
                <label className="fl" htmlFor="password">Password</label>
                <div className="iw">
                  <input id="password" type={showPw?'text':'password'} className="fi ep" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/>
                  <svg className="ii" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                  <button type="button" className="eye" onClick={()=>setShowPw(v=>!v)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{showPw?<path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>:<><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></>}</svg>
                  </button>
                </div>
              </div>
              <div className="or">
                <label className="rl"><input type="checkbox" className="rc" checked={remember} onChange={e=>setRemember(e.target.checked)}/>Remember me</label>
                <a href="#" className="fa">Forgot password?</a>
              </div>
              <button type="submit" className="sb" disabled={loading}>
                {loading ? <><div className="spin"/>Signing in…</> : <>Sign in <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></>}
              </button>
            </form>
            <div className="ff">Don't have an account? <Link to="/register">Create one here</Link></div>
          </div>
        </div>
      </div>
    </>
  )
}

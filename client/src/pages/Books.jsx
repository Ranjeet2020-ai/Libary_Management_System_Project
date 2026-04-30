import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const COLORS = ['#3c2a1e','#1e2a3c','#2a3c1e','#3c1e2a','#1e3c38','#38301e','#2a1e3c','#3c2a38']

function BookModal({ book, onClose, onSaved }) {
  const [form, setForm] = useState(book || { title:'',author:'',isbn:'',category:'',description:'',totalCopies:1,coverColor:COLORS[0] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    if (!form.title || !form.author || !form.isbn || !form.category) return setError('Title, author, ISBN and category are required.')
    setLoading(true)
    try {
      if (book) await api.put(`/books/${book.id}`, form)
      else await api.post('/books', form)
      onSaved()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save.')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 }}>
      <div style={{ background:'#1a1710', border:'1px solid #2a2520', borderRadius:12, padding:28, width:480, maxWidth:'90vw', maxHeight:'90vh', overflowY:'auto' }}>
        <h3 style={{ color:'#f0eadc', marginBottom:20, fontSize:16 }}>{book ? 'Edit book' : 'Add new book'}</h3>
        {error && <div style={{ background:'rgba(138,90,90,.15)', border:'1px solid #8a5a5a', borderRadius:8, padding:'8px 12px', color:'#c07070', fontSize:12, marginBottom:14 }}>{error}</div>}
        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5 }}>Title</label>
          <input value={form.title} onChange={set('title')} placeholder="Book title" style={{ width:'100%', padding:'9px 12px', background:'#0f0e0c', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13 }} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5 }}>Author</label>
            <input value={form.author} onChange={set('author')} placeholder="Author name" style={{ width:'100%', padding:'9px 12px', background:'#0f0e0c', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13 }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5 }}>ISBN</label>
            <input value={form.isbn} onChange={set('isbn')} placeholder="978-..." style={{ width:'100%', padding:'9px 12px', background:'#0f0e0c', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13 }} />
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
          <div>
            <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5 }}>Category</label>
            <input value={form.category} onChange={set('category')} placeholder="Fiction, Science..." style={{ width:'100%', padding:'9px 12px', background:'#0f0e0c', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13 }} />
          </div>
          <div>
            <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5 }}>Copies</label>
            <input type="number" value={form.totalCopies} onChange={set('totalCopies')} min={1} style={{ width:'100%', padding:'9px 12px', background:'#0f0e0c', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13 }} />
          </div>
        </div>
        <div style={{ marginBottom:14 }}>
          <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:5 }}>Description</label>
          <textarea value={form.description} onChange={set('description')} placeholder="Optional description" rows={3} style={{ width:'100%', padding:'9px 12px', background:'#0f0e0c', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13, resize:'vertical' }} />
        </div>
        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontSize:10, color:'#4a4035', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:8 }}>Cover Color</label>
          <div style={{ display:'flex', gap:8 }}>
            {COLORS.map(c => (
              <div key={c} onClick={() => setForm(f => ({ ...f, coverColor:c }))} style={{ width:28, height:28, borderRadius:6, background:c, cursor:'pointer', border: form.coverColor===c ? '2px solid #9a7c45' : '2px solid transparent' }} />
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ padding:'8px 16px', background:'none', border:'1px solid #2a2520', borderRadius:8, color:'#6a6050', fontSize:13, cursor:'pointer' }}>Cancel</button>
          <button onClick={save} disabled={loading} style={{ padding:'8px 16px', background:'#9a7c45', border:'none', borderRadius:8, color:'#fff', fontSize:13, cursor:'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'Saving…' : 'Save book'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Books() {
  const { user } = useAuth()
  const [books, setBooks] = useState([])
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState([])
  const [catFilter, setCatFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const canEdit = user.role !== 'STUDENT'

  const load = () => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    if (catFilter) params.category = catFilter
    api.get('/books', { params }).then(r => setBooks(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { api.get('/books/categories').then(r => setCategories(r.data)) }, [])
  useEffect(() => { load() }, [search, catFilter])

  const deleteBook = async (id) => {
    if (!confirm('Delete this book?')) return
    await api.delete(`/books/${id}`)
    load()
  }

  const borrowBook = async (id) => {
    try {
      await api.post('/borrows/borrow', { bookId: id })
      alert('Book borrowed successfully!')
      load()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to borrow book.')
    }
  }

  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontSize:22, color:'#f0eadc', marginBottom:4 }}>Books</h1>
        <p style={{ fontSize:13, color:'#4a4035' }}>Search, browse and manage your collection.</p>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search title, author, ISBN..." style={{ flex:1, padding:'9px 14px', background:'#161410', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13 }} />
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{ padding:'9px 14px', background:'#161410', border:'1px solid #2a2520', borderRadius:8, color:'#f0eadc', fontSize:13 }}>
          <option value="">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {canEdit && <button onClick={() => setModal(true)} style={{ padding:'9px 16px', background:'#9a7c45', border:'none', borderRadius:8, color:'#fff', fontSize:13, fontWeight:500, cursor:'pointer' }}>+ Add book</button>}
      </div>

      {loading ? <div style={{ color:'#3a3530', fontSize:13 }}>Loading…</div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10 }}>
          {books.map(book => (
            <div key={book.id} style={{ background:'#161410', border:'1px solid #2a2520', borderRadius:10, overflow:'hidden', cursor:'default' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#9a7c45'} onMouseLeave={e=>e.currentTarget.style.borderColor='#2a2520'}>
              <div style={{ height:90, background:book.coverColor || '#3c2a1e', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'rgba(255,255,255,0.5)', textAlign:'center', padding:8 }}>
                {book.title}
              </div>
              <div style={{ padding:12 }}>
                <div style={{ fontSize:12, color:'#c0b090', fontWeight:500, marginBottom:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{book.title}</div>
                <div style={{ fontSize:11, color:'#4a4035', marginBottom:10 }}>{book.author}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ fontSize:10, color:'#3a3530' }}>ISBN {book.isbn.slice(-4)}</span>
                  <span style={{ fontSize:10, padding:'2px 7px', borderRadius:10, fontWeight:500, background: book.available>0 ? 'rgba(90,138,90,.15)' : 'rgba(138,90,90,.15)', color: book.available>0 ? '#5a8a5a' : '#8a5a5a' }}>
                    {book.available>0 ? `${book.available} left` : 'Out'}
                  </span>
                </div>
                {!canEdit && book.available > 0 && (
                  <button onClick={() => borrowBook(book.id)} style={{ width:'100%', padding:'6px', background:'#2d6a4f', border:'none', borderRadius:6, color:'#fff', fontSize:11, cursor:'pointer', fontWeight:500 }}>
                    Borrow
                  </button>
                )}
                {canEdit && (
                  <div style={{ display:'flex', gap:6 }}>
                    <button onClick={() => setModal(book)} style={{ flex:1, padding:'5px', background:'#1f1c18', border:'1px solid #3a3530', borderRadius:6, color:'#9a7c45', fontSize:11, cursor:'pointer' }}>Edit</button>
                    {user.role === 'ADMIN' && <button onClick={() => deleteBook(book.id)} style={{ flex:1, padding:'5px', background:'#1f1c18', border:'1px solid #3a3530', borderRadius:6, color:'#8a5a5a', fontSize:11, cursor:'pointer' }}>Delete</button>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {modal && <BookModal book={modal===true ? null : modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); load() }} />}
    </div>
  )
}

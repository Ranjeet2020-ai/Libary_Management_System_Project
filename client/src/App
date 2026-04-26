import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Members from './pages/Members'
import BorrowReturn from './pages/BorrowReturn'
import Fines from './pages/Fines'
import Reports from './pages/Reports'
import MyBorrows from './pages/MyBorrows'
import Layout from './components/Layout'

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',color:'#9a7c45',fontFamily:'DM Sans,sans-serif' }}>Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="books" element={<Books />} />
            <Route path="my-borrows" element={<MyBorrows />} />
            <Route path="members" element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><Members /></ProtectedRoute>} />
            <Route path="borrow-return" element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><BorrowReturn /></ProtectedRoute>} />
            <Route path="fines" element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><Fines /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute roles={['ADMIN']}><Reports /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

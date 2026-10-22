import { useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import CustomerHomePage from './pages/CustomerHomePage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import StaffNewsPage from './pages/StaffNewsPage.jsx'
import Login from './components/LoginComponent.jsx'
import Register from './components/RegisterComponent.jsx'
import './App.css'

function Site() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem('token') ? JSON.parse(localStorage.getItem('currentUser')) : null
    } catch { return null }
  })
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    setUser(null)
    navigate('/')
  }
  const canManageNews = user && [1, 2].includes(Number(user.accountRole))
  return <>
    <header className="site-nav"><div className="container nav-content">
      <Link className="brand" to="/">FU News</Link>
      <nav className="nav-links" aria-label="?i?u h??ng ch?nh">
        <Link to="/">Trang ch?</Link>
        {canManageNews && <Link to="/staff/news">Staff ? B?i vi?t</Link>}
      </nav>
      <div className="nav-auth">
        {user ? <><span className="nav-user">{user.accountName}</span><button className="auth-button auth-login" onClick={logout}>??ng xu?t</button></> : <>
          <Link className="auth-button auth-login" to="/login">??ng nh?p</Link>
          <Link className="auth-button auth-register" to="/register">??ng k?</Link>
        </>}
      </div>
    </div></header>
    <Routes>
      <Route path="/" element={<CustomerHomePage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLoginSuccess={data => { setUser(data); navigate('/', { replace: true }) }} onSwitchToRegister={() => navigate('/register')} />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onSwitchToLogin={() => navigate('/login')} />} />
      <Route path="/staff/news" element={canManageNews ? <StaffNewsPage /> : <Navigate to={user ? '/' : '/login'} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
}
export default function App() {
  return <BrowserRouter><Site /></BrowserRouter>
}

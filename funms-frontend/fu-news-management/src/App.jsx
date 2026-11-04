import { useState } from 'react'
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import CustomerHomePage from './pages/CustomerHomePage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import StaffNewsPage from './pages/StaffNewsPage.jsx'
import MyArticlesPage from './pages/MyArticlesPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import AdminReviewPage from './pages/AdminReviewPage.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import Login from './components/LoginComponent.jsx'
import Register from './components/RegisterComponent.jsx'
import CategoryManagementPage from './pages/CategoryManagementPage.jsx'
import TagManagementPage from './pages/TagManagementPage.jsx'
import AccountManagement from './pages/AccountManagement.jsx'
import './App.css'

function Site() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(() => {
    try {
      return localStorage.getItem('token') ? JSON.parse(localStorage.getItem('currentUser')) : null
    } catch { return null }
  })

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    setUser(null)
    navigate('/login', { replace: true })
  }
  const isAdmin = user && Number(user.accountRole) === 1
  const isContributor = user && Number(user.accountRole) === 2
  const inAdminArea = location.pathname === '/admin' || location.pathname.startsWith('/admin/')

  return <>
    {!inAdminArea && <header className="site-nav"><div className="container nav-content">
      <Link className="brand" to={isAdmin ? '/admin' : '/'}>FU News</Link>
      <nav className="nav-links" aria-label="Điều hướng chính">
        <Link to="/public">Trang chủ</Link>
        {isAdmin && <Link to="/admin">Quản trị Admin</Link>}
        {isContributor && <Link to="/contributor/my-articles">Bài viết của tôi</Link>}
        {isContributor && <Link to="/manage/categories">Danh mục</Link>}
        {isContributor && <Link to="/manage/tags">Tag</Link>}
      </nav>
      <div className="nav-auth">
        {user ? <><span className="nav-user">{user.accountName}</span><button className="auth-button auth-login" onClick={logout}>Đăng xuất</button></> : <>
          <Link className="auth-button auth-login" to="/login">Đăng nhập</Link>
          <Link className="auth-button auth-register" to="/register">Đăng ký</Link>
        </>}
      </div>
    </div></header>}

    <Routes>
      <Route path="/" element={isAdmin ? <Navigate to="/admin" replace /> : <CustomerHomePage />} />
      <Route path="/public" element={<CustomerHomePage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/login" element={user ? <Navigate to={isAdmin ? '/admin' : '/contributor/my-articles'} replace /> :
        <Login onLoginSuccess={data => {
          setUser(data)
          navigate(Number(data.accountRole) === 1 ? '/admin' : '/contributor/my-articles', { replace: true })
        }} onSwitchToRegister={() => navigate('/register')} />} />
      <Route path="/register" element={user ? <Navigate to={isAdmin ? '/admin' : '/contributor/my-articles'} replace /> :
        <Register onSwitchToLogin={() => navigate('/login')} />} />

      <Route path="/admin" element={isAdmin ? <AdminLayout user={user} onLogout={logout} /> : <Navigate to={user ? '/' : '/login'} replace />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="reviews" element={<AdminReviewPage />} />
        <Route path="articles" element={<StaffNewsPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="tags" element={<TagManagementPage />} />
        <Route path="accounts" element={<AccountManagement />} />
      </Route>
      <Route path="/staff/news" element={<Navigate to={isAdmin ? '/admin/articles' : isContributor ? '/contributor/my-articles' : '/login'} replace />} />
      <Route path="/contributor/my-articles" element={isContributor ? <MyArticlesPage /> : <Navigate to={isAdmin ? '/admin' : '/login'} replace />} />
      <Route path="/manage/categories" element={isAdmin ? <Navigate to="/admin/categories" replace /> : isContributor ? <CategoryManagementPage /> : <Navigate to="/login" replace />} />
      <Route path="/manage/tags" element={isAdmin ? <Navigate to="/admin/tags" replace /> : isContributor ? <TagManagementPage /> : <Navigate to="/login" replace />} />
      <Route path="/manage/accounts" element={isAdmin ? <Navigate to="/admin/accounts" replace /> : <Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to={isAdmin ? '/admin' : '/'} replace />} />
    </Routes>
  </>
}
export default function App() {
  return <BrowserRouter><Site /></BrowserRouter>
}

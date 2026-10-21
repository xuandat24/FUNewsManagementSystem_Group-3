import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom'
import CustomerHomePage from './pages/CustomerHomePage.jsx'
import NewsDetailPage from './pages/NewsDetailPage.jsx'
import StaffNewsPage from './pages/StaffNewsPage.jsx'
import './App.css'

// Demo Member 2: khi nhom co Login/Layout chinh, ghep route /staff/news vao layout Staff.
function App() {
  return <BrowserRouter>
    <header className="site-nav"><div className="container d-flex align-items-center justify-content-between py-3">
      <Link className="brand" to="/">FU News</Link>
      <nav className="d-flex gap-3"><Link to="/">Trang chủ</Link><Link to="/staff/news">Staff · Bài viết</Link></nav>
    </div></header>
    <Routes>
      <Route path="/" element={<CustomerHomePage />} />
      <Route path="/news/:id" element={<NewsDetailPage />} />
      <Route path="/staff/news" element={<StaffNewsPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
}
export default App

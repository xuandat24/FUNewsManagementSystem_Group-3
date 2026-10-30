import { useEffect, useState } from "react";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import CustomerHomePage from "./pages/CustomerHomePage.jsx";
import NewsDetailPage from "./pages/NewsDetailPage.jsx";
import StaffNewsPage from "./pages/StaffNewsPage.jsx";
import Login from "./components/LoginComponent.jsx";
import Register from "./components/RegisterComponent.jsx";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("login"); // 'login' hoặc 'register'

  // Kiểm tra đăng nhập khi load trang
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setUser(null);
    setCurrentView("login");
  };

  // Nếu CHƯA đăng nhập -> Hiển thị Login / Register
  if (!user) {
    if (currentView === "register") {
      return <Register onSwitchToLogin={() => setCurrentView("login")} />;
    }
    return (
      <Login
        onLoginSuccess={(userData) => setUser(userData)}
        onSwitchToRegister={() => setCurrentView("register")}
      />
    );
  }

  // Nếu ĐÃ đăng nhập -> Hiển thị Layout hệ thống
  return (
    <BrowserRouter>
      <header className="site-nav bg-dark text-white">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <Link
            className="brand text-white text-decoration-none fw-bold"
            to="/"
          >
            FU News
          </Link>
          <nav className="d-flex gap-4 align-items-center">
            <Link className="text-white text-decoration-none" to="/">
              Trang chủ
            </Link>
            <Link className="text-white text-decoration-none" to="/staff/news">
              Staff · Bài viết
            </Link>
            <div className="text-warning fw-semibold">
              Chào, {user.accountName}
            </div>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<CustomerHomePage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/staff/news" element={<StaffNewsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

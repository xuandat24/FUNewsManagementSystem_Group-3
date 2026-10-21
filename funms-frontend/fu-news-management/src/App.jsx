import React, { useState, useEffect } from "react";
import Login from "./components/LoginComponent"; // Nhúng Component Đăng nhập
import Register from "./components/RegisterComponent"; // Nhúng Component Đăng ký

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState("login"); // Trạng thái 'login' hoặc 'register'

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

  // Điều hướng hiển thị màn hình
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

  // Màn hình kết quả sau khi đăng nhập thành công
  return (
    <div className="container py-5" style={{ maxWidth: "650px" }}>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <div>
            <h4 className="fw-bold mb-0 text-success">
               Xác thực thành công!
            </h4>
            <span className="text-muted small">
              Chào mừng bạn trở lại hệ thống
            </span>
          </div>
          <button
            className="btn btn-outline-danger btn-sm px-3"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>

        <div className="bg-light p-3 rounded-3 mb-3">
          <p className="mb-1">
            <strong>Họ tên:</strong> {user.accountName}
          </p>
          <p className="mb-1">
            <strong>Email:</strong> {user.accountEmail}
          </p>
          <p className="mb-1">
            <strong>Vai trò:</strong>{" "}
            {user.accountRole === 1 ? (
              <span className="badge bg-danger">ADMIN (Role 1)</span>
            ) : (
              <span className="badge bg-primary">STAFF (Role 2)</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;

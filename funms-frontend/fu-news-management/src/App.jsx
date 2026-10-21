import React, { useState, useEffect } from "react";
import Login from "./components/LoginComponent";

function App() {
  const [user, setUser] = useState(null);

  // Kiểm tra nếu đã có đăng nhập trước đó trong LocalStorage
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
  };

  // Nếu chưa đăng nhập -> Hiển thị form Login
  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  // Nếu đã đăng nhập -> Hiển thị trang kết quả demo
  return (
    <div className="container py-5" style={{ maxWidth: "650px" }}>
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
          <div>
            <h4 className="fw-bold mb-0 text-success">
              🎉 Đăng nhập thành công!
            </h4>
            <span className="text-muted small">
              Hệ thống phân quyền đã nhận diện tài khoản
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

        <div className="alert alert-info py-2 small mb-0">
          <strong>JWT Token:</strong>
          <div className="text-break font-monospace small mt-1 text-secondary">
            {localStorage.getItem("token")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

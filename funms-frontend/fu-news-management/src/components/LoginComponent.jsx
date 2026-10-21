import React, { useState } from "react";

const Login = ({ onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Hàm gọi API Backend Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier.trim(),
          password: password.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === 200) {
        // Lưu token và thông tin người dùng vào LocalStorage
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("currentUser", JSON.stringify(result.data));

        if (onLoginSuccess) {
          onLoginSuccess(result.data);
        }
      } else {
        setErrorMsg(result.message || "Đăng nhập không thành công!");
      }
    } catch (err) {
      setErrorMsg("Không thể kết nối đến máy chủ Backend (Port 8080)!");
    } finally {
      setLoading(false);
    }
  };

  // Nút hỗ trợ điền nhanh khi demo
  const fillCredentials = (user, pass) => {
    setIdentifier(user);
    setPassword(pass);
    setErrorMsg("");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div
        className="card border-0 shadow-sm rounded-4 w-100"
        style={{ maxWidth: "420px" }}
      >
        <div className="card-body p-4 p-sm-5">
          {/* Logo & Header */}
          <div className="text-center mb-4">
            <div
              className="bg-primary text-white rounded-3 d-inline-flex align-items-center justify-content-center fw-bold fs-4 mb-2 shadow-sm"
              style={{ width: "48px", height: "48px" }}
            >
              FU
            </div>
            <h4 className="fw-bold text-dark mb-1">FUNews Management</h4>
            <p className="text-muted small">
              Hệ thống Quản lý Tin tức Đại học FPT
            </p>
          </div>

          {/* Thông báo lỗi */}
          {errorMsg && (
            <div
              className="alert alert-danger py-2 px-3 small rounded-3"
              role="alert"
            >
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Email hoặc Tên tài khoản
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập email hoặc Admin"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">
                Mật khẩu
              </label>
              <div className="input-group">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold rounded-3 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Đang xác thực...
                </span>
              ) : (
                "Đăng Nhập"
              )}
            </button>
          </form>

          {/* Khu vực hỗ trợ demo nhanh */}
          <div className="mt-4 pt-3 border-top">
            <p className="text-muted small text-center mb-2">
              Điền nhanh dữ liệu mẫu demo:
            </p>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-outline-danger btn-sm w-50"
                onClick={() => fillCredentials("admin@funews.edu", "admin123")}
              >
                Admin
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm w-50"
                onClick={() =>
                  fillCredentials("dinhvuong@funews.edu", "staff123")
                }
              >
                Staff
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

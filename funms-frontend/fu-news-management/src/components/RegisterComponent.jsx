import React, { useState } from "react";

const Register = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    accountName: "",
    accountEmail: "",
    accountPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (formData.accountPassword !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accountName: formData.accountName.trim(),
            accountEmail: formData.accountEmail.trim(),
            accountPassword: formData.accountPassword.trim(),
          }),
        },
      );

      const result = await response.json();

      if (response.ok && result.status === 200) {
        setSuccessMsg("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => {
          onSwitchToLogin();
        }, 1500);
      } else {
        setErrorMsg(result.message || "Đăng ký không thành công!");
      }
    } catch (err) {
      setErrorMsg("Không thể kết nối đến máy chủ Backend!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light px-3">
      <div
        className="card border-0 shadow-sm rounded-4 w-100"
        style={{ maxWidth: "450px" }}
      >
        <div className="card-body p-4 p-sm-5">
          <div className="text-center mb-4">
            <h4 className="fw-bold text-dark mb-1">Tạo Tài Khoản Mới</h4>
            <p className="text-muted small">
              Đăng ký tài khoản nhân viên (Staff) hệ thống
            </p>
          </div>

          {errorMsg && (
            <div className="alert alert-danger py-2 px-3 small rounded-3">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success py-2 px-3 small rounded-3">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Họ và Tên
              </label>
              <input
                type="text"
                name="accountName"
                className="form-control"
                placeholder="Nguyễn Văn A"
                value={formData.accountName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">
                Địa chỉ Email
              </label>
              <input
                type="email"
                name="accountEmail"
                className="form-control"
                placeholder="name@funews.edu.vn"
                value={formData.accountEmail}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row mb-4">
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  name="accountPassword"
                  className="form-control"
                  placeholder="Tối thiểu 6 ký tự"
                  minLength="6"
                  value={formData.accountPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-6">
                <label className="form-label small fw-semibold text-secondary">
                  Xác nhận MK
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold rounded-3 shadow-sm mb-3"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng Ký Ngay"}
            </button>
          </form>

          <div className="text-center mt-3 pt-3 border-top">
            <span className="text-muted small">Đã có tài khoản? </span>
            <button
              className="btn btn-link p-0 text-decoration-none small fw-bold"
              onClick={onSwitchToLogin}
            >
              Đăng nhập tại đây
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

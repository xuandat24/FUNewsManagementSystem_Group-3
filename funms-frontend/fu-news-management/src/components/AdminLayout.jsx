import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "./AdminLayout.css";

const adminMenu = [
  { path: "/admin", icon: "01", title: "Tổng quan", end: true },
  { path: "/admin/reviews", icon: "02", title: "Duyệt bài viết" },
  { path: "/admin/articles", icon: "03", title: "Quản lý bài viết" },
  { path: "/admin/categories", icon: "04", title: "Danh mục" },
  { path: "/admin/tags", icon: "05", title: "Thẻ Tag" },
  { path: "/admin/accounts", icon: "06", title: "Tài khoản" },
];

const staffMenu = [
  { path: "/contributor/my-articles", icon: "01", title: "Bài viết của tôi" },
  { path: "/manage/categories", icon: "02", title: "Danh mục" },
  { path: "/manage/tags", icon: "03", title: "Thẻ Tag" },
];

export default function AdminLayout({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isAdmin = user && Number(user.accountRole) === 1;
  const currentMenu = isAdmin ? adminMenu : staffMenu;
  const pageTitle =
    currentMenu.find((item) => item.path === location.pathname)?.title || "Quản trị";
  const initial = (user?.accountName || "A").trim().charAt(0).toUpperCase();

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${menuOpen ? "is-open" : ""}`}>
        <Link
          to={isAdmin ? "/admin" : "/contributor/my-articles"}
          className="admin-brand"
          onClick={() => setMenuOpen(false)}
        >
          <span className="admin-brand-mark">FU</span>
          <span>
            <strong>FU News</strong>
            <small>{isAdmin ? "ADMIN WORKSPACE" : "STAFF WORKSPACE"}</small>
          </span>
        </Link>

        <div className="admin-sidebar-label">{isAdmin ? "QUẢN TRỊ HỆ THỐNG" : "KHÔNG GIAN LÀM VIỆC"}</div>
        <nav className="admin-sidebar-nav" aria-label="Menu điều hướng">
          {currentMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `admin-nav-item ${isActive ? "active" : ""}`
              }
            >
              <span className="admin-nav-number">{item.icon}</span>
              <span>{item.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-sidebar-user">
            <span className="admin-avatar">{initial}</span>
            <span>
              <strong>{user?.accountName || (isAdmin ? "Admin" : "Staff")}</strong>
              <small>{isAdmin ? "Quản trị viên" : "Nhân viên (Staff)"}</small>
            </span>
          </div>
          <button className="admin-logout" onClick={onLogout} type="button">
            Đăng xuất
          </button>
        </div>
      </aside>
      {menuOpen && (
        <button
          className="admin-scrim"
          aria-label="Đóng menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-button"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Mở menu"
            >
              ☰
            </button>
            <div>
              <span className="admin-breadcrumb">Workspace / {isAdmin ? "Admin" : "Staff"}</span>
              <strong>{pageTitle}</strong>
            </div>
          </div>
          <div className="admin-topbar-right">
            <Link className="admin-public-link" to="/public">
              Xem trang tin
            </Link>
            <span className="admin-topbar-avatar">{initial}</span>
          </div>
        </header>
        <div className="admin-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

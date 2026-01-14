import { Link, useNavigate } from "react-router-dom";
import { authStorage } from "../../auth/authStorage";
import "../../styles/admin.css";

export default function AdminLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const nav = useNavigate();
  const role = authStorage.getRole();

  const logout = () => {
    authStorage.clear();
    nav("/login");
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <div className="admin__logo"><DumbbellIcon /></div>
          <div>
            <div className="admin__name">Sosa Gym</div>
            <div className="admin__role">{role ?? "—"}</div>
          </div>
        </div>

        <nav className="admin__nav">
          <Link className="admin__navItem" to="/admin">Administración</Link>
        </nav>

        <button className="admin__logout" onClick={logout}>Cerrar sesión</button>
      </aside>

      <main className="admin__main">
        <header className="admin__topbar">
          <h1 className="admin__title">{title}</h1>
          <div className="admin__topActions">
            <span className="pillMini">Panel Admin</span>
          </div>
        </header>

        <section className="admin__content">{children}</section>
      </main>
    </div>
  );
}

function DumbbellIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 10v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M7 9v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M10 8v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M14 8v8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M17 9v6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M20 10v4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
      <path d="M10 12h4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/>
    </svg>
  );
}

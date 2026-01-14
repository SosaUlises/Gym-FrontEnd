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

  const logout = () => {
    authStorage.clear();
    nav("/login");
  };

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">
          <div>
            <div className="admin__name">Sosa Gym</div>
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

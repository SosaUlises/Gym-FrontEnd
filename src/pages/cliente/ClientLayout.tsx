import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authStorage } from "../../auth/authStorage";
import "../../styles/client.css";

type Props = {
  title?: string;
  children: ReactNode;
};

export default function ClientLayout({ title = "Mi cuenta", children }: Props) {
  const { pathname } = useLocation();
  const nav = useNavigate();

  const logout = () => {
    authStorage.clear();
    nav("/login");
  };

  const isActive = (to: string) => (pathname === to ? "clientNav__item active" : "clientNav__item");

  return (
    <div className="client">
      <aside className="clientSide">
        <div className="clientBrand">
          <div className="clientLogo" aria-hidden="true">
            <DumbbellIcon />
          </div>
          <div>
            <div className="clientBrand__name">Sosa Gym</div>
            <div className="clientBrand__role">Cliente</div>
          </div>
        </div>

        <nav className="clientNav">
          <Link to="/cliente" className={isActive("/cliente")}>Inicio</Link>
          <Link to="/cliente/rutina" className={isActive("/cliente/rutina")}>Rutina</Link>
          <Link to="/cliente/progreso" className={isActive("/cliente/progreso")}>Progreso</Link>
          <Link to="/cliente/cuotas" className={isActive("/cliente/cuotas")}>Cuotas</Link>
          <Link to="/cliente/perfil" className={isActive("/cliente/perfil")}>Perfil</Link>
        </nav>

        <button className="clientLogout" onClick={logout}>Cerrar sesión</button>
      </aside>

      <main className="clientMain">
        <header className="clientTop">
          <h1 className="clientTitle">{title}</h1>
          <div className="clientPill">
            <span className="clientPill__dot" />
            <span>Modo Cliente</span>
          </div>
        </header>

        <div className="clientContent">{children}</div>

        {/* Mobile bottom nav */}
        <nav className="clientBottomNav" aria-label="Navegación">
          <Link to="/cliente" className={pathname === "/cliente" ? "bnItem active" : "bnItem"}>Inicio</Link>
          <Link to="/cliente/rutina" className={pathname === "/cliente/rutina" ? "bnItem active" : "bnItem"}>Rutina</Link>
          <Link to="/cliente/progreso" className={pathname === "/cliente/progreso" ? "bnItem active" : "bnItem"}>Progreso</Link>
          <Link to="/cliente/cuotas" className={pathname === "/cliente/cuotas" ? "bnItem active" : "bnItem"}>Cuotas</Link>
          <Link to="/cliente/perfil" className={pathname === "/cliente/perfil" ? "bnItem active" : "bnItem"}>Perfil</Link>
        </nav>
      </main>
    </div>
  );
}

function DumbbellIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

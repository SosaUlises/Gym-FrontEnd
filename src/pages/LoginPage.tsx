import { useState } from "react";
import { http } from "../api/http";
import { authStorage } from "../auth/authStorage";
import { Link } from "react-router-dom";
import "../styles/login.css";

type LoginBody = {
  email: string;
  password: string;
};

// Respuesta tolerante
type LoginResponse = {
  token?: string;
  Token?: string;
  usuario?: any;
  Usuario?: any;
  data?: any;
  Data?: any;
  message?: string;
  Message?: string;
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body: LoginBody = { email, password };
      const res = await http.post<LoginResponse>("/api/v1/auth/login", body);

      const payload = res.data;
      const inner = payload.data ?? payload.Data ?? payload;

      const token = inner.token ?? inner.Token;
      if (!token) throw new Error("No llegó el token desde el servidor.");

      authStorage.setToken(token);

      // Pegarle a /cliente/me luego de loguear
      await http.get("/api/v1/cliente/me");

      window.location.href = "/";
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        err?.message ||
        "Error al loguear";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="login-wrap">
    <div className="orb a" />
    <div className="orb b" />
    <div className="orb c" />

    <div className="login-shell">
      <div className="brand">
        <div className="logo">
        <span className="logo-icon"><DumbbellIcon /></span>
        </div>
        <div>
          <h1>Sosa Gym</h1>
          <span className="tag">Trackeá rutinas, progresos y cuotas</span>
        </div>
      </div>

      <form className="login-card" onSubmit={onSubmit}>
        <div className="head">
          <div>
            <p className="title">Ingresar</p>
            <p className="subtitle">
              Entrená con datos. Entrá con tu cuenta para ver tus rutinas.
            </p>
          </div>

          <div className="pill">
            <span className="dot" />
            <span>Gym Mode</span>
          </div>
        </div>

        <div className="form">
          <div className="field">
            <div className="label">Email</div>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button className="btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

        <div className="footer">
          ¿No tenés cuenta? <Link className="link" to="/register">Crear cuenta</Link>
        </div>


        </div>
      </form>
    </div>
  </div>
);

}

function DumbbellIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
    >
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

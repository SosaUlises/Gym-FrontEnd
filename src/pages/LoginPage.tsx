import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../api/http";
import { authStorage } from "../auth/authStorage";
import "../styles/login.css";

type LoginBody = { email: string; password: string };

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const body: LoginBody = { email, password };
      const res = await http.post("/api/v1/auth/login", body);

      const payload = res.data;
      const inner = payload.data ?? payload.Data ?? payload;
      const token = inner.token ?? inner.Token;

      if (!token) throw new Error("No llegó el token desde el servidor.");

      authStorage.setToken(token);
      const role = authStorage.getRole();
      navigate(role === "Administrador" ? "/admin" : "/app");
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
    <div className="auth">
      {/* LEFT */}
      <div className="auth__left">
        <div className="auth__container">
          <div className="auth__header">
         
            <h1 className="auth__title">Bienvenido de vuelta</h1>
            <p className="auth__subtitle">Ingresa tus credenciales para continuar</p>
          </div>

          <div className="card">
            <form className="form" onSubmit={onSubmit}>
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
                <div className="passWrap">
                  <input
                    className="input passInput"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="eyeBtn"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Ocultar password" : "Mostrar password"}
                    title={showPass ? "Ocultar" : "Mostrar"}
                  >
                    {showPass ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <button className="btn" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
              </button>
            </form>
          </div>

          <p className="footerText">
            ¿No tenés una cuenta?{" "}
            <Link to="/register" className="link">Registrate aquí</Link>
          </p>
        </div>
      </div>

      {/* RIGHT */}
          <div className="auth__right">
        <div className="heroBg" />
        <div className="heroShade" />
        <div className="heroNoise" />

        <div className="heroContent">
          <h2 className="heroTitle">Tu mejor versión te está esperando</h2>
          <p className="heroText">
            Accedé a tu cuenta y continuá tu camino hacia una vida más saludable y activa.
          </p>

          <div className="stats">
            <div>
              <p className="statNum">500+</p>
              <p className="statLbl">Miembros activos</p>
            </div>
            <div>
              <p className="statNum">24/7</p>
              <p className="statLbl">Acceso al gym</p>
            </div>
            <div>
              <p className="statNum">50+</p>
              <p className="statLbl">Clases semanales</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}


function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" stroke="currentColor" strokeWidth="2"/>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" stroke="currentColor" strokeWidth="2"/>
      <path d="M9.9 5.1A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a18.3 18.3 0 0 1-4.2 5.2" stroke="currentColor" strokeWidth="2"/>
      <path d="M6.2 6.2A18.7 18.7 0 0 0 2 12s3.5 7 10 7c1 0 1.9-.2 2.8-.5" stroke="currentColor" strokeWidth="2"/>
      <path d="M2 2l20 20" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

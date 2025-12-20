import { useState } from "react";
import { http } from "../api/http";
import { Link } from "react-router-dom";
import "../styles/login.css";

type RegisterBody = {
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  password: string;
  rol: string; // en tu API existe, lo mandamos como Cliente
  edad: number;
  altura: number;
  peso: number;
  objetivo?: string | null;
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    email: "",
    password: "",
    edad: "",
    altura: "",
    peso: "",
    objetivo: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOk(null);
    setLoading(true);

    try {
      const body: RegisterBody = {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        dni: Number(form.dni),
        email: form.email.trim(),
        password: form.password,
        rol: "Cliente",
        edad: Number(form.edad),
        altura: Number(form.altura),
        peso: Number(form.peso),
        objetivo: form.objetivo?.trim() || null,
      };

     await http.post("/api/v1/cliente", body);


      // éxito
      setOk("Cuenta creada ✅ Ahora podés iniciar sesión.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.Message ||
        err?.message ||
        "Error al registrar";
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
            <span className="tag">Creá tu cuenta</span>
          </div>
        </div>

        <form className="login-card" onSubmit={onSubmit}>
          <div className="head">
            <div>
              <p className="title">Registro</p>
              <p className="subtitle">Completá tus datos y arrancá.</p>
            </div>

            <div className="pill">
              <span className="dot" />
              <span>Nuevo Miembro</span>
            </div>
          </div>

          <div className="form">
            <div className="grid2">
              <div className="field">
                <div className="label">Nombre</div>
                <input className="input" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
              </div>
              <div className="field">
                <div className="label">Apellido</div>
                <input className="input" value={form.apellido} onChange={(e) => set("apellido", e.target.value)} required />
              </div>
            </div>

            <div className="grid2">
              <div className="field">
                <div className="label">DNI</div>
                <input className="input" value={form.dni} onChange={(e) => set("dni", e.target.value)} inputMode="numeric" required />
              </div>
              <div className="field">
                <div className="label">Edad</div>
                <input className="input" value={form.edad} onChange={(e) => set("edad", e.target.value)} inputMode="numeric" required />
              </div>
            </div>

            <div className="field">
              <div className="label">Email</div>
              <input className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </div>

            <div className="field">
              <div className="label">Password</div>
              <input className="input" type="password" value={form.password} onChange={(e) => set("password", e.target.value)} required />
            </div>

            <div className="grid2">
              <div className="field">
                <div className="label">Altura (m)</div>
                <input className="input" value={form.altura} onChange={(e) => set("altura", e.target.value)} placeholder="1.75" required />
              </div>
              <div className="field">
                <div className="label">Peso (kg)</div>
                <input className="input" value={form.peso} onChange={(e) => set("peso", e.target.value)} placeholder="82" required />
              </div>
            </div>

            <div className="field">
              <div className="label">Objetivo (opcional)</div>
              <input className="input" value={form.objetivo} onChange={(e) => set("objetivo", e.target.value)} placeholder="Definición / Volumen / Fuerza..." />
            </div>

            {error && <div className="error">{error}</div>}
            {ok && <div className="ok">{ok}</div>}

            <button className="btn" disabled={loading}>
              {loading ? "Creando..." : "Crear cuenta"}
            </button>

           <div className="footer">
             ¿Ya tenés cuenta? <Link className="link" to="/login">Iniciar sesión</Link>
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

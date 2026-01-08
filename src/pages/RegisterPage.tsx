import { useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../api/http";
import "../styles/login.css";

type RegisterBody = {
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  password: string;
  rol: string;
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
    <div className="auth">
      {/* LEFT */}
      <div className="auth__left">
        <div className="auth__container">
          <div className="auth__header">

            <h1 className="auth__title">Crear cuenta</h1>
            <p className="auth__subtitle">Completá tus datos y arrancá.</p>
          </div>

          <div className="card">
            <form className="form" onSubmit={onSubmit}>
              <div className="grid2">
                <div className="field">
                  <div className="label">Nombre</div>
                  <input
                    className="input"
                    value={form.nombre}
                    onChange={(e) => set("nombre", e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <div className="label">Apellido</div>
                  <input
                    className="input"
                    value={form.apellido}
                    onChange={(e) => set("apellido", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid2">
                <div className="field">
                  <div className="label">DNI</div>
                  <input
                    className="input"
                    value={form.dni}
                    onChange={(e) => set("dni", e.target.value)}
                    inputMode="numeric"
                    required
                  />
                </div>

                <div className="field">
                  <div className="label">Edad</div>
                  <input
                    className="input"
                    value={form.edad}
                    onChange={(e) => set("edad", e.target.value)}
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <div className="label">Email</div>
                <input
                  className="input"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="field">
                <div className="label">Password</div>
                <input
                  className="input"
                  type="password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="grid2">
                <div className="field">
                  <div className="label">Altura (m)</div>
                  <input
                    className="input"
                    value={form.altura}
                    onChange={(e) => set("altura", e.target.value)}
                    placeholder="1.75"
                    required
                  />
                </div>

                <div className="field">
                  <div className="label">Peso (kg)</div>
                  <input
                    className="input"
                    value={form.peso}
                    onChange={(e) => set("peso", e.target.value)}
                    placeholder="82"
                    required
                  />
                </div>
              </div>

              <div className="field">
                <div className="label">Objetivo (opcional)</div>
                <input
                  className="input"
                  value={form.objetivo}
                  onChange={(e) => set("objetivo", e.target.value)}
                  placeholder="Definición / Volumen / Fuerza..."
                />
              </div>

              {error && <div className="error">{error}</div>}
              {ok && <div className="ok">{ok}</div>}

              <button className="btn" disabled={loading}>
                {loading ? "Creando..." : "Crear cuenta"}
              </button>

              <p className="footerText">
                ¿Ya tenés cuenta?{" "}
                <Link className="link" to="/login">Iniciar sesión</Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth__rightregister">
        <div className="heroBg" />
        <div className="heroShade" />
        <div className="heroNoise" />

        <div className="heroContent">
          <h2 className="heroTitle">Arrancá hoy.</h2>
          <p className="heroText">
            Creá tu cuenta y empezá a registrar tus rutinas, progresos y objetivos.
          </p>

          <div className="stats">
            <div>
              <p className="statNum">500+</p>
              <p className="statLbl">Miembros activos</p>
            </div>
            <div>
              <p className="statNum">24/7</p>
              <p className="statLbl">Acceso</p>
            </div>
            <div>
              <p className="statNum">50+</p>
              <p className="statLbl">Clases</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


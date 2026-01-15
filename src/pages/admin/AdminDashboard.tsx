import { useEffect, useMemo, useState } from "react";
import AdminLayout from "./AdminLayout";
import { http } from "../../api/http";
import "../../styles/admin.css";

type Cliente = {
  id: number;
  userId?: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  edad: number;
  altura: number;
  peso: number;
  objetivo?: string | null;
  fechaRegistro?: string;
};

type Cuota = {
  id: number;
  clienteId: number;
  monto: number;
  anio: number;
  mes: number;
  estado: string;
  fechaCreacion?: string;
  fechaPago?: string | null;
  metodoPago?: string | null;
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<"clientes" | "cuotas">("clientes");

  return (
    <AdminLayout title="Administración">
      <div className="tabs">
        <button className={tab === "clientes" ? "tab active" : "tab"} onClick={() => setTab("clientes")}>
          Clientes
        </button>
        <button className={tab === "cuotas" ? "tab active" : "tab"} onClick={() => setTab("cuotas")}>
          Cuotas
        </button>
      </div>

      {tab === "clientes"
      ? <ClientesPanel goToCuotas={(id) => { setTab("cuotas"); setTimeout(() => window.dispatchEvent(new CustomEvent("goCuotas", { detail: id })), 0); }} />
      : <CuotasPanel />
      }

    </AdminLayout>
  );
}

function ClientesPanel({ goToCuotas }: { goToCuotas: (clienteId: number) => void }) {
  const [items, setItems] = useState<Cliente[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [selected, setSelected] = useState<Cliente | null>(null);
  const [saving, setSaving] = useState(false);

  const normalizeCliente = (x: any): Cliente => {
    const id = x.id ?? x.Id ?? x.clienteId ?? x.ClienteId ?? 0;

    return {

      id: Number(id),

      usuarioId: x.usuarioId ?? x.UsuarioId ?? null,

      nombre: x.nombre ?? x.Nombre ?? "",
      apellido: x.apellido ?? x.Apellido ?? "",
      dni: Number(x.dni ?? x.Dni ?? 0),
      email: x.email ?? x.Email ?? "",

      edad: Number(x.edad ?? x.Edad ?? 0),
      altura: Number(x.altura ?? x.Altura ?? 0),
      peso: Number(x.peso ?? x.Peso ?? 0),
      objetivo: x.objetivo ?? x.Objetivo ?? null,

      fechaRegistro: x.fechaRegistro ?? x.FechaRegistro ?? null,
    } as any;
  };

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const res = await http.get("/api/v1/cliente");

      
      const raw = res.data?.data ?? res.data?.Data ?? res.data;
      const list = Array.isArray(raw) ? raw : raw?.items ?? raw?.Items ?? [];

      const normalized = (Array.isArray(list) ? list : []).map(normalizeCliente);

      setItems(normalized);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? e?.response?.data?.Message ?? e?.message ?? "Error cargando clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((c) =>
      `${c.nombre} ${c.apellido}`.toLowerCase().includes(s) ||
      String(c.dni).includes(s) ||
      (c.email ?? "").toLowerCase().includes(s)
    );
  }, [items, q]);

  const onDelete = async (clienteId: number) => {
    if (!clienteId) return alert("ClienteId inválido");
    if (!confirm("¿Eliminar cliente? Esto borra el usuario asociado.")) return;

    try {
      await http.delete(`/api/v1/cliente/${clienteId}`);
      setItems((prev) => prev.filter((x) => x.id !== clienteId));
      if (selected?.id === clienteId) setSelected(null);
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.response?.data?.Message ?? e?.message ?? "Error al borrar");
    }
  };

  const onSave = async () => {
    if (!selected) return;
    if (!selected.id) return alert("ClienteId inválido (no llegó del API)");

    setSaving(true);
    try {
      await http.put(`/api/v1/cliente/${selected.id}`, {
        nombre: selected.nombre,
        apellido: selected.apellido,
        email: selected.email,
        dni: selected.dni,

        password: null,
        rol: null,

        edad: selected.edad,
        altura: selected.altura,
        peso: selected.peso,
        objetivo: selected.objetivo ?? null,
      });

      await load();
      alert("Cliente actualizado");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.response?.data?.Message ?? e?.message ?? "Error al editar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid">
      <div className="panel">
        <div className="panel__head">
          <div>
            <div className="panel__title">Clientes</div>
            <div className="panel__sub">Listado, edición y eliminación.</div>
          </div>
          <button className="btnMini" onClick={load} disabled={loading}>
            {loading ? "Actualizando..." : "Refrescar"}
          </button>
        </div>

        <div className="toolbar">
          <input
            className="inputMini"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, email o DNI..."
          />
          <span className="chip">{filtered.length} resultados</span>
        </div>

        {err && <div className="bannerErr">{err}</div>}

        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Email</th>
                <th>DNI</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className={selected?.id === c.id ? "row active" : "row"}>
                   <td>
                    <div className="mutedMini">{c.id}</div>
                  </td>
                  <td>
                    <div className="strong">{c.apellido}, {c.nombre}</div>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.dni}</td>

                  <td className="actions">
                    <button className="ghost" onClick={() => setSelected(c)}>
                      Editar
                    </button>

                    <button
                      className="ghost"
                      onClick={() => {
                        if (!c.id) return alert("ClienteId inválido");
                        goToCuotas(c.id);
                      }}
                    >
                      Cuotas
                    </button>

                    <button className="danger" onClick={() => onDelete(c.id)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="empty">Sin resultados</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel__head">
          <div>
            <div className="panel__title">Editor</div>
            <div className="panel__sub">Seleccioná un cliente para editar.</div>
          </div>
        </div>

        {!selected ? (
          <div className="emptyBox">Elegí un cliente de la lista.</div>
        ) : (
          <div className="formGrid">
            <Field label="Nombre" value={selected.nombre} onChange={(v) => setSelected({ ...selected, nombre: v })} />
            <Field label="Apellido" value={selected.apellido} onChange={(v) => setSelected({ ...selected, apellido: v })} />
            <Field label="Email" value={selected.email} onChange={(v) => setSelected({ ...selected, email: v })} />
            <Field label="DNI" value={String(selected.dni)} onChange={(v) => setSelected({ ...selected, dni: Number(v) || 0 })} />
            <Field label="Edad" value={String(selected.edad)} onChange={(v) => setSelected({ ...selected, edad: Number(v) || 0 })} />
            <Field label="Altura" value={String(selected.altura)} onChange={(v) => setSelected({ ...selected, altura: Number(v) || 0 })} />
            <Field label="Peso" value={String(selected.peso)} onChange={(v) => setSelected({ ...selected, peso: Number(v) || 0 })} />
            <Field label="Objetivo" value={selected.objetivo ?? ""} onChange={(v) => setSelected({ ...selected, objetivo: v })} />

            <div className="formActions">
              <button className="btnPrimary" onClick={onSave} disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
              <button className="btnMini" onClick={() => setSelected(null)} disabled={saving}>
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


function CuotasPanel() {
  const [clienteId, setClienteId] = useState("");
  const [estado, setEstado] = useState<"" | "Pendiente" | "Pagado">("");
  const [items, setItems] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const handler = (e: any) => {
    const id = String(e.detail);
    setClienteId(id);
    setTimeout(() => loadByCliente(), 0);
  };

  window.addEventListener("goCuotas", handler);
  return () => window.removeEventListener("goCuotas", handler);
}, []);


  // Generación masiva
  const [gen, setGen] = useState({ anio: "", mes: "", monto: "" });
  const setGenField = (k: "anio" | "mes" | "monto", v: string) =>
    setGen((p) => ({ ...p, [k]: v }));

  // Cuota puntual
  const [single, setSingle] = useState({ clienteId: "", anio: "", mes: "", monto: "" });
  const setSingleField = (k: "clienteId" | "anio" | "mes" | "monto", v: string) =>
    setSingle((p) => ({ ...p, [k]: v }));

  const loadByCliente = async () => {
    if (!clienteId) return;
    setLoading(true);
    try {
      const res = await http.get(`/api/v1/cuotas/get-by-clienteId/${clienteId}`);
      const data = res.data?.data ?? res.data?.Data ?? res.data;
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const loadByEstado = async () => {
    if (!estado) return;
    setLoading(true);
    try {
      const res = await http.get(`/api/v1/cuotas/get-by-estado/${estado}`);
      const data = res.data?.data ?? res.data?.Data ?? res.data;
      setItems(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const generar = async () => {
    const anio = Number(gen.anio);
    const mes = Number(gen.mes);
    const monto = Number(gen.monto);

    if (!anio || anio < 2000) return alert("Año inválido");
    if (!mes || mes < 1 || mes > 12) return alert("Mes inválido (1 a 12)");
    if (!monto || monto <= 0) return alert("Monto inválido");

    if (!confirm(`¿Generar cuotas para ${mes}/${anio} por $${monto}?`)) return;

    setLoading(true);
    try {
      await http.post("/api/v1/cuotas/generar", { anio, mes, monto });
      alert("Cuotas generadas correctamente.");
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.message ?? "Error al generar");
    } finally {
      setLoading(false);
    }
  };

  const crearCuotaPuntual = async () => {
    const clienteIdNum = Number(single.clienteId);
    const anio = Number(single.anio);
    const mes = Number(single.mes);
    const monto = Number(single.monto);

    if (!clienteIdNum || clienteIdNum <= 0) return alert("ClienteId inválido");
    if (!anio || anio < 2000) return alert("Año inválido");
    if (!mes || mes < 1 || mes > 12) return alert("Mes inválido (1 a 12)");
    if (!monto || monto <= 0) return alert("Monto inválido");

    if (!confirm(`¿Crear cuota para cliente ${clienteIdNum} (${mes}/${anio}) por $${monto}?`)) return;

    setLoading(true);
    try {
      await http.post(`/api/v1/cuotas/clientes/${clienteIdNum}/cuotas`, { anio, mes, monto });
      alert("Cuota creada correctamente.");

      // Si justo estás mirando ese cliente, refrescamos automáticamente
      if (clienteId && Number(clienteId) === clienteIdNum) {
        await loadByCliente();
      }
    } catch (e: any) {
      alert(e?.response?.data?.message ?? e?.message ?? "Error al crear cuota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel__head">
        <div>
          <div className="panel__title">Cuotas</div>
          <div className="panel__sub">Ver por cliente / estado, generar masivo y crear puntual.</div>
        </div>
      </div>

      {/* Generación masiva */}
      <div className="genBox">
        <div className="genBox__title">Generar cuotas (masivo)</div>
        <div className="genBox__row">
          <div className="fieldMini">
            <div className="labelMini">Año</div>
            <input
              className="inputMini"
              value={gen.anio}
              onChange={(e) => setGenField("anio", e.target.value)}
              inputMode="numeric"
              placeholder="2026"
            />
          </div>

          <div className="fieldMini">
            <div className="labelMini">Mes</div>
            <input
              className="inputMini"
              value={gen.mes}
              onChange={(e) => setGenField("mes", e.target.value)}
              inputMode="numeric"
              placeholder="1-12"
            />
          </div>

          <div className="fieldMini">
            <div className="labelMini">Monto</div>
            <input
              className="inputMini"
              value={gen.monto}
              onChange={(e) => setGenField("monto", e.target.value)}
              inputMode="decimal"
              placeholder="35000"
            />
          </div>

          <button className="btnPrimary" onClick={generar} disabled={loading}>
            {loading ? "Generando..." : "Generar"}
          </button>
        </div>

        <div className="genBox__hint">
          Genera cuotas masivas para todos los clientes para el período indicado.
        </div>
      </div>

      {/* Cuota puntual */}
      <div className="genBox">
        <div className="genBox__title">Crear cuota puntual</div>

        <div className="genBox__row genBox__row--single">
          <div className="fieldMini">
            <div className="labelMini">ClienteId</div>
            <input
              className="inputMini"
              value={single.clienteId}
              onChange={(e) => setSingleField("clienteId", e.target.value)}
              inputMode="numeric"
              placeholder="123"
            />
          </div>

          <div className="fieldMini">
            <div className="labelMini">Año</div>
            <input
              className="inputMini"
              value={single.anio}
              onChange={(e) => setSingleField("anio", e.target.value)}
              inputMode="numeric"
              placeholder="2026"
            />
          </div>

          <div className="fieldMini">
            <div className="labelMini">Mes</div>
            <input
              className="inputMini"
              value={single.mes}
              onChange={(e) => setSingleField("mes", e.target.value)}
              inputMode="numeric"
              placeholder="1-12"
            />
          </div>

          <div className="fieldMini">
            <div className="labelMini">Monto</div>
            <input
              className="inputMini"
              value={single.monto}
              onChange={(e) => setSingleField("monto", e.target.value)}
              inputMode="decimal"
              placeholder="35000"
            />
          </div>

          <button className="btnPrimary" onClick={crearCuotaPuntual} disabled={loading}>
            {loading ? "Creando..." : "Crear"}
          </button>
        </div>

        <div className="genBox__hint">
          Crea una cuota individual para un cliente específico.
        </div>
      </div>

      {/* Filtros / búsquedas */}
      <div className="toolbar">
        <input
          className="inputMini"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          placeholder="ClienteId..."
        />
        <button className="btnMini" onClick={loadByCliente} disabled={loading || !clienteId}>
          Buscar por cliente
        </button>

        <select className="selectMini" value={estado} onChange={(e) => setEstado(e.target.value as any)}>
          <option value="">Estado...</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Pagado">Pagado</option>
        </select>

        <button className="btnMini" onClick={loadByEstado} disabled={loading || !estado}>
          Buscar por estado
        </button>

        <span className="chip">{items.length} cuotas</span>
      </div>

      <div className="tableWrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Período</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c.id} className="row">
                <td>{c.id}</td>
                <td>{c.clienteId}</td>
                <td>
                  {c.mes}/{c.anio}
                </td>
                <td>{c.monto}</td>
                <td>
                  <span className={c.estado === "Pagado" ? "badge ok" : "badge warn"}>
                    {c.estado}
                  </span>
                </td>
              </tr>
            ))}

            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5} className="empty">
                  Sin datos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="fieldMini">
      <div className="labelMini">{label}</div>
      <input className="inputMini" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

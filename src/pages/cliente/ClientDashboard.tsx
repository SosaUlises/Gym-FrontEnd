import { useEffect, useMemo, useState } from "react";
import ClientLayout from "./ClientLayout";
import { http } from "../../api/http";
import "../../styles/client.css";

type ClienteMe = {
  id: number;            // clienteId
  usuarioId?: number;
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

type Rutina = {
  id?: number;
  nombre: string;
  descripcion: string;
  fechaCreacion?: string;
  clienteId?: number;
};

type Progreso = {
  id?: number;
  fechaRegistro?: string;
  pesoActual?: number;
  pecho?: number;
  brazos?: number;
  cintura?: number;
  piernas?: number;
  observaciones?: string;
};

type Cuota = {
  id?: number;
  clienteId?: number;
  monto?: number;
  anio?: number;
  mes?: number;
  estado?: string;
};

export default function ClientDashboard() {
  const [me, setMe] = useState<ClienteMe | null>(null);
  const [rutinas, setRutinas] = useState<Rutina[]>([]);
  const [progresos, setProgresos] = useState<Progreso[]>([]);
  const [cuotas, setCuotas] = useState<Cuota[]>([]);
  const [loading, setLoading] = useState(true);

  const normalize = (x: any) => x?.data ?? x?.Data ?? x;

  const normalizeMe = (x: any): ClienteMe => ({
    id: Number(x?.id ?? x?.Id ?? x?.clienteId ?? x?.ClienteId ?? 0),
    usuarioId: x?.usuarioId ?? x?.UsuarioId ?? null,
    nombre: x?.nombre ?? x?.Nombre ?? "",
    apellido: x?.apellido ?? x?.Apellido ?? "",
    dni: Number(x?.dni ?? x?.Dni ?? 0),
    email: x?.email ?? x?.Email ?? "",
    edad: Number(x?.edad ?? x?.Edad ?? 0),
    altura: Number(x?.altura ?? x?.Altura ?? 0),
    peso: Number(x?.peso ?? x?.Peso ?? 0),
    objetivo: x?.objetivo ?? x?.Objetivo ?? null,
    fechaRegistro: x?.fechaRegistro ?? x?.FechaRegistro ?? null,
  });

  const normalizeRutina = (x: any): Rutina => ({
    id: x?.id ?? x?.Id ?? undefined,
    nombre: x?.nombre ?? x?.Nombre ?? "",
    descripcion: x?.descripcion ?? x?.Descripcion ?? "",
    fechaCreacion: x?.fechaCreacion ?? x?.FechaCreacion ?? undefined,
    clienteId: x?.clienteId ?? x?.ClienteId ?? undefined,
  });

  const normalizeProgreso = (x: any): Progreso => ({
    id: x?.id ?? x?.Id ?? undefined,
    fechaRegistro: x?.fechaRegistro ?? x?.FechaRegistro ?? undefined,
    pesoActual: x?.pesoActual ?? x?.PesoActual ?? undefined,
    pecho: x?.pecho ?? x?.Pecho ?? undefined,
    brazos: x?.brazos ?? x?.Brazos ?? undefined,
    cintura: x?.cintura ?? x?.Cintura ?? undefined,
    piernas: x?.piernas ?? x?.Piernas ?? undefined,
    observaciones: x?.observaciones ?? x?.Observaciones ?? undefined,
  });

  const normalizeCuota = (x: any): Cuota => ({
    id: x?.id ?? x?.Id ?? undefined,
    clienteId: x?.clienteId ?? x?.ClienteId ?? undefined,
    monto: x?.monto ?? x?.Monto ?? undefined,
    anio: x?.anio ?? x?.Anio ?? undefined,
    mes: x?.mes ?? x?.Mes ?? undefined,
    estado: x?.estado ?? x?.Estado ?? undefined,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const meRes = await http.get("/api/v1/cliente/me");
        const meData = normalize(meRes.data);
        const meNorm = normalizeMe(meData);
        setMe(meNorm);

        // Rutina(s)
        const rutRes = await http.get("/api/v1/rutina/me");
        const rutData = normalize(rutRes.data);
        const rutList = Array.isArray(rutData) ? rutData : rutData?.items ?? rutData?.Items ?? [];
        setRutinas((rutList ?? []).map(normalizeRutina));

        // Progresos
        const progRes = await http.get("/api/v1/progresos/me");
        const progData = normalize(progRes.data);
        const progList = Array.isArray(progData) ? progData : progData?.items ?? progData?.Items ?? [];
        setProgresos((progList ?? []).map(normalizeProgreso));

        // Cuotas (por clienteId)
        if (meNorm.id) {
          const cuoRes = await http.get(`/api/v1/cuotas/get-by-clienteId/${meNorm.id}`);
          const cuoData = normalize(cuoRes.data);
          const cuoList = Array.isArray(cuoData) ? cuoData : cuoData?.items ?? cuoData?.Items ?? [];
          setCuotas((cuoList ?? []).map(normalizeCuota));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const lastProgreso = useMemo(() => {
    if (!progresos.length) return null;
    const sorted = [...progresos].sort((a, b) => {
      const da = a.fechaRegistro ? new Date(a.fechaRegistro).getTime() : 0;
      const db = b.fechaRegistro ? new Date(b.fechaRegistro).getTime() : 0;
      return db - da;
    });
    return sorted[0];
  }, [progresos]);

  const cuotaDelMes = useMemo(() => {
    if (!cuotas.length) return null;
    const now = new Date();
    const m = now.getMonth() + 1;
    const y = now.getFullYear();
    return cuotas.find((c) => c.mes === m && c.anio === y) ?? null;
  }, [cuotas]);

  const rutinaPrincipal = rutinas[0] ?? null;

  return (
    <ClientLayout title="Inicio">
      <div className="cGrid">
        <div className="cCard">
          <div className="cCard__head">
            <div>
              <div className="cCard__title">Rutina</div>
              <div className="cCard__sub">Tu rutina asignada (solo lectura)</div>
            </div>
            <span className="cChip">{rutinas.length} rutina(s)</span>
          </div>

          {loading ? (
            <div className="cEmpty">Cargando...</div>
          ) : !rutinaPrincipal ? (
            <div className="cEmpty">Todavía no tenés una rutina asignada.</div>
          ) : (
            <div className="cCard__body">
              <div className="cStrong">{rutinaPrincipal.nombre}</div>
              <div className="cMuted clamp2">{rutinaPrincipal.descripcion}</div>
              <div className="cRow">
                <a className="cBtnPrimary" href="/cliente/rutina">Ver rutina</a>
              </div>
            </div>
          )}
        </div>

        <div className="cCard">
          <div className="cCard__head">
            <div>
              <div className="cCard__title">Progreso</div>
              <div className="cCard__sub">Último registro</div>
            </div>
            <span className="cChip">{progresos.length} registro(s)</span>
          </div>

          {loading ? (
            <div className="cEmpty">Cargando...</div>
          ) : !lastProgreso ? (
            <div className="cEmpty">No hay progresos cargados.</div>
          ) : (
            <div className="cCard__body">
              <div className="cRow cRow--between">
                <div className="cStrong">Peso</div>
                <div className="cStrong">{lastProgreso.pesoActual ?? "-"} kg</div>
              </div>
              <div className="cMuted">Fecha: {lastProgreso.fechaRegistro ? new Date(lastProgreso.fechaRegistro).toLocaleDateString() : "-"}</div>
              <div className="cRow">
                <a className="cBtnMini" href="/cliente/progreso">Ver historial</a>
                <a className="cBtnPrimary" href="/cliente/progreso">Cargar progreso</a>
              </div>
            </div>
          )}
        </div>

        <div className="cCard">
          <div className="cCard__head">
            <div>
              <div className="cCard__title">Cuotas</div>
              <div className="cCard__sub">Estado del mes</div>
            </div>
            <span className="cChip">{cuotas.length} cuota(s)</span>
          </div>

          {loading ? (
            <div className="cEmpty">Cargando...</div>
          ) : !me ? (
            <div className="cEmpty">No se pudo cargar tu perfil.</div>
          ) : !cuotaDelMes ? (
            <div className="cEmpty">No hay cuota registrada para este mes.</div>
          ) : (
            <div className="cCard__body">
              <div className="cRow cRow--between">
                <div className="cStrong">
                  {cuotaDelMes.mes}/{cuotaDelMes.anio}
                </div>
                <span className={cuotaDelMes.estado === "Pagado" ? "cBadge ok" : "cBadge warn"}>
                  {cuotaDelMes.estado ?? "Pendiente"}
                </span>
              </div>
              <div className="cMuted">Monto: ${cuotaDelMes.monto ?? "-"}</div>
              <div className="cRow">
                <a className="cBtnPrimary" href="/cliente/cuotas">Ver cuotas</a>
              </div>
            </div>
          )}
        </div>

        <div className="cCard">
          <div className="cCard__head">
            <div>
              <div className="cCard__title">Perfil</div>
              <div className="cCard__sub">Tus datos</div>
            </div>
          </div>

          {loading ? (
            <div className="cEmpty">Cargando...</div>
          ) : !me ? (
            <div className="cEmpty">No se pudo cargar tu perfil.</div>
          ) : (
            <div className="cCard__body">
              <div className="cStrong">{me.apellido}, {me.nombre}</div>
              <div className="cMuted">{me.email}</div>
              <div className="cRow">
                <a className="cBtnMini" href="/cliente/perfil">Ver / editar</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}

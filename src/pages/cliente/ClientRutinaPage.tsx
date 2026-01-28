import { useEffect, useMemo, useState } from "react";
import ClientLayout from "./ClientLayout";
import { http } from "../../api/http";
import "../../styles/client.css";

type Rutina = {
  id?: number;
  nombre: string;
  descripcion: string;
};

type DiaRutina = {
  id?: number;
  nombre?: string;
  orden?: number;
};

type Ejercicio = {
  id?: number;
  nombre?: string;
  series?: number;
  repeticiones?: number;
  descansoSegundos?: number;
  observaciones?: string;
};

export default function ClientRutinaPage() {
  const [rutina, setRutina] = useState<Rutina | null>(null);
  const [dias, setDias] = useState<DiaRutina[]>([]);
  const [diaSel, setDiaSel] = useState<DiaRutina | null>(null);
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingEj, setLoadingEj] = useState(false);

  const normalize = (x: any) => x?.data ?? x?.Data ?? x;

  const normalizeRutina = (x: any): Rutina => ({
    id: x?.id ?? x?.Id ?? undefined,
    nombre: x?.nombre ?? x?.Nombre ?? "",
    descripcion: x?.descripcion ?? x?.Descripcion ?? "",
  });

  const normalizeDia = (x: any): DiaRutina => ({
    id: x?.id ?? x?.Id ?? undefined,
    nombre: x?.nombre ?? x?.Nombre ?? undefined,
    orden: x?.orden ?? x?.Orden ?? undefined,
  });

  const normalizeEj = (x: any): Ejercicio => ({
    id: x?.id ?? x?.Id ?? undefined,
    nombre: x?.nombre ?? x?.Nombre ?? undefined,
    series: x?.series ?? x?.Series ?? undefined,
    repeticiones: x?.repeticiones ?? x?.Repeticiones ?? x?.reps ?? x?.Reps ?? undefined,
    descansoSegundos: x?.descansoSegundos ?? x?.DescansoSegundos ?? x?.descanso ?? x?.Descanso ?? undefined,
    observaciones: x?.observaciones ?? x?.Observaciones ?? undefined,
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const rutRes = await http.get("/api/v1/rutina/me");
        const rutData = normalize(rutRes.data);
        const rutList = Array.isArray(rutData) ? rutData : rutData?.items ?? rutData?.Items ?? [];
        const first = (rutList?.[0] ? normalizeRutina(rutList[0]) : null);
        setRutina(first);

        if (first?.id) {
          const diasRes = await http.get(`/api/v1/dias-rutina/rutinas/${first.id}`);
          const diasData = normalize(diasRes.data);
          const diasList = Array.isArray(diasData) ? diasData : diasData?.items ?? diasData?.Items ?? [];
          const norm = (diasList ?? []).map(normalizeDia);
          // Orden si existe
          norm.sort((a: { orden?: number | null }, b: { orden?: number | null }) => (a.orden ?? 0) - (b.orden ?? 0));
          setDias(norm);
          setDiaSel(norm[0] ?? null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!diaSel?.id) {
        setEjercicios([]);
        return;
      }
      setLoadingEj(true);
      try {
        const ejRes = await http.get(`/api/v1/ejercicios/dias-rutina/${diaSel.id}`);
        const ejData = normalize(ejRes.data);
        const ejList = Array.isArray(ejData) ? ejData : ejData?.items ?? ejData?.Items ?? [];
        setEjercicios((ejList ?? []).map(normalizeEj));
      } finally {
        setLoadingEj(false);
      }
    })();
  }, [diaSel?.id]);

  const diaLabel = useMemo(() => {
    if (!diaSel) return "Día";
    return diaSel.nombre || (diaSel.orden ? `Día ${diaSel.orden}` : "Día");
  }, [diaSel]);

  return (
    <ClientLayout title="Rutina">
      <div className="cSplit">
        <section className="cPanel">
          <div className="cPanel__head">
            <div>
              <div className="cPanel__title">Rutina asignada</div>
              <div className="cPanel__sub">Solo lectura</div>
            </div>
          </div>

          {loading ? (
            <div className="cEmpty">Cargando...</div>
          ) : !rutina ? (
            <div className="cEmpty">No tenés una rutina asignada.</div>
          ) : (
            <div className="cPanel__body">
              <div className="cStrong">{rutina.nombre}</div>
              <div className="cMuted clamp3">{rutina.descripcion}</div>

              <div className="cDivider" />

              <div className="cPanel__title">Días</div>
              <div className="cDays">
                {dias.map((d) => {
                  const label = d.nombre || (d.orden ? `Día ${d.orden}` : `Día`);
                  const active = d.id === diaSel?.id;
                  return (
                    <button
                      key={String(d.id ?? label)}
                      className={active ? "cDay active" : "cDay"}
                      onClick={() => setDiaSel(d)}
                    >
                      {label}
                    </button>
                  );
                })}
                {!dias.length && <div className="cEmpty">No hay días cargados.</div>}
              </div>
            </div>
          )}
        </section>

        <section className="cPanel">
          <div className="cPanel__head">
            <div>
              <div className="cPanel__title">{diaLabel}</div>
              <div className="cPanel__sub">Ejercicios del día</div>
            </div>
            <span className="cChip">{ejercicios.length} ejercicio(s)</span>
          </div>

          {!rutina ? (
            <div className="cEmpty">Asigná una rutina para ver ejercicios.</div>
          ) : loadingEj ? (
            <div className="cEmpty">Cargando ejercicios...</div>
          ) : !ejercicios.length ? (
            <div className="cEmpty">No hay ejercicios para este día.</div>
          ) : (
            <div className="cList">
              {ejercicios.map((e) => (
                <div key={String(e.id ?? e.nombre)} className="cItem">
                  <div className="cItem__top">
                    <div className="cStrong">{e.nombre ?? "Ejercicio"}</div>
                    <div className="cTags">
                      {typeof e.series === "number" && <span className="cTag">{e.series} series</span>}
                      {typeof e.repeticiones === "number" && <span className="cTag">{e.repeticiones} reps</span>}
                      {typeof e.descansoSegundos === "number" && <span className="cTag">{e.descansoSegundos}s descanso</span>}
                    </div>
                  </div>
                  {e.observaciones && <div className="cMuted">{e.observaciones}</div>}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </ClientLayout>
  );
}

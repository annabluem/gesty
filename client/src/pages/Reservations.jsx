import { useEffect, useMemo, useState } from 'react';
import { Check, X, Ban, DoorOpen, MessageCircle } from 'lucide-react';
import AppShell from '../components/AppShell.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { salaQuimicaImg, salaChromaImg } from '../assets/images';

function formatFecha(fechaISO) {
  const [anio, mes, dia] = (fechaISO ?? '').split('-');
  return anio && mes && dia ? `${dia}/${mes}/${anio}` : fechaISO;
}

const HORA_MIN = '07:00';
const HORA_MAX = '19:00';

function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function validarFormulario(form) {
  if (!form.id_sala) return 'Selecciona un salón.';
  if (!form.motivo.trim()) return 'Ingresa el motivo de la reserva.';
  if (!form.dia || !form.mes || !form.anio) return 'Completa la fecha (día, mes y año).';

  const dia = Number(form.dia);
  const mes = Number(form.mes);
  const anio = Number(form.anio);
  const fechaObj = new Date(anio, mes - 1, dia);
  const fechaValida =
    fechaObj.getFullYear() === anio && fechaObj.getMonth() === mes - 1 && fechaObj.getDate() === dia;
  if (!fechaValida) return 'La fecha ingresada no es válida.';

  const fecha = `${String(anio).padStart(4, '0')}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  if (fecha < hoyISO()) return 'La fecha de la reserva no puede ser anterior a hoy.';

  if (!form.horaInicio || !form.horaFin) return 'Completa la hora de inicio y de fin.';
  if (form.horaFin <= form.horaInicio) return 'La hora de fin debe ser posterior a la hora de inicio.';
  if (form.horaInicio < HORA_MIN || form.horaFin > HORA_MAX) {
    return `Las reservas solo se pueden hacer entre las ${HORA_MIN} y las ${HORA_MAX}.`;
  }

  return null;
}

function salaImagen(salaNombre) {
  if (!salaNombre) return null;
  if (salaNombre.includes('Química')) return salaQuimicaImg;
  if (salaNombre.includes('Chroma')) return salaChromaImg;
  return null;
}

export default function Reservations() {
  const [role, setRole] = useState('Docente');
  const [perfiles, setPerfiles] = useState({});
  const profile = perfiles[role];

  const [salas, setSalas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    bloque: '',
    id_sala: '',
    motivo: '',
    dia: '',
    mes: '',
    anio: '',
    horaInicio: '',
    horaFin: '',
  });

  useEffect(() => {
    fetch('/api/perfiles-demo')
      .then((r) => r.json())
      .then(setPerfiles)
      .catch(() => setError('No se pudo conectar con la API. ¿Esta corriendo el servidor?'));

    fetch('/api/salas')
      .then((r) => r.json())
      .then((data) => {
        setSalas(data);
        const firstBloque = data[0]?.bloque ?? '';
        const firstSala = data.find((s) => s.bloque === firstBloque);
        setForm((f) => ({ ...f, bloque: firstBloque, id_sala: firstSala?.id_sala ?? '' }));
      })
      .catch(() => setError('No se pudo conectar con la API. ¿Esta corriendo el servidor?'));
  }, []);

  const bloques = useMemo(() => [...new Set(salas.map((s) => s.bloque))], [salas]);
  const salonesDelBloque = useMemo(
    () => salas.filter((s) => s.bloque === form.bloque),
    [salas, form.bloque],
  );

  async function loadReservas() {
    if (!profile) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(
        role === 'Administrativo' ? { rol: 'Administrativo' } : { id_usuario: profile.id_usuario },
      );
      const res = await fetch(`/api/reservas?${params}`);
      const data = await res.json();
      setReservas(data);
      setError('');
    } catch {
      setError('No se pudo conectar con la API. ¿Esta corriendo el servidor?');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReservas();
  }, [role, profile]);

  function updateBloque(bloque) {
    const firstSala = salas.find((s) => s.bloque === bloque);
    setForm((f) => ({ ...f, bloque, id_sala: firstSala?.id_sala ?? '' }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const mensajeValidacion = validarFormulario(form);
    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    setSubmitting(true);

    const fecha = `${form.anio.padStart(4, '0')}-${form.mes.padStart(2, '0')}-${form.dia.padStart(2, '0')}`;

    try {
      const res = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_usuario: profile.id_usuario,
          id_sala: form.id_sala,
          motivo: form.motivo,
          fecha,
          hora_inicio: form.horaInicio,
          hora_fin: form.horaFin,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'No se pudo crear la solicitud.');
        return;
      }

      setForm((f) => ({ ...f, motivo: '', dia: '', mes: '', anio: '', horaInicio: '', horaFin: '' }));
      await loadReservas();
    } catch {
      setError('No se pudo conectar con la API. ¿Esta corriendo el servidor?');
    } finally {
      setSubmitting(false);
    }
  }

  async function updateEstado(id, estado) {
    try {
      await fetch(`/api/reservas/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado, id_usuario: profile.id_usuario }),
      });
      await loadReservas();
    } catch {
      setError('No se pudo actualizar la solicitud.');
    }
  }

  return (
    <AppShell sidebarVariant="collapsed">
      <div className="flex h-full gap-8">
        <div className="w-80 shrink-0">
          <div className="mb-5 flex items-center justify-between">
            <h1 className="font-display text-xl font-bold text-gesty-text">Reserva de Salas</h1>
          </div>

          <div className="mb-5 rounded-xl bg-slate-50 p-1 text-xs">
            <p className="mb-1 px-2 pt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
              Perfil simulado (USUARIO.rol)
            </p>
            <div className="flex gap-1">
              {['Docente', 'Administrativo'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 rounded-lg py-1.5 font-medium ${
                    role === r ? 'bg-gesty-orange text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            {profile && (
              <p className="px-2 pb-1 pt-1.5 text-[11px] text-slate-400">
                Sesion simulada: {profile.nombre} {profile.apellido}
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Selecciona un Bloque</span>
              <select
                value={form.bloque}
                onChange={(e) => updateBloque(e.target.value)}
                className="input-field bg-slate-50"
              >
                {bloques.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Selecciona un Salón</span>
              <select
                value={form.id_sala}
                onChange={(e) => setForm((f) => ({ ...f, id_sala: e.target.value }))}
                className="input-field bg-slate-50"
              >
                {salonesDelBloque.map((s) => (
                  <option key={s.id_sala} value={s.id_sala}>
                    {s.nombre} · {s.capacidad} personas
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1 block text-xs font-medium text-slate-500">Ingresa el Motivo</span>
              <textarea
                rows={3}
                value={form.motivo}
                onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
                className="input-field resize-none bg-slate-50"
              />
            </label>

            <div>
              <span className="mb-1 block text-xs font-medium text-slate-500">Fecha</span>
              <div className="flex gap-2">
                <input
                  placeholder="DD"
                  maxLength={2}
                  value={form.dia}
                  onChange={(e) => setForm((f) => ({ ...f, dia: e.target.value.replace(/\D/g, '') }))}
                  className="input-field bg-slate-50 text-center"
                />
                <input
                  placeholder="MM"
                  maxLength={2}
                  value={form.mes}
                  onChange={(e) => setForm((f) => ({ ...f, mes: e.target.value.replace(/\D/g, '') }))}
                  className="input-field bg-slate-50 text-center"
                />
                <input
                  placeholder="AAAA"
                  maxLength={4}
                  value={form.anio}
                  onChange={(e) => setForm((f) => ({ ...f, anio: e.target.value.replace(/\D/g, '') }))}
                  className="input-field bg-slate-50 text-center"
                />
              </div>
            </div>

            <div>
              <span className="mb-1 block text-xs font-medium text-slate-500">
                Hora <span className="text-slate-400">({HORA_MIN} a {HORA_MAX})</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">De</span>
                <input
                  type="time"
                  value={form.horaInicio}
                  onChange={(e) => setForm((f) => ({ ...f, horaInicio: e.target.value }))}
                  className="input-field bg-slate-50"
                />
                <span className="text-xs text-slate-400">a</span>
                <input
                  type="time"
                  value={form.horaFin}
                  onChange={(e) => setForm((f) => ({ ...f, horaFin: e.target.value }))}
                  className="input-field bg-slate-50"
                />
              </div>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={submitting || !profile}
              className="mt-2 w-full rounded-xl bg-gesty-orange py-2.5 text-sm font-semibold text-white hover:bg-gesty-orange-dark disabled:opacity-60"
            >
              {submitting ? 'Enviando...' : 'Enviar Solicitud'}
            </button>
          </form>
        </div>

        <div className="flex-1 overflow-y-auto">
          <h2 className="mb-4 font-display text-lg font-bold text-gesty-text">
            {role === 'Administrativo' ? 'Solicitudes de Reservas' : 'Estado de Reservas'}
          </h2>

          {loading && <p className="text-sm text-slate-400">Cargando...</p>}
          {!loading && reservas.length === 0 && (
            <p className="text-sm text-slate-400">Aun no hay solicitudes de reserva.</p>
          )}

          <ul className="flex flex-col gap-3">
            {reservas.map((r) => (
              <li key={r.id_reserva} className="flex items-stretch gap-2">
                <div className="flex flex-1 gap-3 rounded-xl border border-gesty-border p-3">
                  {salaImagen(r.sala_nombre) ? (
                    <img
                      src={salaImagen(r.sala_nombre)}
                      alt=""
                      className="h-20 w-20 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
                      <DoorOpen size={24} />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gesty-text">
                      {r.sala_nombre} <span className="font-normal text-slate-400">({r.sala_bloque})</span>
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-400">{r.motivo}</p>

                    <div className="mt-2 grid grid-cols-2 gap-x-6 text-[11px] text-slate-500">
                      <div>
                        <p className="font-semibold text-slate-400">Fecha:</p>
                        <p>{formatFecha(r.fecha)}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-400">Hora:</p>
                        <p>{r.hora_inicio} a {r.hora_fin}</p>
                      </div>
                    </div>

                    {role === 'Administrativo' && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gesty-orange-light text-[9px] font-bold text-gesty-orange">
                          {r.usuario_nombre?.[0]}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Solicitado por: <span className="font-medium text-gesty-text">{r.usuario_nombre}</span>{' '}
                          <span className="text-slate-400">· {r.usuario_rol}</span>
                        </p>
                      </div>
                    )}
                    {r.administrativo_nombre && (
                      <p className="mt-1 text-[11px] text-slate-400">Gestionó: {r.administrativo_nombre}</p>
                    )}

                    <div className="mt-2">
                      <StatusBadge status={r.estado} />
                    </div>
                  </div>
                </div>

                {role === 'Administrativo' && r.estado === 'Pendiente' && (
                  <div className="flex shrink-0 flex-col items-center justify-center gap-2 px-1">
                    <button
                      onClick={() => updateEstado(r.id_reserva, 'Aprobada')}
                      title="Aprobar solicitud"
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-emerald-500 text-emerald-500 transition-colors hover:bg-emerald-50"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => updateEstado(r.id_reserva, 'Rechazada')}
                      title="Rechazar solicitud"
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-red-500 text-red-500 transition-colors hover:bg-red-50"
                    >
                      <X size={16} />
                    </button>
                    <button
                      title="Enviar mensaje interno al solicitante (proximamente)"
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 text-slate-400 transition-colors hover:bg-slate-50"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                )}

                {role === 'Docente' && r.estado === 'Pendiente' && (
                  <div className="flex shrink-0 items-center justify-center px-1">
                    <button
                      onClick={() => updateEstado(r.id_reserva, 'Cancelada')}
                      title="Cancelar solicitud"
                      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-300 text-slate-400 transition-colors hover:bg-slate-50"
                    >
                      <Ban size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}

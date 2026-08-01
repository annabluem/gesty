const STATUS_STYLES = {
  Pendiente: { dot: 'bg-amber-500', text: 'text-amber-600' },
  Aprobada: { dot: 'bg-emerald-500', text: 'text-emerald-600' },
  Rechazada: { dot: 'bg-red-500', text: 'text-red-500' },
  Cancelada: { dot: 'bg-slate-400', text: 'text-slate-500' },
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.Pendiente;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${style.text}`}>
      <span className={`h-2 w-2 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

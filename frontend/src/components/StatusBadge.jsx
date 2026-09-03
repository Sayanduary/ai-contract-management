const StatusBadge = ({ status }) => {
  if (!status) return null;

  const normalized = String(status).toUpperCase();

  let colorClasses = "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
  let dotClasses = "bg-zinc-400";

  if (normalized === "ACTIVE" || normalized === "INDEXED") {
    colorClasses = "bg-emerald-500/15 text-emerald-400 dark:text-emerald-400 border-emerald-500/30";
    dotClasses = "bg-emerald-400 animate-pulse";
  } else if (normalized === "EXPIRING" || normalized === "PROCESSING" || normalized === "PENDING") {
    colorClasses = "bg-amber-500/15 text-amber-400 dark:text-amber-400 border-amber-500/30";
    dotClasses = "bg-amber-400";
  } else if (normalized === "EXPIRED" || normalized === "CANCELLED" || normalized === "URGENT") {
    colorClasses = "bg-rose-500/15 text-rose-400 dark:text-rose-400 border-rose-500/30";
    dotClasses = "bg-rose-400";
  } else if (normalized === "SENT") {
    colorClasses = "bg-blue-500/15 text-blue-400 dark:text-blue-400 border-blue-500/30";
    dotClasses = "bg-blue-400";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotClasses}`} />
      {normalized}
    </span>
  );
};

export default StatusBadge;

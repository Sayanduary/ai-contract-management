import { ShieldCheck, AlertTriangle, AlertCircle } from "lucide-react";

const RiskBadge = ({ level }) => {
  if (!level) return null;

  const normalized = String(level).toUpperCase();

  if (normalized === "LOW") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <ShieldCheck className="w-3.5 h-3.5" />
        LOW RISK
      </span>
    );
  }

  if (normalized === "MEDIUM") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-3.5 h-3.5" />
        MEDIUM RISK
      </span>
    );
  }

  if (normalized === "HIGH") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40">
        <AlertCircle className="w-3.5 h-3.5" />
        HIGH RISK
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
      {normalized}
    </span>
  );
};

export default RiskBadge;

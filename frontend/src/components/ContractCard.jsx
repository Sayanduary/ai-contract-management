import { Link } from "react-router-dom";
import { FileText, Calendar, Trash2, Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";
import RiskBadge from "./RiskBadge";

const ContractCard = ({ contract, onDelete }) => {
  const startDateFormatted = contract.startDate
    ? new Date(contract.startDate).toLocaleDateString()
    : "—";

  const expiryDateFormatted = contract.expiryDate
    ? new Date(contract.expiryDate).toLocaleDateString()
    : "—";

  return (
    <div className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs transition-all duration-200">
      {/* Left: Icon & Info */}
      <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <FileText className="w-5 h-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <Link
              to={`/contracts/${contract.id}`}
              className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate max-w-xs sm:max-w-md"
            >
              {contract.title}
            </Link>
            <StatusBadge status={contract.status} />
            {contract.analysis?.riskLevel && (
              <RiskBadge level={contract.analysis.riskLevel} />
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
            <span>Type: {contract.type || "Agreement"}</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
              <span>
                {startDateFormatted} to {expiryDateFormatted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
        <Link
          to={`/contracts/${contract.id}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </Link>

        <button
          type="button"
          onClick={() => onDelete(contract.id)}
          className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
          title="Delete contract"
          aria-label="Delete contract"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ContractCard;

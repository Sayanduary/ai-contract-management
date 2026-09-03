import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  Calendar,
  Clock,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  Inbox,
} from "lucide-react";
import { getReminders, deleteReminder } from "../api/remainder.api";
import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReminders = useCallback(async () => {
    try {
      const data = await getReminders();
      setReminders(data.reminders || []);
    } catch (err) {
      setError(err.message || "Failed to load reminders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this reminder?",
    );
    if (!confirmed) return;

    try {
      setError("");
      await deleteReminder(id);
      setReminders((prev) => prev.filter((reminder) => reminder.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete reminder");
    }
  };

  return (
    <Layout
      title="Contract Reminders"
      subtitle="Track important contract dates, renewals, and notice periods."
    >
      <div className="space-y-6">
        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Content list / Loading / Empty state */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading scheduled reminders...</p>
          </div>
        ) : reminders.length === 0 ? (
          <div className="py-16 text-center rounded-2xl bg-white dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center gap-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center text-zinc-400">
              <Inbox className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                No reminders scheduled
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
                Open any contract from your dashboard to schedule renewal alerts and expiry notifications.
              </p>
            </div>
            <Link
              to="/dashboard"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <span>Go to Contracts</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs transition-all"
              >
                {/* Left: Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                        {reminder.contract?.title || "Contract Agreement"}
                      </span>
                      <StatusBadge status={reminder.status} />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
                        <span>
                          Alert: {new Date(reminder.reminderDate).toLocaleString()}
                        </span>
                      </div>

                      {reminder.contract?.expiryDate && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                            <span>
                              Expiry:{" "}
                              {new Date(
                                reminder.contract.expiryDate,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {reminder.contract?.id && (
                    <Link
                      to={`/contracts/${reminder.contract.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Contract</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(reminder.id)}
                    className="p-1.5 rounded-xl text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Reminders;

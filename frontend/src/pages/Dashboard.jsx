import { useEffect, useState, useMemo, useCallback } from "react";
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Loader2,
  FolderOpen,
} from "lucide-react";
import {
  getContracts,
  uploadContract,
  deleteContract,
} from "../api/contract.api";
import Layout from "../components/Layout";
import DragDropUpload from "../components/DragDropUpload";
import ContractCard from "../components/ContractCard";

const Dashboard = () => {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // ==========================================
  // FETCH CONTRACTS
  // ==========================================
  const fetchContracts = useCallback(async () => {
    try {
      const data = await getContracts();
      setContracts(data.contracts || []);
    } catch (err) {
      setError(err.message || "Failed to load contracts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // ==========================================
  // UPLOAD CONTRACT
  // ==========================================
  const handleUpload = async (file) => {
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    try {
      setError("");
      setUploading(true);
      await uploadContract(file);
      await fetchContracts();
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // DELETE CONTRACT
  // ==========================================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contract?",
    );
    if (!confirmed) return;

    try {
      setError("");
      await deleteContract(id);
      setContracts((prev) => prev.filter((contract) => contract.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete contract");
    }
  };

  // ==========================================
  // REAL STATS CALCULATION
  // ==========================================
  const stats = useMemo(() => {
    const total = contracts.length;
    const active = contracts.filter(
      (c) => (c.status || "").toUpperCase() === "ACTIVE",
    ).length;
    const expiring = contracts.filter(
      (c) => (c.status || "").toUpperCase() === "EXPIRING",
    ).length;
    const expired = contracts.filter(
      (c) => (c.status || "").toUpperCase() === "EXPIRED",
    ).length;

    return { total, active, expiring, expired };
  }, [contracts]);

  // Filtered contracts
  const filteredContracts = useMemo(() => {
    return contracts.filter((c) => {
      const matchesSearch = (c.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ||
        (c.status || "").toUpperCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [contracts, searchQuery, statusFilter]);

  return (
    <Layout
      title="Contract Dashboard"
      subtitle="Manage, analyze and track your contracts."
    >
      <div className="space-y-8">
        {/* Top Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Total Contracts
              </span>
              <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {stats.total}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Active
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.active}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Expiring Soon
              </span>
              <Clock className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.expiring}
            </p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">
                Expired
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400">
              {stats.expired}
            </p>
          </div>
        </div>

        {/* Upload Contract Section */}
        <DragDropUpload
          onUpload={handleUpload}
          uploading={uploading}
          error={error}
        />

        {/* My Contracts Section */}
        <div className="space-y-4" id="contracts">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                My Contracts
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Review extracted terms, risk assessments, and RAG vectors
              </p>
            </div>

            {/* Search & Filter bar */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter contracts..."
                  className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="py-1.5 px-2.5 rounded-xl text-xs bg-white dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING">Expiring</option>
                <option value="EXPIRED">Expired</option>
              </select>
            </div>
          </div>

          {/* Contracts List / Loading / Empty State */}
          {loading ? (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading your contracts...</p>
            </div>
          ) : filteredContracts.length === 0 ? (
            <div className="py-14 text-center rounded-2xl bg-white dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800 flex flex-col items-center justify-center gap-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 flex items-center justify-center text-zinc-400">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {searchQuery || statusFilter !== "ALL"
                    ? "No matching contracts found"
                    : "No contracts uploaded yet"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                  {searchQuery || statusFilter !== "ALL"
                    ? "Try adjusting your search query or status filter."
                    : "Upload your first PDF agreement above to automatically parse clauses, detect risks, and chat with AI."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContracts.map((contract) => (
                <ContractCard
                  key={contract.id}
                  contract={contract}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;

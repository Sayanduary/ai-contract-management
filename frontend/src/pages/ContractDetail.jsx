import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  ShieldAlert,
  Clock,
  Trash2,
  Bell,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";

import {
  getContract,
  analyzeContract,
  askContract,
  deleteContract,
} from "../api/contract.api";
import { createReminder } from "../api/remainder.api";

import Layout from "../components/Layout";
import StatusBadge from "../components/StatusBadge";
import RiskBadge from "../components/RiskBadge";
import AIAssistant from "../components/AIAssistant";

const ContractDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  const [reminderDate, setReminderDate] = useState("");
  const [creatingReminder, setCreatingReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState("");

  // ==========================================
  // FETCH CONTRACT
  // ==========================================
  const fetchContract = useCallback(async () => {
    try {
      const data = await getContract(id);
      setContract(data.contract);
    } catch (err) {
      setError(err.message || "Failed to load contract");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchContract();
  }, [fetchContract]);

  // ==========================================
  // ANALYZE CONTRACT
  // ==========================================
  const handleAnalyze = async () => {
    try {
      setError("");
      setAnalyzing(true);
      await analyzeContract(id);
      await fetchContract();
    } catch (err) {
      setError(err.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  // ==========================================
  // DELETE CONTRACT
  // ==========================================
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this contract? This cannot be undone.",
    );
    if (!confirmed) return;

    try {
      await deleteContract(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to delete contract");
    }
  };

  // ==========================================
  // ASK QUESTION (RAG)
  // ==========================================
  const handleAskQuestion = async (userPrompt) => {
    try {
      setError("");
      setAsking(true);
      const data = await askContract(id, userPrompt);
      return data;
    } catch (err) {
      setError(err.message || "Failed to get AI answer");
      throw err;
    } finally {
      setAsking(false);
    }
  };

  // ==========================================
  // CREATE REMINDER
  // ==========================================
  const handleCreateReminder = async (e) => {
    e.preventDefault();
    if (!reminderDate) {
      setError("Please select a reminder date");
      return;
    }

    try {
      setError("");
      setReminderMessage("");
      setCreatingReminder(true);

      await createReminder(id, reminderDate);
      setReminderDate("");
      setReminderMessage("Reminder successfully scheduled!");
      setTimeout(() => setReminderMessage(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to set reminder");
    } finally {
      setCreatingReminder(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Layout title="Contract Details">
        <div className="py-24 text-center flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading contract workspace...</p>
        </div>
      </Layout>
    );
  }

  // Not Found State
  if (!contract) {
    return (
      <Layout title="Contract Not Found">
        <div className="py-16 text-center space-y-4">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{error || "Contract not found"}</p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </Layout>
    );
  }

  const analysis = contract.analysis;

  return (
    <Layout
      title="Contract Details"
      subtitle={`Workspace for ${contract.title}`}
    >
      <div className="space-y-6">
        {/* Top Navigation & Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-xs transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {contract.title}
                </h1>
                <StatusBadge status={contract.status} />
                {analysis?.riskLevel && <RiskBadge level={analysis.riskLevel} />}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Created on {new Date(contract.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-center">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {analyzing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{analysis ? "Re-analyze Contract" : "Analyze Contract"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="p-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-500/30 shadow-xs transition-colors cursor-pointer"
              title="Delete Contract"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main 2/3 Workspace + 1/3 AI Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left / Center Column: Workspace */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Contract Information Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
              <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>Contract Information</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Type</p>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mt-0.5">
                    {contract.type || "General Agreement"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Status</p>
                  <div className="mt-0.5">
                    <StatusBadge status={contract.status} />
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Start Date</p>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mt-0.5">
                    {contract.startDate
                      ? new Date(contract.startDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Expiry Date</p>
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mt-0.5">
                    {contract.expiryDate
                      ? new Date(contract.expiryDate).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Analysis Section */}
            {!analysis ? (
              <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    This contract has not been analyzed yet
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
                    Run AI analysis to extract clauses, calculate risks, and generate an executive summary.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyzing Document...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Analyze Contract Now</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Executive Summary */}
                <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                      <span>Executive Summary</span>
                    </h2>
                    {analysis.riskLevel && <RiskBadge level={analysis.riskLevel} />}
                  </div>

                  <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                    {analysis.summary || "No summary available."}
                  </p>
                </div>

                {/* Key Clauses */}
                <div className="space-y-3">
                  <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span>Extracted Clauses ({analysis.clauses?.length || 0})</span>
                  </h2>

                  {analysis.clauses && analysis.clauses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {analysis.clauses.map((clause, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 shadow-xs"
                        >
                          <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 mb-1.5 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {clause.name}
                          </h3>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {clause.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-850">
                      No distinct clauses identified.
                    </p>
                  )}
                </div>

                {/* Identified Risks */}
                <div className="space-y-3">
                  <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                    <span>Identified Risks ({analysis.risks?.length || 0})</span>
                  </h2>

                  {analysis.risks && analysis.risks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-3">
                      {analysis.risks.map((risk, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-500/5 border border-rose-200 dark:border-rose-500/20 shadow-xs"
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
                            <h3 className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                              {risk.title}
                            </h3>
                          </div>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pl-5">
                            {risk.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-200 dark:border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      <span>No significant risks identified in this agreement.</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Schedule Reminder Form */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 shadow-xs">
              <h2 className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span>Set Expiry / Review Reminder</span>
              </h2>

              <form onSubmit={handleCreateReminder} className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                  className="w-full sm:flex-1 px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-zinc-950/70 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={creatingReminder}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {creatingReminder ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  <span>Create Reminder</span>
                </button>
              </form>

              {reminderMessage && (
                <div className="mt-3 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{reminderMessage}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Assistant Panel (Desktop sticky, Mobile stacked) */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-20">
            <AIAssistant
              contractTitle={contract.title}
              onAsk={handleAskQuestion}
              asking={asking}
              error={error}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContractDetails;

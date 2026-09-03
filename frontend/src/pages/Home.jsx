import { Link } from "react-router-dom";
import {
  Sparkles,
  ShieldAlert,
  Bot,
  Bell,
  ArrowRight,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle";

const Home = () => {
  const features = [
    {
      icon: Sparkles,
      title: "AI Contract Analysis",
      description:
        "Extract critical terms, conditions, start/end dates, and generate structured executive summaries automatically.",
    },
    {
      icon: ShieldAlert,
      title: "Risk Detection",
      description:
        "Identify high-risk clauses, indemnities, liability traps, and non-standard terms with severity scores.",
    },
    {
      icon: Bot,
      title: "Contract RAG Q&A",
      description:
        "Ask targeted questions directly to your agreements with verified citations and pgvector retrieval.",
    },
    {
      icon: Bell,
      title: "Expiry Reminders",
      description:
        "Stay ahead of renewals, expirations, and notice periods with customizable contract date alerts.",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col transition-colors">
      {/* Navigation Bar */}
      <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-lg">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span>ContractAI</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="text-xs font-medium px-3.5 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 sm:py-24 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Contract Analysis & RAG Assistant</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6">
          Analyze contracts, identify risks, and ask questions using AI.
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mb-8 leading-relaxed">
          Transform static legal PDFs into searchable, actionable knowledge.
          Uncover hidden liabilities and query agreement clauses in plain English.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            to="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 transition-all"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 shadow-xs transition-all"
          >
            <span>Sign In to Workspace</span>
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-20 text-left w-full">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h2 className="text-base font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                  {feat.title}
                </h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-200 dark:border-zinc-800/80 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} ContractAI. Intelligent Contract Management.</p>
      </footer>
    </div>
  );
};

export default Home;

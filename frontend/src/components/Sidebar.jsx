import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Bell,
  LogOut,
  X,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Try to retrieve user from localStorage if saved
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch {
    // ignore
  }

  const userName = user?.name || "Contract Admin";
  const userEmail = user?.email || "admin@workspace.ai";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
      exact: true,
    },
    {
      name: "Contracts",
      path: "/dashboard#contracts",
      icon: FileText,
      matchPath: "/contracts",
    },
    {
      name: "Reminders",
      path: "/reminders",
      icon: Bell,
    },
  ];

  const isItemActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path && !location.hash;
    }
    if (item.matchPath && location.pathname.startsWith(item.matchPath)) {
      return true;
    }
    return location.pathname === item.path;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 flex flex-col justify-between transition-transform duration-300 ease-in-out border-r bg-white dark:bg-zinc-950/95 border-zinc-200 dark:border-zinc-800/80
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Header / Profile */}
        <div className="p-4 flex flex-col gap-6">
          {/* Brand & Mobile close */}
          <div className="flex items-center justify-between">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 font-bold tracking-tight text-lg text-zinc-900 dark:text-zinc-100"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="flex flex-col">
                <span className="leading-tight text-sm font-semibold">ContractAI</span>
                <span className="text-[10px] font-normal text-zinc-500 dark:text-zinc-400">Knowledge RAG</span>
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Pill (inspired by reference image) */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-200 truncate">
                  {userName}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 shrink-0 ml-1" />
          </div>

          {/* Main Navigation */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 px-3 py-1 uppercase">
              Workspace
            </span>

            {navItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => {
                    if (onClose) onClose();
                  }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                    active
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900/60"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-white" : "text-zinc-500 dark:text-zinc-400"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Categories / Tags */}
          <div className="flex flex-col gap-1.5 pt-2">
            <span className="text-[10px] font-semibold tracking-wider text-zinc-500 dark:text-zinc-400 px-3 py-1 uppercase">
              Status Filter
            </span>
            <div className="px-3 flex flex-col gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Expiring Soon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Expired</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions: Theme Toggle & Logout */}
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

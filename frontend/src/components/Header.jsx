import { Menu } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Header = ({ title, subtitle, onOpenSidebar }) => {
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch {
    // ignore
  }

  const userName = user?.name || "Contract Admin";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b backdrop-blur-md transition-colors bg-white/80 dark:bg-zinc-950/80 border-zinc-200 dark:border-zinc-800/80">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {title && (
            <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <ThemeToggle />

        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-zinc-200 dark:border-zinc-800">
          <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-semibold text-xs">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 hidden md:inline-block">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiBars3BottomRight, HiClock, HiUserCircle, HiXMark } from "react-icons/hi2";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar({ theme, toggleTheme }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHomePage = location.pathname === "/";

  const baseLinks = useMemo(
    () =>
      isHomePage
        ? [
            { label: "Why Choose Us", href: "#about", type: "anchor" },
            { label: "Categories", href: "#categories", type: "anchor" },
            { label: "Predict", href: "/predict", type: "route" },
          ]
        : [
            { label: "Home", href: "/", type: "route" },
            { label: "Predict", href: "/predict", type: "route" },
          ],
    [isHomePage]
  );

  const authLinks = isLoading
    ? []
    : isAuthenticated
    ? [{ label: "My History", href: "/history", type: "route" }]
    : [
        { label: "Login", href: "/login", type: "route" },
        { label: "Sign Up", href: "/signup", type: "route" },
      ];

  const navLinks = [...baseLinks, ...authLinks];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const avatarLetter = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div
        className={`section-shell rounded-full border transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-panel/75 shadow-glow backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-2 py-3">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-bright via-brand to-brand-moss text-lg font-extrabold text-white shadow-lg shadow-brand/20">
              E
            </div>
            <div>
              <p className="font-heading text-lg font-bold tracking-tight">EcoVision AI</p>
              <p className="text-xs uppercase tracking-[0.28em] text-muted">
                Smart Waste Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) =>
              link.type === "route" ? (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition hover:text-brand ${
                      isActive ? "text-brand" : "text-muted"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-semibold text-muted transition hover:text-brand"
                >
                  {link.label}
                </a>
              )
            )}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            {isLoading ? null : isAuthenticated ? (
              <>
                <Link
                  to="/history"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white/70 px-4 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/35 hover:text-brand dark:bg-slate-950/40"
                >
                  <HiClock />
                  My History
                </Link>
                <div className="inline-flex items-center gap-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                    {avatarLetter}
                  </span>
                  <span className="max-w-[8rem] truncate">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-moss"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full border border-line bg-white/70 px-5 py-2.5 text-sm font-semibold text-ink transition hover:border-brand/35 hover:text-brand dark:bg-slate-950/40"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand dark:bg-white dark:text-slate-950"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/80 text-xl lg:hidden"
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            aria-label="Toggle navigation"
          >
            {open ? <HiXMark /> : <HiBars3BottomRight />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="section-shell mt-3 rounded-3xl border border-white/10 bg-panel/90 p-5 shadow-glow backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.type === "route" ? (
                  <NavLink
                    key={link.href}
                    to={link.href}
                    className="text-sm font-semibold text-muted"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ) : (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-semibold text-muted"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                )
              )}

              {isLoading ? null : isAuthenticated ? (
                <div className="rounded-3xl border border-line bg-white/60 p-4 dark:bg-slate-950/35">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                      {avatarLetter}
                    </span>
                    <div>
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted">
                        Signed in
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white"
                  >
                    Logout
                  </button>
                </div>
              ) : null}

              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

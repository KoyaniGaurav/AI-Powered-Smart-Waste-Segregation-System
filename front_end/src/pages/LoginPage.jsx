import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/predict";

  if (isLoading) {
    return (
      <main className="pt-28">
        <div className="section-shell pt-20">
          <div className="glass-panel p-8 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
            <p className="mt-4 text-sm text-muted">Checking your session...</p>
          </div>
        </div>
      </main>
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await login({
        email: formData.email.trim(),
        password: formData.password,
      });
      setSuccessMessage(response.message || "Login successful.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail || "Unable to sign in right now. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-28">
      <section className="section-gap">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel overflow-hidden p-8 sm:p-10"
            >
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand">
                Welcome back to WasteIQ AI
              </p>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
                Log in to save and manage your waste predictions
              </h1>
              <p className="mt-4 text-base leading-8 text-muted">
                Access your WasteIQ AI prediction history, save new classifications,
                and keep your recycling analysis journey organized in one place.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-line bg-white/60 p-5 dark:bg-slate-950/35">
                  <p className="text-sm font-semibold">Private prediction history</p>
                  <p className="mt-2 text-sm text-muted">
                    View only the records that belong to your account.
                  </p>
                </div>
                <div className="rounded-3xl border border-line bg-white/60 p-5 dark:bg-slate-950/35">
                  <p className="text-sm font-semibold">Manual save control</p>
                  <p className="mt-2 text-sm text-muted">
                    Choose which predictions are worth keeping for later.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="glass-panel p-8 sm:p-10"
            >
              <h2 className="font-heading text-3xl font-bold">Login</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Enter your account details to continue.
              </p>

              <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Email</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-brand dark:bg-slate-950/40"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Password</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-brand dark:bg-slate-950/40"
                    placeholder="Enter your password"
                  />
                </label>

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
                    {errorMessage}
                  </div>
                ) : null}

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-200">
                    {successMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand to-brand-moss px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </button>
              </form>

              <p className="mt-6 text-sm text-muted">
                New here?{" "}
                <Link to="/signup" className="font-semibold text-brand hover:underline">
                  Create your account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

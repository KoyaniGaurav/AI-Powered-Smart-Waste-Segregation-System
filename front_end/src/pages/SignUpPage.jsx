import { useState } from "react";
import { motion } from "framer-motion";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await signup({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      setSuccessMessage(response.message || "Account created successfully.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.detail || "Unable to create your account right now."
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
                Create account
              </p>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight">
                Build your personal waste intelligence dashboard
              </h1>
              <p className="mt-4 text-base leading-8 text-muted">
                Save the predictions that matter, revisit them anytime, and keep a
                cleaner, more organized sustainability workflow under your account.
              </p>

              <div className="mt-8 grid gap-4">
                {[
                  "Secure sign-in stored in your local session",
                  "Manual control over which predictions get saved",
                  "Personal history cards with images, confidence, and dates",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-line bg-white/60 px-5 py-4 text-sm text-muted dark:bg-slate-950/35"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="glass-panel p-8 sm:p-10"
            >
              <h2 className="font-heading text-3xl font-bold">Sign Up</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Create a lightweight account to save your prediction history.
              </p>

              <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">Full Name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-brand dark:bg-slate-950/40"
                    placeholder="Enter your full name"
                  />
                </label>

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

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-sm font-semibold">Password</span>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-brand dark:bg-slate-950/40"
                      placeholder="Minimum 6 characters"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-semibold">Confirm Password</span>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="rounded-2xl border border-line bg-white/70 px-4 py-3 outline-none transition focus:border-brand dark:bg-slate-950/40"
                      placeholder="Repeat your password"
                    />
                  </label>
                </div>

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
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-6 text-sm text-muted">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-brand hover:underline">
                  Login here
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}

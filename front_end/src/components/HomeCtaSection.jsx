import { motion } from "framer-motion";
import { HiArrowRight, HiShieldCheck } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function HomeCtaSection() {
  return (
    <section className="section-gap pt-8">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          className="relative overflow-hidden rounded-[2.25rem] border border-white/15 bg-slate-950 px-6 py-12 text-white shadow-[0_30px_90px_rgba(15,23,42,0.2)] sm:px-10 lg:px-14"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.22),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(101,163,13,0.18),transparent_28%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-teal-100">
                <HiShieldCheck />
                Ready for live prediction
              </span>
              <h2 className="mt-5 max-w-3xl font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to sort waste with more confidence and less guesswork?
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">
                Open the prediction workspace to identify waste, choose the right bin,
                and review practical recycling and disposal instructions in one flow.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link
                to="/predict"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-brand-soft"
              >
                Open Prediction Page
                <HiArrowRight />
              </Link>
              <a
                href="#about"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Review Benefits
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

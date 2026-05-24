import { motion } from "framer-motion";
import {
  HiArrowRight,
  HiArrowTrendingUp,
  HiChartBarSquare,
  HiGlobeAlt,
  HiShieldCheck,
  HiSparkles,
} from "react-icons/hi2";
import { Link } from "react-router-dom";

const heroMetrics = [
  { label: "Waste categories covered", value: "34+" },
  { label: "Guided disposal paths", value: "4 bin colors" },
  { label: "Response experience", value: "Instant" },
];

const activityFeed = [
  {
    title: "Waste identified",
    value: "Glass bottle",
    meta: "Routed into the recyclable stream",
    icon: HiSparkles,
  },
  {
    title: "Risk screening",
    value: "No hazard",
    meta: "Safe handling guidance returned",
    icon: HiShieldCheck,
  },
  {
    title: "Positive impact",
    value: "Lower landfill load",
    meta: "Recycling and reuse pathway suggested",
    icon: HiChartBarSquare,
  },
];

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pt-40 sm:pt-44">
      <div className="hero-orb left-[-6rem] top-16 h-56 w-56 bg-brand-bright/20" />
      <div className="hero-orb right-[-4rem] top-12 h-64 w-64 bg-brand-moss/20" />
      <div className="hero-orb left-1/3 top-1/2 h-40 w-40 bg-sky-400/10" />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[9%] top-36 hidden rounded-full border border-white/20 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-brand shadow-lg backdrop-blur dark:bg-slate-950/40 xl:block"
      >
        Eco-aware automation
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[8%] top-56 hidden rounded-full border border-white/20 bg-white/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.28em] text-brand shadow-lg backdrop-blur dark:bg-slate-950/40 xl:block"
      >
        Smarter bin routing
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.08, 1], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[14%] top-[52%] hidden xl:block"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-2xl text-emerald-600 backdrop-blur dark:text-emerald-300">
          <HiGlobeAlt />
        </div>
      </motion.div>

      <div className="section-shell relative pb-10 pt-8 sm:pb-16 sm:pt-10">
        <div className="glass-panel relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.15),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(101,163,13,0.18),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.35),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(101,163,13,0.16),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0))]" />

          <div className="relative grid gap-12 px-6 py-12 sm:px-8 sm:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-14 lg:py-16">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="inline-flex items-center gap-3 rounded-full border border-brand/15 bg-white/75 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-brand dark:bg-slate-950/45"
              >
                <HiGlobeAlt className="text-base" />
                WasteIQ AI
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.08 }}
                className="mt-6 max-w-4xl font-heading text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[4.35rem]"
              >
                AI Powered Smart Waste Segregation & Recycling Analysis Platform
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.16 }}
                className="mt-6 max-w-2xl text-lg leading-8 text-muted sm:text-xl"
              >
                Upload a photo, identify the waste type, and get the right bin,
                safer handling steps, and practical recycling guidance in seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.24 }}
                className="mt-9 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  to="/predict"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-1 hover:bg-brand dark:bg-white dark:text-slate-950"
                >
                  Start Waste Analysis
                  <HiArrowRight />
                </Link>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-line bg-white/70 px-6 py-3.5 text-sm font-semibold text-ink transition hover:-translate-y-1 hover:border-brand/35 hover:text-brand dark:bg-slate-950/45"
                >
                  Why Choose Us
                  <HiArrowTrendingUp />
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.32 }}
                className="mt-10 grid gap-4 sm:grid-cols-3"
              >
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-3xl border border-white/15 bg-white/65 p-5 backdrop-blur dark:bg-slate-950/35"
                  >
                    <p className="font-heading text-2xl font-bold">{metric.value}</p>
                    <p className="mt-2 text-sm text-muted">{metric.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.18 }}
              className="relative"
            >
              <div className="relative rounded-[2rem] border border-white/15 bg-slate-950 p-4 text-white shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
                <div className="rounded-[1.7rem] bg-gradient-to-br from-slate-950 via-teal-900 to-lime-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.32em] text-teal-100/75">
                        Live waste insight
                      </p>
                      <h3 className="mt-3 font-heading text-2xl font-bold">
                        Simple results people can act on
                      </h3>
                    </div>
                    <div className="h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_24px_rgba(74,222,128,0.9)]" />
                  </div>

                  <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                    <div className="flex items-center justify-between text-sm text-teal-50/80">
                      <span>Recent scan</span>
                      <span>96.52% confidence</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "96.52%" }}
                        transition={{ duration: 1, delay: 0.45 }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-bright via-emerald-400 to-lime-300"
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {activityFeed.map(({ title, value, meta, icon: Icon }, index) => (
                      <motion.div
                        key={title}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 + index * 0.1 }}
                        className="flex items-start gap-4 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                      >
                        <div className="rounded-2xl bg-white/10 p-3">
                          <Icon className="text-2xl text-teal-100" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-teal-100/65">
                            {title}
                          </p>
                          <p className="mt-1 text-lg font-semibold">{value}</p>
                          <p className="mt-1 text-sm text-teal-50/75">{meta}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[1.75rem] border border-line bg-white/55 px-5 py-4 dark:bg-slate-950/25">
            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-muted">
              <span className="rounded-full bg-brand/10 px-3 py-1.5 text-brand">
                AI waste detection
              </span>
              <span className="rounded-full bg-brand/10 px-3 py-1.5 text-brand">
                Smart bin recommendation
              </span>
              <span className="rounded-full bg-brand/10 px-3 py-1.5 text-brand">
                Hazard-aware guidance
              </span>
              <span className="rounded-full bg-brand/10 px-3 py-1.5 text-brand">
                Environmental awareness
              </span>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-line bg-slate-950 px-5 py-4 text-white dark:bg-white dark:text-slate-950">
            <p className="text-xs uppercase tracking-[0.25em] text-white/60 dark:text-slate-500">
              Product promise
            </p>
            <p className="mt-2 text-sm leading-7 text-white/85 dark:text-slate-700">
              From first upload to final disposal instruction, the experience stays
              clear, practical, and professional for real-world daily use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

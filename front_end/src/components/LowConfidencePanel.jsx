import { motion } from "framer-motion";
import { HiArrowPath, HiExclamationTriangle } from "react-icons/hi2";

export default function LowConfidencePanel({ message, tips, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel border-amber-500/20 p-6 sm:p-8"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/15 text-3xl text-amber-500">
          <HiExclamationTriangle />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-600 dark:text-amber-400">
            Low confidence detection
          </p>
          <h3 className="mt-3 font-heading text-2xl font-bold">
            We need a clearer image before making a reliable waste decision.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted">{message}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {tips.map((tip) => (
              <div
                key={tip}
                className="rounded-2xl border border-amber-500/15 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
              >
                {tip}
              </div>
            ))}
          </div>

          <button
            onClick={onReset}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-amber-600"
          >
            <HiArrowPath />
            Upload again
          </button>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from "framer-motion";

export default function SectionHeading({ eyebrow, title, description, centered = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55 }}
      className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}
    >
      <span className="inline-flex rounded-full border border-brand/20 bg-brand/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.32em] text-brand dark:border-brand-bright/20 dark:text-brand-soft">
        {eyebrow}
      </span>
      <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-muted sm:text-lg">{description}</p>
    </motion.div>
  );
}

import { motion } from "framer-motion";
import {
  HiArchiveBox,
  HiBeaker,
  HiBolt,
  HiSparkles,
} from "react-icons/hi2";
import SectionHeading from "./SectionHeading";

const categories = [
  {
    icon: HiBolt,
    title: "Black Bin",
    subtitle: "E-Waste / General Waste",
    accent: "from-slate-900 to-slate-700",
    samples: "Chargers, cables, mixed non-recyclables, damaged gadgets",
    description: "For electronics and general waste streams that need controlled disposal or specialized recovery.",
  },
  {
    icon: HiSparkles,
    title: "Blue Bin",
    subtitle: "Recyclable Waste",
    accent: "from-sky-500 to-blue-700",
    samples: "Glass, paper, cardboard, clean plastic and metal packaging",
    description: "For dry recyclables that can be routed into material recovery systems.",
  },
  {
    icon: HiArchiveBox,
    title: "Green Bin",
    subtitle: "Organic Waste",
    accent: "from-emerald-500 to-lime-700",
    samples: "Food scraps, fruit peels, garden waste, compostable organics",
    description: "For biodegradable materials suitable for composting or bio-processing streams.",
  },
  {
    icon: HiBeaker,
    title: "Red Bin",
    subtitle: "Biomedical Waste",
    accent: "from-rose-500 to-red-700",
    samples: "Masks, syringes, bandages, contaminated medical disposables",
    description: "For infectious or high-risk healthcare waste that requires safe handling and regulated treatment.",
  },
];

export default function CategorySection() {
  return (
    <section id="categories" className="section-gap">
      <div className="section-shell">
        <SectionHeading
          eyebrow="Waste Streams"
          title="Color-coded guidance users can understand instantly"
          description="WasteIQ AI translates model predictions into practical bin-routing guidance so the next action feels clear, not technical."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
          {categories.map(({ icon: Icon, title, subtitle, accent, description, samples }, index) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              whileHover={{ y: -8 }}
              className="glass-panel overflow-hidden transition-shadow duration-300 hover:shadow-[0_24px_80px_rgba(20,184,166,0.12)]"
            >
              <div className={`h-2 bg-gradient-to-r ${accent}`} />
              <div className="p-7">
                <div className={`inline-flex rounded-2xl bg-gradient-to-br ${accent} p-4 text-2xl text-white shadow-[0_0_32px_rgba(255,255,255,0.08)]`}>
                  <Icon />
                </div>
                <h3 className="mt-6 font-heading text-2xl font-bold">{title}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.24em] text-muted">
                  {subtitle}
                </p>
                <p className="mt-4 text-sm leading-7 text-muted">{description}</p>
                <div className="mt-6 rounded-2xl border border-line bg-white/50 p-4 dark:bg-slate-950/35">
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand">
                    Sample waste types
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted">{samples}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

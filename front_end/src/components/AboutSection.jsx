import { motion } from "framer-motion";
import {
  HiArchiveBox,
  HiBeaker,
  HiGlobeAlt,
  HiShieldExclamation,
  HiSparkles,
} from "react-icons/hi2";
import SectionHeading from "./SectionHeading";

const storyBlocks = [
  {
    icon: HiSparkles,
    title: "AI Waste Detection",
    description:
      "Identify common household, recyclable, organic, hazardous, and sanitary waste from a simple image upload.",
    eyebrow: "Faster sorting",
  },
  {
    icon: HiArchiveBox,
    title: "Smart Bin Recommendation",
    description:
      "Every result maps to the correct color bin so users can move from uncertainty to action immediately.",
    eyebrow: "Clear next step",
  },
  {
    icon: HiGlobeAlt,
    title: "Recycling and Reuse Guidance",
    description:
      "Beyond classification, the system suggests practical reuse ideas and better recovery pathways when they exist.",
    eyebrow: "More useful results",
  },
  {
    icon: HiShieldExclamation,
    title: "Hazardous Waste Alerts",
    description:
      "High-risk items are surfaced with extra caution, helping people handle sensitive waste more responsibly.",
    eyebrow: "Safer disposal",
  },
  {
    icon: HiBeaker,
    title: "Environmental Impact Awareness",
    description:
      "Each recommendation is framed around cleaner habits, reduced contamination, and a more sustainable disposal workflow.",
    eyebrow: "Real-world impact",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="section-gap pt-10 sm:pt-12">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <SectionHeading
            eyebrow="Why Choose Our System"
            title="Why choose our AI waste segregation system"
            description="The experience focuses on practical waste decisions: identify the item, route it to the right bin, and understand how to handle it more responsibly."
          />

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {storyBlocks.map(({ icon: Icon, title, description, eyebrow }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.01 }}
                className="glass-panel group p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-bright to-brand-moss text-2xl text-white transition duration-300 group-hover:scale-105">
                  <Icon />
                </div>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.26em] text-brand">
                  {eyebrow}
                </p>
                <h3 className="mt-3 font-heading text-xl font-bold leading-tight">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

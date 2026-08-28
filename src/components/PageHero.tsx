import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function PageHero({ eyebrow, title, description, icon }: { eyebrow: string; title: string; description: string; icon?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-[#071f19] pb-20 pt-36 text-white">
      <div className="absolute -right-24 top-16 h-80 w-80 rounded-full bg-[#e3bc62]/10 blur-3xl" />
      <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e3bc62]/60 to-transparent" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e3bc62]">{icon}{eyebrow}</div>
        <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-[-0.03em] sm:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">{description}</p>
      </motion.div>
    </section>
  )
}

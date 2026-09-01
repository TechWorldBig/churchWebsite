import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Images, X } from 'lucide-react'
import PageHero from '../components/PageHero'
import { getGallery } from '../data/api'
import { GalleryPhoto } from '../data/memberStore'

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })

export default function Gallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [active, setActive] = useState<GalleryPhoto | null>(null)
  useEffect(() => { getGallery().then(setPhotos).catch(() => setPhotos([])) }, [])
  useEffect(() => {
    if (!active) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setActive(null)
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [active])
  return <><PageHero eyebrow="Memories & moments" title="JSC YDM Kollemcode Gallery" description="A visual glimpse of JSC Youth Development Ministry Kollemcode, our church community, ministry spaces and shared moments of faith, fellowship and service." icon={<Images size={15} />} /><section className="py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8">{photos.length === 0 ? <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">Photos uploaded by the administrator will appear here.</div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{photos.map((item, index) => <motion.button key={item.id} onClick={() => setActive(item)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm"><div className="h-64 overflow-hidden bg-slate-100"><img src={item.photo} alt={item.description || 'JSC YDM Kollemcode ministry'} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.14em] text-emerald-700"><CalendarDays size={14} /> {formatDate(item.date)}</p>{item.description && <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>}</div></motion.button>)}</div>}</div></section><AnimatePresence>{active && <motion.div role="dialog" aria-modal="true" aria-label="Expanded gallery photo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4" onClick={() => setActive(null)}><button className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white" aria-label="Close photo"><X /></button><motion.img onClick={event => event.stopPropagation()} initial={{ scale: .94 }} animate={{ scale: 1 }} src={active.photo} alt={active.description || 'JSC YDM Kollemcode ministry'} className="max-h-[88vh] max-w-[95vw] rounded-2xl object-contain" /></motion.div>}</AnimatePresence></>
}

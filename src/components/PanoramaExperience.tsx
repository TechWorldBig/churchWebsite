import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, MoveHorizontal } from 'lucide-react'
import { panoramaFrames } from '../data/siteData'

export default function PanoramaExperience() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const lock = useRef(false)
  const go = (delta: number) => { setDirection(delta); setIndex((index + delta + panoramaFrames.length) % panoramaFrames.length) }

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) < 20 || lock.current) return
      lock.current = true; go(event.deltaY > 0 ? 1 : -1); window.setTimeout(() => { lock.current = false }, 650)
    }
    const element = document.getElementById('panorama-stage')
    element?.addEventListener('wheel', onWheel, { passive: true })
    return () => element?.removeEventListener('wheel', onWheel)
  }, [index])

  return <div id="panorama-stage" className="group relative h-[72vh] min-h-[560px] overflow-hidden bg-black"><AnimatePresence initial={false} custom={direction}><motion.img key={panoramaFrames[index]} src={panoramaFrames[index]} alt={`JSC campus view ${index + 1}`} custom={direction} initial={{ opacity: 0, scale: 1.08, x: direction > 0 ? '4%' : '-4%' }} animate={{ opacity: 1, scale: 1.01, x: 0 }} exit={{ opacity: 0, scale: 1.04, x: direction > 0 ? '-3%' : '3%' }} transition={{ duration: .75, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 h-full w-full object-cover" draggable={false} /></AnimatePresence><div className="absolute inset-0 bg-gradient-to-b from-[#031611]/20 via-transparent to-[#031611]/90" /><div className="absolute inset-0 bg-gradient-to-r from-[#031611]/55 via-transparent to-transparent" /><div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-9 lg:px-8"><div className="flex justify-end gap-3"><button onClick={() => go(-1)} className="panorama-button" aria-label="Previous view"><ChevronLeft /></button><div className="glass-dark flex items-center gap-2 rounded-full px-4 py-3 text-xs font-semibold text-white/70"><MoveHorizontal size={15}/>{index + 1} / {panoramaFrames.length}</div><button onClick={() => go(1)} className="panorama-button" aria-label="Next view"><ChevronRight /></button></div><div className="mt-5 flex justify-end gap-2">{panoramaFrames.map((_, i) => <button key={i} onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i) }} className={`h-1.5 rounded-full transition-all ${i === index ? 'w-12 bg-[#e3bc62]' : 'w-5 bg-white/35'}`} aria-label={`Go to view ${i + 1}`} />)}</div></div></div>
}

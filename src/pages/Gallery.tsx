import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Images, X } from 'lucide-react'
import PageHero from '../components/PageHero'
import { galleryItems } from '../data/siteData'

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null)
  return <><PageHero eyebrow="Memories & moments" title="Gallery" description="A visual glimpse of the JSC campus and ministry spaces, built from the five reference screenshots you supplied." icon={<Images size={15}/>}/><section className="py-20"><div className="mx-auto max-w-7xl px-5 lg:px-8"><div className="grid auto-rows-[260px] gap-4 md:grid-cols-2 lg:grid-cols-3">{galleryItems.map((item,i)=><motion.button key={item.src} onClick={()=>setActive(i)} initial={{opacity:0,scale:.97}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} className={`group relative overflow-hidden rounded-3xl text-left ${i===0||i===3?'md:col-span-2':''}`}><img src={item.src} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/><div className="absolute bottom-0 p-5 text-white"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#e3bc62]">{item.category}</p><h2 className="mt-1 text-xl font-black">{item.title}</h2></div></motion.button>)}</div></div></section><AnimatePresence>{active!==null&&<motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4" onClick={()=>setActive(null)}><button className="absolute right-5 top-5 rounded-full bg-white/10 p-3 text-white"><X/></button><motion.img initial={{scale:.94}} animate={{scale:1}} src={galleryItems[active].src} alt={galleryItems[active].title} className="max-h-[88vh] max-w-[95vw] rounded-2xl object-contain"/></motion.div>}</AnimatePresence></>
}

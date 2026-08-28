import { type ReactNode, useState } from 'react'
import { Menu, X, Cross, Instagram, Youtube } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import AdminGallery from '../pages/AdminGallery'

const links = [
  ['Home', '/'],
  ['YDM Members', '/members'],
  ['Gallery', '/gallery'],
  ['Programs', '/programs'],
  ['Attendance', '/attendance'],
  ['About', '/about'],
  ['Admin', '/admin'],
]

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-stone-50 text-slate-900">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#071f19]/88 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-5 lg:px-8">
          <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e3bc62] text-[#071f19] shadow-lg shadow-black/15 transition group-hover:rotate-3 sm:h-11 sm:w-11 sm:rounded-2xl">
              <Cross size={22} strokeWidth={2.4} />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-black tracking-[0.08em] sm:text-base">JSC YDM</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-white/55 sm:block">Youth Development Ministry</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-white text-[#071f19]' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <button className="rounded-xl p-2 lg:hidden" aria-label="Toggle navigation" onClick={() => setOpen((v) => !v)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
        <AnimatePresence>
          {open && (
            <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden border-t border-white/10 bg-[#071f19] px-4 shadow-2xl lg:hidden">
              <div className="grid gap-1 py-4">
                {links.map(([label, to]) => (
                  <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `rounded-xl px-4 py-3 font-semibold ${isActive ? 'bg-white text-[#071f19]' : 'text-white/70'}`}>
                    {label}
                  </NavLink>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main>{children}{location.pathname === '/admin' && <div className="border-t border-slate-200 bg-stone-50"><AdminGallery embedded /></div>}</main>

      <footer className="bg-[#041511] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3 font-black"><Cross className="text-[#e3bc62]" /> JSC Youth Development Ministry</div>
            <p className="max-w-md text-sm leading-7 text-white/55">A Christ-centered youth community growing together through worship, Scripture, fellowship, service and leadership.</p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#e3bc62]">Explore</h3>
            <div className="grid gap-2 text-sm text-white/60"><Link to="/members">YDM Members</Link><Link to="/gallery">Gallery</Link><Link to="/programs">Programs</Link><Link to="/attendance">Attendance</Link><Link to="/about">About</Link></div>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-[#e3bc62]">Connect</h3>
            <div className="flex gap-3"><span className="social-icon"><Instagram size={18} /></span><span className="social-icon"><Youtube size={18} /></span></div>
          </div>
        </div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/35">© {new Date().getFullYear()} JSC Youth Development Ministry. Faith • Fellowship • Service.</div>
      </footer>
    </div>
  )
}
